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

  const text = await response.clone().text();
  const contentType = response.headers.get('content-type') || '';

  if (!response.ok) {
    if (contentType.includes('application/json')) {
      try {
        const obj = JSON.parse(text);
        if (obj.detail) throw new Error(String(obj.detail));
        if (obj.errors) {
          if (Array.isArray(obj.errors)) {
            const msgs = obj.errors.map((e: any) => e.msg || JSON.stringify(e)).join(' | ');
            throw new Error(msgs);
          } else if (typeof obj.errors === 'object') {
            const parts: string[] = [];
            for (const k of Object.keys(obj.errors)) {
              const v = obj.errors[k];
              parts.push(`${k}: ${Array.isArray(v) ? v.join(', ') : String(v)}`);
            }
            throw new Error(parts.join(' | '));
          }
        }
        if (obj.message) throw new Error(String(obj.message));
        throw new Error(`Erreur ${response.status}`);
      } catch (err: any) {
        throw new Error(err?.message || `Erreur ${response.status}: ${text}`);
      }
    }

    throw new Error(`Erreur ${response.status}: ${text.slice(0, 300)}`);
  }

  if (contentType.includes('application/json')) return response.json();
  return JSON.parse(text || 'null');
};

const updateUser = async (id: number, userData: any) => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(userData),
  });

  const text = await response.clone().text();
  const contentType = response.headers.get('content-type') || '';

  console.log(`[updateUser] Status: ${response.status}, Response text:`, text);

  if (!response.ok) {
    if (contentType.includes('application/json')) {
      try {
        const obj = JSON.parse(text);
        console.log('[updateUser] Parsed object:', obj);
        if (obj.detail) {
          if (Array.isArray(obj.detail)) {
            const msgs = obj.detail.map((e: any) => e.msg || JSON.stringify(e)).join(' | ');
            throw new Error(msgs);
          } else {
            throw new Error(String(obj.detail));
          }
        }
        if (obj.errors) {
          if (Array.isArray(obj.errors)) {
            const msgs = obj.errors.map((e: any) => e.msg || JSON.stringify(e)).join(' | ');
            throw new Error(msgs);
          } else if (typeof obj.errors === 'object') {
            const parts: string[] = [];
            for (const k of Object.keys(obj.errors)) {
              const v = obj.errors[k];
              parts.push(`${k}: ${Array.isArray(v) ? v.join(', ') : String(v)}`);
            }
            throw new Error(parts.join(' | '));
          }
        }
        if (obj.message) throw new Error(String(obj.message));
        throw new Error(`Erreur ${response.status}: ${text}`);
      } catch (err: any) {
        throw new Error(err?.message || `Erreur ${response.status}: ${text}`);
      }
    }
    throw new Error(`Erreur ${response.status}: ${text.slice(0, 300)}`);
  }

  if (contentType.includes('application/json')) return response.json();
  return JSON.parse(text || 'null');
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
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    headers: getHeaders(),

  });
  return response.json();
};

const createProduct = async (productData: any) => {
  const headers = getHeaders();
  console.log('Token envoyé:', localStorage.getItem('cev_auth_token'));
  console.log('Headers:', headers);
  console.log('Payload:', productData);

  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(productData),
  });

  console.log('Response status:', response.status);

  // Gérer les erreurs HTTP
  if (!response.ok) {
    const text = await response.text();
    console.log('Error response:', text);
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


// ============ ORDERS ============

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
  return response.json();
};

const deleteOrder = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
    method: 'DELETE',

    headers: getHeaders(),
  });
  return response.json();
};

// ============ PANIER (CART) ============

const addToCart = async (userId: number, productId: number, quantity: number = 1) => {
  const response = await fetch(`${API_BASE_URL}/orders/cart/add?user_id=${userId}`, {
    method: 'POST',

    headers: getHeaders(),
    body: JSON.stringify({ product_id: productId, quantity }),
  });
  return response.json();
};

const getUserCart = async (userId: number) => {
  const response = await fetch(`${API_BASE_URL}/orders/cart/${userId}`, {
    headers: getHeaders(),

  });
  return response.json();
};

const emptyCart = async (userId: number) => {
  const response = await fetch(`${API_BASE_URL}/orders/cart/${userId}`, {
    method: 'DELETE',

    headers: getHeaders(),
  });
  return response.json();
};

const updateCartItemQuantity = async (userId: number, productId: number, quantity: number) => {
  const response = await fetch(`${API_BASE_URL}/orders/cart/${userId}/product/${productId}`, {
    method: 'PUT',

    headers: getHeaders(),
    body: JSON.stringify({ quantity }),
  });
  return response.json();
};

const removeFromCart = async (userId: number, productId: number) => {
  const response = await fetch(`${API_BASE_URL}/orders/cart/${userId}/product/${productId}`, {
    method: 'DELETE',

    headers: getHeaders(),
  });
  return response.json();
};


const downloadInvoice = async (orderId: number) => {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/invoice`, {
    headers: getHeaders(),

  });
  return response;
};

const processPayment = async (orderId: number, paypalEmail: string, approve: boolean = true) => {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/payment`, {
    method: 'POST',

    headers: getHeaders(),
    body: JSON.stringify({ paypal_email: paypalEmail, approve }),
  });
  return response.json();
};

const applyDiscount = async (orderId: number, discountCode: string) => {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/apply-discount?discount_code=${discountCode}`, {
    method: 'POST',

    headers: getHeaders(),
  });
  return response.json();
};

const removeDiscount = async (orderId: number) => {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/remove-discount`, {
    method: 'DELETE',

    headers: getHeaders(),
  });
  return response.json();
};

// ============ AUTH ============

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

export const createShiftNote = async (data: any, id: number) => {
  const response = await fetch(`${API_BASE_URL}/shift-notes/${id}`, {
    method: 'POST',

    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
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

export const voteProduct = async (productId: number, vote: number) => {
  const response = await fetch(`${API_BASE_URL}/products/${productId}/vote/`, {
    method: 'POST',

    headers: getHeaders(),
    body: JSON.stringify({ vote }),
  });
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

  const contentType = response.headers.get('content-type') || '';
  const text = await response.clone().text();

  if (!contentType.includes('application/json')) {
    // Return a clearer error when server responds with HTML (e.g. index.html or error page)
    const snippet = text.slice(0, 300).replace(/\s+/g, ' ').trim();
    throw new Error(`Non-JSON response (${response.status}): ${snippet}`);
  }

  if (!response.ok) {
    try {
      const err = JSON.parse(text);
      throw new Error(err.detail || `Erreur ${response.status}`);
    } catch {
      throw new Error(`Erreur ${response.status}: ${text.slice(0, 300)}`);
    }
  }

  return response.json();
};

export const getLogsByUser = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/logs/user/${id}`, {
    method: 'GET',
    credentials: 'include',
    headers: getHeaders(),
  });

  const contentType = response.headers.get('content-type') || '';
  const text = await response.clone().text();

  if (!contentType.includes('application/json')) {
    const snippet = text.slice(0, 300).replace(/\s+/g, ' ').trim();
    throw new Error(`Non-JSON response (${response.status}): ${snippet}`);
  }

  if (!response.ok) {
    try {
      const err = JSON.parse(text);
      throw new Error(err.detail || `Erreur ${response.status}`);
    } catch {
      throw new Error(`Erreur ${response.status}: ${text.slice(0, 300)}`);
    }
  }

  return response.json();
};

export const getDashboardStats = async () => {
  // Aggregate a few backend endpoints to build dashboard stats for admin
  const result: any = {};

  // Top selling products
  try {
    const resp = await fetch(`${API_BASE_URL}/products/top/sales`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (resp.ok) {
      const json = await resp.json();
      console.log('[getDashboardStats] Top products response:', json);
      result.top_products = Array.isArray(json) ? json : json.top_products || json.results || json.data || [];
      console.log('[getDashboardStats] Parsed top_products:', result.top_products);
    } else {
      console.log('[getDashboardStats] Top products API error:', resp.status);
    }
  } catch (e) {
    console.error('[getDashboardStats] Top products fetch failed:', e);
  }

  // Users (count)
  try {
    const resp = await fetch(`${API_BASE_URL}/users`, { headers: getHeaders() });
    if (resp.ok) {
      const json = await resp.json();
      if (Array.isArray(json)) result.total_users = json.length;
      else if (typeof json.total === 'number') result.total_users = json.total;
      else if (typeof json.count === 'number') result.total_users = json.count;
    }
  } catch (e) { }

  // Orders: count and revenue and last 7 days
  try {
    const resp = await fetch(`${API_BASE_URL}/orders`, { headers: getHeaders() });
    if (resp.ok) {
      const orders = await resp.json();
      let list: any[] = [];
      if (Array.isArray(orders)) list = orders;
      else if (Array.isArray(orders.results)) list = orders.results;
      else if (Array.isArray(orders.data)) list = orders.data;

      result.total_orders = list.length;

      // revenue: sum paid
      const revenue = list.reduce((s: number, o: any) => {
        const paid = (o.status || '').toLowerCase() === 'paid' || (o.paid === true);
        const amount = Number(o.total_amount ?? o.amount ?? 0) || 0;
        return s + (paid ? amount : 0);
      }, 0);
      result.total_revenue = revenue;

      // orders last 7 days
      const last7: { date: string; count: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() - i);
        last7.push({ date: d.toISOString().slice(0, 10), count: 0 });
      }
      list.forEach((o: any) => {
        const created = o.created_at || o.created || o.createdAt || o.date;
        if (!created) return;
        const d = new Date(created);
        if (isNaN(d.getTime())) return;
        const iso = d.toISOString().slice(0, 10);
        const slot = last7.find((s) => s.date === iso);
        if (slot) slot.count += 1;
      });
      result.orders_last_7_days = last7.map((s) => ({ date: s.date, count: s.count }));
    }
  } catch (e) { }

  return result;
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
  getPriceInfos,
  View,
  Purchase,
  // Orders
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  // Cart
  addToCart,
  getUserCart,
  emptyCart,
  updateCartItemQuantity,
  removeFromCart,
  // Payment & Invoice
  downloadInvoice,
  processPayment,
  applyDiscount,
  removeDiscount,
  // Auth
  login,
  verify2FA,
  register,
};


