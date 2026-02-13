import type { Product } from '../types/Product';
import { getHeaders, API_BASE_URL } from '../api/api';

interface ApiProduct {
  id: number;
  name: string;
  description: string | null;
  price?: number | string;
  base_price?: number | string;
  current_price?: number | string;
  price_infos?: any;
  stock: number;
  category_id: number;
  status: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

function mapApiProductToProduct(apiProduct: ApiProduct): Product {
  const tryNumber = (v: any) => {
    if (v === undefined || v === null) return undefined;
    if (typeof v === 'number') return v;
    const n = Number(v);
    return isNaN(n) ? undefined : n;
  };

  let price = tryNumber(apiProduct.price ?? apiProduct.current_price ?? apiProduct.base_price);
  if (price === undefined && apiProduct.price_infos) {
    if (Array.isArray(apiProduct.price_infos) && apiProduct.price_infos.length > 0) {
      price = tryNumber(apiProduct.price_infos[0].price ?? apiProduct.price_infos[0].current_price);
    } else if (typeof apiProduct.price_infos === 'object') {
      price = tryNumber(apiProduct.price_infos.price ?? apiProduct.price_infos.current_price ?? apiProduct.price_infos.base_price);
    }
  }

  const finalPrice = price ?? 0;

  // Si image_url n'existe pas ou est vide, utiliser l'endpoint du backend
  const imageUrl = apiProduct.image_url && apiProduct.image_url.trim()
    ? apiProduct.image_url
    : `/products/${apiProduct.id}/image`;

  return {
    id: apiProduct.id,
    name: apiProduct.name,
    description: apiProduct.description || '',
    base_price: finalPrice,
    current_price: finalPrice,
    image: imageUrl,
    stock: apiProduct.stock,
    popularity_score: 5.0,
    category_id: apiProduct.category_id
  };
}

export async function getAllShopProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'GET',
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
    if (!response.ok) {
      console.warn(`Erreur API getShopProductById: ${response.status}`);
      throw new Error('Produit non trouvé');
    }
    const apiProduct: ApiProduct = await response.json();
    return mapApiProductToProduct(apiProduct);
  } catch (error) {
    console.warn(`Fallback utilisé pour le produit ${id}`, error);
    const fallbackProduct = SHOP_PRODUCTS_BACKUP.find(product => product.id === id);
    if (fallbackProduct) {
      return fallbackProduct;
    }
    // Si l'ID n'est pas dans le backup, créer un produit vide
    return undefined;
  }
};

export const getShopProductsByCategory = async (categoryId: number): Promise<Product[]> => {
  const products = await getAllShopProducts();
  return products.filter(product => product.category_id === categoryId);
};