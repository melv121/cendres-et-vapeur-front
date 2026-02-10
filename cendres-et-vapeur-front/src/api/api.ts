const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('cev_auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// ============ UTILISATEURS ============

const getUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/users/`, {
    headers: getHeaders(),
  });
  return response.json();
};

const getUserById = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/users/${id}`, {
    headers: getHeaders(),
  });
  return response.json();
};

const createUser = async (userData: any) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/users/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(userData),
  });
  return response.json();
};

const updateUser = async (id: number, userData: any) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/users/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(userData),
  });
  return response.json();
};

const deleteUser = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/users/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return response.json();
};

// ============ PRODUITS ============

const getProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/products`, {
    headers: getHeaders(),
  });
  return response.json();
};

const getProductById = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    headers: getHeaders(),
  });
  return response.json();
};

const createProduct = async (productData: any) => {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(productData),
  });
  return response.json();
};

const updateProduct = async (id: number, productData: any) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(productData),
  });
  return response.json();
};

const deleteProduct = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return response.json();
};

// ============ COMMANDES ============

const getOrders = async () => {
  const response = await fetch(`${API_BASE_URL}/api/orders`, {
    headers: getHeaders(),
  });
  return response.json();
};

const getOrderById = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
    headers: getHeaders(),
  });
  return response.json();
};

// ============ AUTHENTIFICATION ============

const login = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};

const register = async (username: string, email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ username, email, password }),
  });
  return response.json();
};

// ============ EXPORTS ============

export {
  API_BASE_URL,
  getHeaders,
  // Users
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  // Products
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  // Orders
  getOrders,
  getOrderById,
  // Auth
  login,
  register,
};


