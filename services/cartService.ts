import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const addToCart = async (token: string, productId: number, quantity: number): Promise<any> => {
  try {
    const response = await axios.post(
      `${API_URL}/cart`,
      { product_id: productId, quantity },
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Cart Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    return null;
  }
};


export const getCart = async (token: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_URL}/cart`, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Cart Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    return null;
  }
};


export const updateCartItem = async (cartId: number, quantity: number, token: string): Promise<any> => {
  try {
    const response = await axios.put(
      `${API_URL}/cart/${cartId}`,
      { quantity },
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Cart Update Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating cart item:", error);
    return null;
  }
};


export const deleteCartItem = async (cartId: number, token: string): Promise<any> => {
  try {
    const response = await axios.delete(`${API_URL}/cart/${cartId}`, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Cart Item Deleted:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting cart item:", error);
    return null;
  }
};