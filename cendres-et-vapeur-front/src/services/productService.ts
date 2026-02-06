import type { Product } from '../types/Product';

const MOCK_PRODUCTS: Product[] = [
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
    id: 2,
    name: 'Lampe à Vapeur',
    description: 'Éclairage portable fonctionnant aux cristaux de vapeur',
    base_price: 78,
    current_price: 78,
    image: '',
    stock: 8,
    popularity_score: 9.2,
    category_id: 2
  },
  {
    id: 3,
    name: 'Montre Mécanique',
    description: 'Garde-temps restauré du monde d\'avant',
    base_price: 120,
    current_price: 120,
    image: '',
    stock: 5,
    popularity_score: 7.8,
    category_id: 3
  },
  {
    id: 4,
    name: 'Boussole de Navigation',
    description: 'Instrument de navigation renforcé au cuivre',
    base_price: 65,
    current_price: 65,
    image: '',
    stock: 15,
    popularity_score: 6.5,
    category_id: 4
  },
  {
    id: 5,
    name: 'Lunettes de Protection',
    description: 'Protection oculaire contre la poussière et les cendres',
    base_price: 52,
    current_price: 52,
    image: '',
    stock: 20,
    popularity_score: 8.0,
    category_id: 5
  },
  {
    id: 6,
    name: 'Kit de Survie',
    description: 'Ensemble complet d\'outils pour survivant',
    base_price: 95,
    current_price: 95,
    image: '',
    stock: 7,
    popularity_score: 9.5,
    category_id: 6
  },
  
];

export const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_PRODUCTS), 500);
    });
  },

  getProductById: async (id: number): Promise<Product | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const product = MOCK_PRODUCTS.find(p => p.id === id);
        resolve(product || null);
      }, 300);
    });
  },

  getProductsByCategory: async (categoryId: number): Promise<Product[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const products = MOCK_PRODUCTS.filter(p => p.category_id === categoryId);
        resolve(products);
      }, 400);
    });
  }
};
