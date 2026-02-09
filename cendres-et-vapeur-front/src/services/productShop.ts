import type { Product } from '../types/Product';

const SHOP_PRODUCTS: Product[] = [
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
    {
    id: 7,
    name: 'Marteau de Forge',
    description: 'Outil de forge restauré, indispensable pour l\'artisanat',
    base_price: 85,
    current_price: 88,
    image: '',
    stock: 6,
    popularity_score: 7.2,
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
  {
    id: 9,
    name: 'Gourde en Métal',
    description: 'Contenant robuste pour l\'eau purifiée',
    base_price: 35,
    current_price: 32,
    image: '',
    stock: 25,
    popularity_score: 6.9,
    category_id: 6
  },
  {
    id: 10,
    name: 'Torche Électrique',
    description: 'Lampe rechargeable par manivelle',
    base_price: 58,
    current_price: 58,
    image: '',
    stock: 18,
    popularity_score: 7.5,
    category_id: 2
  },
  {
    id: 11,
    name: 'Couteau Multifonction',
    description: 'Outil de survie avec 12 fonctions intégrées',
    base_price: 72,
    current_price: 75,
    image: '',
    stock: 10,
    popularity_score: 8.3,
    category_id: 6
  },
  {
    id: 12,
    name: 'Sac à Dos Renforcé',
    description: 'Sac de transport en toile renforcée avec structure métallique',
    base_price: 145,
    current_price: 145,
    image: '',
    stock: 9,
    popularity_score: 9.0,
    category_id: 6
  },
  {
    id: 13,
    name: 'Pistolet Lance-Flammes',
    description: 'Arme défensive utilisant le combustible de récupération',
    base_price: 320,
    current_price: 335,
    image: '',
    stock: 3,
    popularity_score: 9.8,
    category_id: 7
  },
  {
    id: 14,
    name: 'Carte de Navigation',
    description: 'Plan des zones sûres et points de ravitaillement',
    base_price: 25,
    current_price: 25,
    image: '',
    stock: 30,
    popularity_score: 5.8,
    category_id: 4
  },
  {
    id: 15,
    name: 'Radio de Communication',
    description: 'Émetteur-récepteur longue portée fonctionnel',
    base_price: 180,
    current_price: 175,
    image: '',
    stock: 5,
    popularity_score: 8.7,
    category_id: 8
  },
  {
    id: 16,
    name: 'Générateur Portable',
    description: 'Petit générateur à manivelle pour charges légères',
    base_price: 210,
    current_price: 210,
    image: '',
    stock: 4,
    popularity_score: 8.1,
    category_id: 2
  },
  {
    id: 17,
    name: 'Binoculaires Militaires',
    description: 'Optique de précision pour repérage longue distance',
    base_price: 98,
    current_price: 95,
    image: '',
    stock: 7,
    popularity_score: 7.4,
    category_id: 4
  },
  {
    id: 18,
    name: 'Trousse Médicale',
    description: 'Kit de premiers soins complet avec désinfectants',
    base_price: 130,
    current_price: 130,
    image: '',
    stock: 11,
    popularity_score: 9.3,
    category_id: 9
  },
  {
    id: 19,
    name: 'Gants Renforcés',
    description: 'Protection des mains en cuir épais avec plaques métalliques',
    base_price: 42,
    current_price: 42,
    image: '',
    stock: 16,
    popularity_score: 6.7,
    category_id: 5
  },
  {
    id: 20,
    name: 'Extracteur d\'Eau',
    description: 'Dispositif de condensation pour récupérer l\'humidité de l\'air',
    base_price: 165,
    current_price: 168,
    image: '',
    stock: 8,
    popularity_score: 8.9,
    category_id: 10
  },
  {
    id: 21,
    name: 'Casque de Protection',
    description: 'Casque blindé avec visière anti-éclats',
    base_price: 88,
    current_price: 88,
    image: '',
    stock: 13,
    popularity_score: 7.6,
    category_id: 5
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getAllShopProducts = async (): Promise<Product[]> => {
  await delay(500);
  return SHOP_PRODUCTS;
};

export const getShopProductById = async (id: number): Promise<Product | undefined> => {
  await delay(300);
  return SHOP_PRODUCTS.find(product => product.id === id);
};

export const getShopProductsByCategory = async (categoryId: number): Promise<Product[]> => {
  await delay(400);
  return SHOP_PRODUCTS.filter(product => product.category_id === categoryId);
};
