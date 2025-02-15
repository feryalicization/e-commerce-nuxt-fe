import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/products';

export const getProducts = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: { accept: 'application/json' }
    });
    console.log('API Response:', response.data); 
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};
