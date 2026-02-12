const API_BASE_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || '');

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


const getUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Erreur serveur: ${response.status}`);
  }

  return response.json();
};

const getUserById = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    headers: getHeaders(),
  });
  return response.json();
};

const createUser = async (userData: any) => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const text = await response.text();
    try {
      const errorData = JSON.parse(text);
      throw new Error(errorData.detail || `Erreur ${response.status}`);
    } catch {
      throw new Error(`Erreur ${response.status}: ${text}`);
    }
  }

  return response.json();
};

const updateUser = async (id: number, userData: any) => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const text = await response.text();
    try {
      const errorData = JSON.parse(text);
      throw new Error(errorData.detail || `Erreur ${response.status}`);
    } catch {
      throw new Error(`Erreur ${response.status}: ${text}`);
    }
  }

  return response.json();
};

const deleteUser = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return response.json();
};


const getProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/products`, {
    headers: getHeaders(),

  });
  return response.json();
};

const getProductById = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/product/${id}`, {
    headers: getHeaders(),

  });
  return response.json();
};

const createProduct = async (productData: any) => {
  const headers = getHeaders();

  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(productData),
  });


  if (!response.ok) {
    const text = await response.text();
    try {
      const errorData = JSON.parse(text);
      throw new Error(errorData.detail || `Erreur ${response.status}`);
    } catch {
      throw new Error(`Erreur ${response.status}: ${text}`);
    }
  }

  return response.json();
};

const updateProduct = async (id: number, productData: any) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const text = await response.text();
    try {
      const errorData = JSON.parse(text);
      throw new Error(errorData.detail || `Erreur ${response.status}`);
    } catch {
      throw new Error(`Erreur ${response.status}: ${text}`);
    }
  }

  return response.json();
};

const deleteProduct = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',

    headers: getHeaders(),
  });
  return response.json();
};

const getPriceInfos = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}/price-infos`, {
    headers: getHeaders(),

  });
  return response.json();
};

const View = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}/view`, {
    method: 'POST',
    headers: getHeaders(),

  });
  return response.json();
};

const Purchase = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}/purchase`, {
    method: 'POST',
    headers: getHeaders(),

  });
  return response.json();
};

const Getbroadcast = async () => {
  const response = await fetch(`${API_BASE_URL}/chat/users`, {
    headers: getHeaders(),
  });
  return response.json();
};

const sendChatMessage = async (message: string, excludeId: number) => {
  const response = await fetch(`${API_BASE_URL}/mail/broadcast`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ message, exclude_client_id: excludeId }),
  });
  console.log('sendChatMessage response status:', response.status);
  return response.json();
};

const getChatMessages = async () => {
  const response = await fetch(`${API_BASE_URL}/chat/users`, {
    headers: getHeaders(),
  });
  console.log('getChatMessages response status:', response.status);
  return response.json();
};

const getWsStatus = async (clientId: string) => {
  const response = await fetch(`${API_BASE_URL}/mail/ws/${clientId}`, {
    headers: getHeaders(),
  });
  return response.json();
};



const getOrders = async () => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    headers: getHeaders(),

  });
  return response.json();
};

const getOrderById = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
    headers: getHeaders(),

  });
  return response.json();
};

const createOrder = async (orderData: { status: string; total_amount: number; user_id: number }) => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',

    headers: getHeaders(),
    body: JSON.stringify(orderData),
  });
  return response.json();
};

const updateOrder = async (id: number, orderData: { status: string; total_amount: number; user_id: number }) => {
  const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const text = await response.text();
    try {
      const errorData = JSON.parse(text);
      throw new Error(errorData.detail || `Erreur ${response.status}`);
    } catch {
      throw new Error(`Erreur ${response.status}: ${text}`);
    }
  }

  return response.json();
};

const deleteOrder = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
    method: 'DELETE',

    headers: getHeaders(),
  });
  return response.json();
};

const addToCart = async (userId: number, productId: number, quantity: number = 1) => {
  const response = await fetch(`${API_BASE_URL}/orders/cart/add?user_id=${userId}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ product_id: productId, quantity }),
  });
  if (!response.ok) {
    const text = await response.text();
    try { throw new Error(JSON.parse(text).detail || `Erreur ${response.status}`); }
    catch { throw new Error(`Erreur ${response.status}: ${text}`); }
  }
  return response.json();
};

const getUserCart = async (userId: number) => {
  const response = await fetch(`${API_BASE_URL}/orders/cart/${userId}`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Erreur ${response.status}`);
  }
  return response.json();
};

const emptyCart = async (userId: number) => {
  const response = await fetch(`${API_BASE_URL}/orders/cart/${userId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Erreur ${response.status}`);
  }
  return response.json();
};

const updateCartItemQuantity = async (userId: number, productId: number, quantity: number) => {
  const response = await fetch(`${API_BASE_URL}/orders/cart/${userId}/product/${productId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ quantity }),
  });
  if (!response.ok) {
    const text = await response.text();
    try { throw new Error(JSON.parse(text).detail || `Erreur ${response.status}`); }
    catch { throw new Error(`Erreur ${response.status}: ${text}`); }
  }
  return response.json();
};

const removeFromCart = async (userId: number, productId: number) => {
  const response = await fetch(`${API_BASE_URL}/orders/cart/${userId}/product/${productId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Erreur ${response.status}`);
  }
  return response.json();
};

const downloadInvoice = async (orderId: number) => {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/invoice`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Erreur ${response.status}`);
  }
  return response;
};

const processPayment = async (orderId: number, paypalEmail: string, approve: boolean = true) => {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/payment`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ paypal_email: paypalEmail, approve }),
  });
  if (!response.ok) {
    const text = await response.text();
    try { throw new Error(JSON.parse(text).detail || `Erreur ${response.status}`); }
    catch { throw new Error(`Erreur ${response.status}: ${text}`); }
  }
  return response.json();
};

const applyDiscount = async (orderId: number, discountCode: string) => {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/apply-discount?discount_code=${discountCode}`, {
    method: 'POST',
    headers: getHeaders(),
  });
  if (!response.ok) {
    const text = await response.text();
    try { throw new Error(JSON.parse(text).detail || `Erreur ${response.status}`); }
    catch { throw new Error(`Erreur ${response.status}: ${text}`); }
  }
  return response.json();
};

const removeDiscount = async (orderId: number) => {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/remove-discount`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Erreur ${response.status}`);
  }
  return response.json();
};

const login = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
    method: 'POST',

    headers: getHeaders(),
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};

const verify2FA = async (userId: number, code: string) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/verify-2fa/`, {
    method: 'POST',

    headers: getHeaders(),
    body: JSON.stringify({ user_id: userId, code }),
  });
  return response.json();
};

const register = async (username: string, email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/register/`, {
    method: 'POST',

    headers: getHeaders(),
    body: JSON.stringify({ username, email, password }),
  });
  return response.json();
};

export const deleteShiftNote = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/shift-notes/${id}`, {
    method: 'DELETE',

    headers: getHeaders(),
  });
  return response.json();
};

export const getShiftNotes = async () => {
  const response = await fetch(`${API_BASE_URL}/shift-notes/`, {
    method: 'GET',

    headers: getHeaders(),
  });
  return response.json();
};

export const getShiftNotesById = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/shift-notes/${id}`, {
    method: 'GET',

    headers: getHeaders(),
  });
  return response.json();
};

export const updateShiftNotes = async (id: number, data: any) => {
  const response = await fetch(`${API_BASE_URL}/shift-notes/${id}`, {
    method: 'PUT',

    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
};

export const createShiftNote = async (data: any) => {
  const url = `${API_BASE_URL}/shift-notes/`;
  if (import.meta.env.VITE_DEBUG) {
    try { console.debug('[api] createShiftNote ->', url, { method: 'POST', credentials: 'include' }); } catch { }
  }
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  const text = await response.clone().text();
  if (!response.ok) {
    try {
      const obj = JSON.parse(text);
      throw new Error(obj.detail || obj.message || `Erreur ${response.status}`);
    } catch {
      throw new Error(`Erreur ${response.status}: ${text}`);
    }
  }

  try { return JSON.parse(text); } catch { return text; }
};

export const getOrderItems = async () => {
  const response = await fetch(`${API_BASE_URL}/order-items/`, {
    method: 'GET',

    headers: getHeaders(),
  });
  return response.json();
};

export const getOrderItemsById = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/order-items/${id}`, {
    method: 'GET',

    headers: getHeaders(),
  });
  return response.json();
};

export const updateOrderItems = async (id: number, data: any) => {
  const response = await fetch(`${API_BASE_URL}/order-items/${id}`, {
    method: 'PUT',

    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
};

export const createOrderItems = async (data: any) => {
  const response = await fetch(`${API_BASE_URL}/order-items/`, {
    method: 'POST',

    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
};

export const deleteOrderItems = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/order-items/${id}`, {
    method: 'DELETE',

    headers: getHeaders(),
  });
  return response.json();
};

export const voteProduct = async (productId: number, vote: any) => {
  const response = await fetch(`${API_BASE_URL}/products/${productId}/vote/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(vote),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Erreur API voteProduct:', response.status, errorText);
    throw new Error(`Erreur ${response.status}: ${errorText}`);
  }

  return response.json();
};

export const likeProduct = async (productId: number, data: any) => {
  const response = await fetch(`${API_BASE_URL}/products/${productId}/like/`, {
    method: 'POST',

    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
};

export const sendMail = async (data: any) => {
  const response = await fetch(`${API_BASE_URL}/mail/`, {
    method: 'POST',

    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
};

export const getMailStatus = async () => {
  const response = await fetch(`${API_BASE_URL}/mail/status/`, {
    method: 'GET',

    headers: getHeaders(),
  });
  return response.json();
};

export const getProductVotes = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}/votes`, {
    method: 'GET',
    credentials: 'include',
    headers: getHeaders(),
  });
  if (!response.ok) {
    console.warn(`Erreur API getProductVotes: ${response.status}`);
    return []; // Retourner un tableau vide si pas de votes
  }
  return response.json();
};

export const getProductLikes = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}/likes-count`, {
    method: 'GET',
    credentials: 'include',
    headers: getHeaders(),
  });
  return response.json();
};

export const getTopVentes = async () => {
  const response = await fetch(`${API_BASE_URL}/products/top/sales`, {
    method: 'GET',
    credentials: 'include',
    headers: getHeaders(),
  });
  return response.json();
};

export const getUsersSearch = async () => {
  const response = await fetch(`${API_BASE_URL}/users/search`, {
    method: 'GET',
    credentials: 'include',
    headers: getHeaders(),
  });
  return response.json();
};

export const getProductsSearch = async () => {
  const response = await fetch(`${API_BASE_URL}/products/search`, {
    method: 'GET',
    credentials: 'include',
    headers: getHeaders(),
  });
  return response.json();
};

export const getLogs = async () => {
  const response = await fetch(`${API_BASE_URL}/logs`, {
    method: 'GET',
    credentials: 'include',
    headers: getHeaders(),
  });
  return response.json();
};

export const getLogsByUser = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/logs/user/${id}`, {
    method: 'GET',
    credentials: 'include',
    headers: getHeaders(),
  });
  return response.json();
};



export const getDashboardStats = async () => {
  const [users, orders, products] = await Promise.all([
    getUsers(),
    getOrders(),
    getProducts(),
  ]);

  const paidOrders = (orders || []).filter((o: any) => o.status === 'paid');
  const totalRevenue = paidOrders.reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0);

  const now = Date.now();
  const ordersLast7Days = [];
  for (let i = 6; i >= 0; i--) {
    const dayStart = new Date(now - i * 86400000);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59, 999);
    const count = (orders || []).filter((o: any) => {
      const d = new Date(o.created_at);
      return d >= dayStart && d <= dayEnd;
    }).length;
    ordersLast7Days.push({ date: dayStart.toISOString(), count });
  }

  const top5 = [...(products || [])]
    .sort((a: any, b: any) => (b.current_price || 0) - (a.current_price || 0))
    .slice(0, 5);

  return {
    total_users: (users || []).length,
    total_orders: (orders || []).length,
    total_revenue: totalRevenue,
    top_products: top5,
    orders_last_7_days: ordersLast7Days,
  };
};

export const uploadProductImage = async (productId: number, file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/products/${productId}/upload-image`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('cev_auth_token')}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    console.error('Erreur upload image:', response.status, text);
    throw new Error(`Erreur ${response.status}: ${text}`);
  }

  return response.json();
};


export {
  API_BASE_URL,
  getHeaders,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getPriceInfos,
  View,
  Purchase,
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  addToCart,
  getUserCart,
  emptyCart,
  updateCartItemQuantity,
  removeFromCart,
  downloadInvoice,
  processPayment,
  applyDiscount,
  removeDiscount,
  login,
  verify2FA,
  register,
  // Chat
  Getbroadcast,
  sendChatMessage,
  getChatMessages,
  getWsStatus,
};


