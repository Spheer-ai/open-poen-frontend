// api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000", // Your Django API server address
});

export const login = async (username: string, password: string) => {
  try {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("grant_type", "password");

    const response = await api.post("/auth/jwt/login", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.data; // Assuming your API returns data on successful login
  } catch (error) {
    throw error;
  }
};

export const getUserData = async (token: any) => {
  const userId = 1; // Hardcoded user ID 1

  try {
    const response = await api.get(`/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("getUserData response:", response.data); // Log the response data
    return response.data;
  } catch (error) {
    console.error("getUserData error:", error); // Log any errors
    throw error;
  }
};

export const logoutUser = async (token: any) => {
  try {
    const response = await api.post("/auth/jwt/logout", null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("logoutUser response:", response.data);
    return response.data;
  } catch (error) {
    console.error("logoutUser error:", error);
    throw error;
  }
};
