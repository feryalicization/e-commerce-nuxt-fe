import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getCategories = async (token: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_URL}/categories`, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Categories:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return null;
  }
};
