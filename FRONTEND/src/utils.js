// src/utils.js

// Ambil URL API dari env atau gunakan localhost sebagai default
export const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

/**
 * Mengambil header standar beserta token Bearer jika tersedia di localStorage
 */
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};