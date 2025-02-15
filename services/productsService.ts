import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getProducts = async (search = "") => {
  try {
    const response = await axios.get(`${API_URL}/products`, {
      params: { search },
      headers: { accept: "application/json" },
    });

    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};


export const getProductById = async (id: number): Promise<any> => {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`, {
      headers: { accept: "application/json" },
    });
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null; 
  }
};