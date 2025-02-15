import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const TOKEN = "4|ES09JOQNdH7moIW6Lvzc44IPS1LJZyQ6MpO7Vtgnccad2f09"; 

export const addToCart = async (productId: number, quantity: number): Promise<any> => {
  try {
    const response = await axios.post(
      `${API_URL}/cart`,
      { product_id: productId, quantity },
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
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
