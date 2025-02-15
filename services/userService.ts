import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const loginUser = async (email: string, password: string): Promise<any> => {
  try {
    const response = await axios.post(
      `${API_URL}/login`,
      { email, password },
      {
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Login Response:", response.data);
    return response.data; 
  } catch (error) {
    console.error("Login failed:", error);
    return null;
  }
};


export const registerUser = async (email: string, password: string, name: string): Promise<any> => {
  try {
    const response = await axios.post(
      `${API_URL}/register`,
      { email, password, name },
      {
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Register Response:", response.data);
    return response.data; 
  } catch (error) {
    console.error("Register failed:", error);
    return null;
  }
};
