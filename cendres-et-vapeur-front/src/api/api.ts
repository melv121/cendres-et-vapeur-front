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


export const getUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/users/`, {
    headers: getHeaders(),
  });
  return response.json();
};

export const getUserById = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/users/${id}`, {
    headers: getHeaders(),
  });
  return response.json();
};

export const createUser = async (userData: any) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/users/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(userData),
  });
  return response.json();
};

export const updateUser = async (id: number, userData: any) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/users/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(userData),
  });
  return response.json();
};

export const deleteUser = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/users/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return response.json();
};

// ============ PRODUITS ============

export const getProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/products`, {
    headers: getHeaders(),
  });
  return response.json();
};

export const getProductById = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    headers: getHeaders(),
  });
  return response.json();
};

export const createProduct = async (productData: any) => {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(productData),
  });
  return response.json();
};

export const updateProduct = async (id: number, productData: any) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(productData),
  });
  return response.json();
};

export const deleteProduct = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return response.json();
};

// ============ COMMANDES ============

export const getOrders = async () => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    headers: getHeaders(),
  });
  return response.json();
};

export const getOrderById = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
    headers: getHeaders(),
  });
  return response.json();
};

export const createOrder = async (orderData: any) => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(orderData),
  });
  return response.json();
};

export const updateOrder = async (id: number, orderData: any) => {
  const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(orderData),
  });
  return response.json();
};

export const deleteOrder = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return response.json();
};


export const getCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    headers: getHeaders(),
  });
  return response.json();
};
