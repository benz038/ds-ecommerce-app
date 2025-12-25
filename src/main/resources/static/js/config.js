// API Configuration
const API_BASE_URL = 'http://localhost:8080/api';

const API_ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    PRODUCTS: `${API_BASE_URL}/products`,
    CATEGORIES: `${API_BASE_URL}/categories`,
    CART: `${API_BASE_URL}/cart`,
    CART_ITEMS: `${API_BASE_URL}/cart/items`,
    ORDERS: `${API_BASE_URL}/orders`,
    USERS: `${API_BASE_URL}/users`
};

// Local storage keys
const STORAGE_KEYS = {
    TOKEN: 'jwt_token',
    USER: 'user_info'
};
