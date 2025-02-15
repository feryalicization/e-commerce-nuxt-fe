import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getProducts = async (search = "",  min_price?: number, max_price?: number) => {
  try {
    const response = await axios.get(`${API_URL}/products`, {
      params: { search, min_price, max_price },
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


export const updateProduct = async (productId: number, productData: any, token: string): Promise<any> => {
  try {
    const response = await axios.put(
      `${API_URL}/products/${productId}`,
      productData,
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Product Updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    return null;
  }
};


export const createProduct = async (token: string, productData: any): Promise<any> => {
  try {
    const response = await axios.post(`${API_URL}/products`, productData, {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Product Created:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    return null;
  }
};


export const deleteProduct = async (token: string, productId: number): Promise<any> => {
  try {
    const response = await axios.delete(`${API_URL}/products/${productId}`, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(`Product ${productId} deleted successfully!`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    return null;
  }
};