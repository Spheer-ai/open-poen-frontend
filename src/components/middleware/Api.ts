import axios from "axios";

import jwtDecode from "jwt-decode";

const apiUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: apiUrl,
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

  const decodedToken: string = jwtDecode(token);

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

export const fetchUserData = async (token: string, userId: string) => {
  try {
    const response = await api.get(`/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("User Details Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    throw error;
  }
};

export const fetchUserDetails = async (userId: string, token: string) => {
  try {
    const response = await api.get(`/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};

export const getUsers = async (token: string) => {
  try {
    if (!token) {
      throw new Error("User not authenticated");
    }

    const decodedToken: string = jwtDecode(token);

    const response = await api.get(`/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("getUsers response:", response.data);

    const sortedUsers = response.data.users.slice();
    sortedUsers.sort((a, b) => {
      if (a.id === decodedToken.sub) {
        return -1;
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

export const createUser = async (formData: FormData, token: string) => {
  try {
    const response = await api.post("/user", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (userId: string, token: string) => {
  try {
    const response = await api.delete(`/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (
  userId: string,
  formData: any,
  token: string,
  oldPassword: string,
  newPassword: string,
) => {
  try {
    const response = await api.patch(
      `/user/${userId}`,
      { ...formData, oldPassword, newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserById = async (userId: string, token: string) => {
  try {
    const response = await api.get(`/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUsersOrdered = async (token: string, ordering: string = "") => {
  try {
    const response = await api.get("/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        ordering,
      },
    });
    return response.data.users;
  } catch (error) {
    throw error;
  }
};

export const fetchInitiatives = async () => {
  try {
    const response = await api.get(`/initiatives`);
    return response.data.initiatives;
  } catch (error) {
    console.error("Error fetching initiatives:", error);
    throw error;
  }
};

export const updateUserProfile = async (
  userId: string,
  formData: any,
  token: string,
) => {
  try {
    const response = await api.patch(`/user/${userId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to update user profile:", error);
    throw error;
  }
};

export const fetchUserProfileData = async (token: string, userId: string) => {
  try {
    const response = await api.get(`/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch user profile data:", error);
    throw error;
  }
};

export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const response = await api.post(
      "/auth/reset-password",
      {
        token,
        password: newPassword,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const requestPasswordReset = async (email: string) => {
  try {
    const response = await api.post(
      "/auth/forgot-password",
      {
        email,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchSponsors = async () => {
  try {
    const response = await api.get("/funders");
    return response.data.funders;
  } catch (error) {
    console.error("Error fetching sponsors:", error);
    throw error;
  }
};

export const getFunderById = async (token: string, funderId: number) => {
  try {
    const response = await api.get(`/funder/${funderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching funder:", error);
    throw error;
  }
};

export const fetchUserPermissions = async (
  entityId?: number,
  token?: string,
): Promise<string[]> => {
  console.log(
    "fetchUserPermissions called with entityId:",
    entityId,
    "and token:",
    token,
  );

  try {
    const params = {
      entity_class: "User",
    };
    if (entityId) {
      params["entity_id"] = entityId;
    }

    const headers = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await api.get("/auth/entity-access/actions", {
      params,
      headers,
    });

    console.log("API Response for permissions:", response.data);

    return response.data.actions;
  } catch (error) {
    console.error("Failed to fetch user permissions:", error);
    throw error;
  }
};

export const fetchFunderRegulations = async (
  token: string,
  funderId: string,
) => {
  try {
    const response = await api.get(`/funder/${funderId}/regulations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.regulations;
  } catch (error) {
    console.error(
      "Error fetching funder regulations:",
      error.response ? error.response.data : error,
    );
    throw error;
  }
};

export const fetchRegulationDetails = async (
  token: string,
  funderId: string,
  regulationId: string,
) => {
  try {
    const response = await api.get(
      `/funder/${funderId}/regulation/${regulationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching regulation details:",
      error.response ? error.response.data : error,
    );
    throw error;
  }
};

export const addSponsor = async (token: string, name: string, url: string) => {
  try {
    const response = await api.post(
      "/funder",
      {
        name,
        url,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error creating sponsor:",
      error.response ? error.response.data : error,
    );
    throw error;
  }
};

export const addRegulation = async (
  token: string,
  funderId: number,
  name: string,
  description: string,
) => {
  try {
    const response = await api.post(
      `/funder/${funderId}/regulation`,
      {
        name,
        description,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error creating regulation:",
      error.response ? error.response.data : error,
    );
    throw error;
  }
};

export const updateRegulationDetails = async (
  token: string,
  sponsorId: number,
  regulationId: number,
  name: string,
  description: string,
) => {
  const response = await api.patch(
    `/funder/${sponsorId}/regulation/${regulationId}`,
    {
      name,
      description,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};
