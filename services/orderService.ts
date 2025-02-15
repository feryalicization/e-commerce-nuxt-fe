import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const createOrder = async (token: string): Promise<any> => {
  try {
    const response = await axios.post(
      `${API_URL}/orders`,
      {}, 
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("Order Created:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    return null;
  }
};
