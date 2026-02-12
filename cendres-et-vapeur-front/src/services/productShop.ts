import type { Product } from '../types/Product';
import { getHeaders } from '../api/api';

// Interface pour les produits de l'API
interface ApiProduct {
  id: number;
  name: string;
  description: string | null;
  // price field can come under different names depending on backend
  price?: number | string;
  base_price?: number | string;
  current_price?: number | string;
  // some APIs return price infos separately
  price_infos?: any;
  stock: number;
  category_id: number;
  status: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

// Mapper les produits de l'API vers le format frontend
function mapApiProductToProduct(apiProduct: ApiProduct): Product {
  // find the most likely price field
  const tryNumber = (v: any) => {
    if (v === undefined || v === null) return undefined;
    if (typeof v === 'number') return v;
    const n = Number(v);
    return isNaN(n) ? undefined : n;
  };

  let price = tryNumber(apiProduct.price ?? apiProduct.current_price ?? apiProduct.base_price);
  if (price === undefined && apiProduct.price_infos) {
    // try common shapes
    if (Array.isArray(apiProduct.price_infos) && apiProduct.price_infos.length > 0) {
      price = tryNumber(apiProduct.price_infos[0].price ?? apiProduct.price_infos[0].current_price);
    } else if (typeof apiProduct.price_infos === 'object') {
      price = tryNumber(apiProduct.price_infos.price ?? apiProduct.price_infos.current_price ?? apiProduct.price_infos.base_price);
    }
  }

  const finalPrice = price ?? 0;

  return {
    id: apiProduct.id,
    name: apiProduct.name,
    description: apiProduct.description || '',
    base_price: finalPrice,
    current_price: finalPrice,
    image: apiProduct.image_url || '',
    stock: apiProduct.stock,
    popularity_score: 5.0,
    category_id: apiProduct.category_id
  };
}

// Récupérer les produits depuis l'API
export async function getAllShopProducts(): Promise<Product[]> {
  try {
    const response = await fetch('/products', {
      headers: getHeaders(),
      
    });
    
    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }
    
    const apiProducts: ApiProduct[] = await response.json();
    return apiProducts.map(mapApiProductToProduct);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    throw error;
  }
}

// Données mockées en backup (au cas où l'API ne répond pas)
const SHOP_PRODUCTS_BACKUP: Product[] = [
  {
    id: 1,
    name: 'Engrenage en Cuivre',
    description: 'Mécanisme forgé à la main, récupéré des anciennes usines',
    base_price: 45,
    current_price: 45,
    image: '',
    stock: 12,
    popularity_score: 8.5,
    category_id: 1
  },
  {
    id: 8,
    name: 'Masque à Filtre',
    description: 'Protection respiratoire contre les fumées toxiques',
    base_price: 110,
    current_price: 110,
    image: '',
    stock: 14,
    popularity_score: 8.8,
    category_id: 5
  },
];

export const getShopProductById = async (id: number): Promise<Product | undefined> => {
  try {
    const response = await fetch(`/products/${id}`, {
      headers: getHeaders(),
      
    });
    if (!response.ok) throw new Error('Produit non trouvé');
    const apiProduct: ApiProduct = await response.json();
    return mapApiProductToProduct(apiProduct);
  } catch {
    return SHOP_PRODUCTS_BACKUP.find(product => product.id === id);
  }
};

export const getShopProductsByCategory = async (categoryId: number): Promise<Product[]> => {
  const products = await getAllShopProducts();
  return products.filter(product => product.category_id === categoryId);
};