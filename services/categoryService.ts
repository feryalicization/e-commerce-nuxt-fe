import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getCategories = async (token: string, search: string = ""): Promise<any> => {
  try {
    const response = await axios.get(`${API_URL}/categories`, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      params: { search }, 
    });

    console.log("Categories:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return null;
  }
};


export const createCategory = async (
  token: string,
  name: string,
  description: string
): Promise<any> => {
  try {
    const response = await axios.post(
      `${API_URL}/categories`,
      { name, description }, 
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Category Created:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    return null;
  }
};


export const updateCategory = async (
  token: string,
  categoryId: number,
  categoryName: string,
  description: string
): Promise<any> => {
  try {
    const response = await axios.put(
      `${API_URL}/categories/${categoryId}`,
      { name: categoryName, description }, 
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(
      `Category ID ${categoryId} updated to "${categoryName}" with description "${description}" successfully!`
    );
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    return null;
  }
};


export const deleteCategory = async (token: string, categoryId: number): Promise<boolean> => {
  try {
    await axios.delete(`${API_URL}/categories/${categoryId}`, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(`Category ID ${categoryId} deleted successfully!`);
    return true;
  } catch (error) {
    console.error("Error deleting category:", error);
    return false;
  }
};