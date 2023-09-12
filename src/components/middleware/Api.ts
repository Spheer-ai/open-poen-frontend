// Api.ts
import axios from "axios";

import jwtDecode from "jwt-decode";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const login = async (username: string, password: string) => {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);
  formData.append("grant_type", "password");

  const response = await api.post("/auth/jwt/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data;
};

export const getUserData = async (token: string) => {
  if (!token) {
    throw new Error("User not authenticated");
  }

  // Extract user ID from JWT token
  const decodedToken: any = jwtDecode(token); // You may need to adjust the type of decodedToken

  try {
    const response = await api.get(`/user/${decodedToken.sub}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("getUserData response:", response.data);
    return response.data;
  } catch (error) {
    console.error("getUserData error:", error);
    throw error;
  }
};

export const getUsers = async (token: string) => {
  try {
    if (!token) {
      throw new Error("User not authenticated");
    }

    // Extract user ID from JWT token
    const decodedToken: any = jwtDecode(token);

    const response = await api.get(`/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("getUsers response:", response.data);

    // Sort users based on the logged-in user's ID
    const sortedUsers = response.data.users.slice(); // Create a copy of the users array
    sortedUsers.sort((a, b) => {
      if (a.id === decodedToken.sub) {
        return -1; // Place the logged-in user at the top
      } else if (b.id === decodedToken.sub) {
        return 1;
      }
    });

    return { users: sortedUsers };
  } catch (error) {
    console.error("getUsers error:", error);
    throw error;
  }
};

export const logoutUser = async (token: string) => {
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
