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
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    throw error;
  }
};

export const fetchUserDetails = async (userId: string, token: string) => {
  try {
    const response = await api.get(`/user/${userId}?expand=all`, {
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
) => {
  try {
    const response = await api.patch(
      `/user/${userId}`,
      { ...formData },
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

export const uploadProfileImage = async (
  userId: string,
  imageFile: File,
  token: string,
) => {
  try {
    const formData = new FormData();
    formData.append("file", imageFile);

    const response = await api.post(
      `/user/${userId}/profile-picture`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Error uploading profile image:", error);
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

export const getUsersOrdered = async (
  token: string,
  page: number = 0,
  limit: number = 20,
  email: string = "",
) => {
  try {
    const offset = (page - 1) * limit;
    const response = await api.get("/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        offset,
        limit,
        email,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchInitiatives = async (
  token: string,
  onlyMine: boolean,
  offset: number = 0,
  limit: number = 20,
) => {
  try {
    const response = await api.get(`/initiatives`, {
      params: {
        only_mine: onlyMine,
        offset: offset,
        limit: limit,
      },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const filteredInitiatives = response.data.initiatives.map((initiative) => ({
      id: initiative.id,
      name: initiative.name,
      owner: initiative.owner,
      owner_email: initiative.owner_email,
      hidden: initiative.hidden,
      budget: initiative.budget,
      income: initiative.income,
      expenses: initiative.expenses,
    }));

    return filteredInitiatives;
  } catch (error) {
    console.error("Error fetching initiatives:", error);
    throw error;
  }
};

export const fetchFundDetails = async (token, initiativeId) => {
  try {
    const response = await api.get(`/initiative/${initiativeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to fetch fund details");
    }
  } catch (error) {
    console.error("Error fetching fund details:", error);
    throw error;
  }
};

export const fetchActivities = async (initiativeId: number, token: string) => {
  try {
    const response = await api.get(`/initiative/${initiativeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching activities:", error);
    throw error;
  }
};

export const addFund = async (
  funderId: number,
  regulationId: number,
  grantId: number,
  token: string,
  data: {
    name?: string;
    description?: string;
    purpose?: string;
    target_audience?: string;
    owner?: string;
    owner_email?: string;
    legal_entity?: string;
    address_applicant?: string;
    kvk_registration?: string;
    location?: string;
    hidden_sponsors?: boolean;
    hidden?: boolean;
    budget?: number;
  },
) => {
  try {
    const response = await api.post(
      `/funder/${funderId}/regulation/${regulationId}/grant/${grantId}/initiative`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error adding initiative:", error);
    throw error;
  }
};

export const AddActivity = async (
  initiativeId: number,
  token: string,
  activityData: object,
) => {
  try {
    const response = await api.post(
      `/initiative/${initiativeId}/activity`,
      activityData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error adding activity:", error);
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

export const fetchEntityPermissions = async (
  entityClass: string,
  entityId?: number,
  token?: string,
): Promise<string[]> => {
  try {
    const params: Record<string, any> = {};
    if (entityClass) {
      params["entity_class"] = entityClass;
    }
    if (entityId) {
      params["entity_id"] = entityId;
    }

    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const response = await api.get("/auth/entity-access/actions", {
      params,
      headers,
    });

    return response.data.actions;
  } catch (error) {
    console.error(
      `Failed to fetch permissions for ${entityClass} with ID ${entityId}:`,
      error,
    );
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
    if (error.response && error.response.status === 409) {
      throw new Error("Naam is al in gebruik.");
    }
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

export const addGrant = async (
  token: string,
  funderId: number,
  regulationId: number,
  name: string,
  reference: string,
  budget: number,
) => {
  try {
    const response = await api.post(
      `/funder/${funderId}/regulation/${regulationId}/grant`,
      {
        name,
        reference,
        budget,
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
      "Error adding grant:",
      error.response ? error.response.data : error,
    );
    throw error;
  }
};

export const editGrant = async (
  token: string,
  funderId: number,
  regulationId: number,
  grantId: number,
  name: string,
  reference: string,
  budget: number,
) => {
  try {
    const response = await api.patch(
      `/funder/${funderId}/regulation/${regulationId}/grant/${grantId}`,
      {
        name,
        reference,
        budget,
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
      "Error editing grant:",
      error.response ? error.response.data : error,
    );
    throw error;
  }
};

export const deleteGrant = async (
  token: string,
  funderId: number,
  regulationId: number,
  grantId: number,
) => {
  try {
    const response = await api.delete(
      `/funder/${funderId}/regulation/${regulationId}/grant/${grantId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting grant:",
      error.response ? error.response.data : error,
    );
    throw error;
  }
};

export const addOfficerToGrant = async (
  token: string,
  funderId: number,
  regulationId: number,
  grantId: number,
  userIds: number[],
) => {
  try {
    const response = await api.patch(
      `/funder/${funderId}/regulation/${regulationId}/grant/${grantId}/overseers`,
      {
        user_ids: userIds,
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
      "Error adding officer to grant:",
      error.response ? error.response.data : error,
    );
    throw error;
  }
};

export const addEmployeeToRegulation = async (
  token: string,
  funderId: number,
  regulationId: number,
  employeeIds: number[],
  role: string,
) => {
  try {
    const response = await api.patch(
      `/funder/${funderId}/regulation/${regulationId}/officers`,
      {
        user_ids: employeeIds,
        role,
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
      "Error adding employee to regulation:",
      error.response ? error.response.data : error,
    );
    throw error;
  }
};

export const editSponsor = async (
  token: string,
  funderId: number,
  name: string,
  url: string,
) => {
  try {
    const response = await api.patch(
      `/funder/${funderId}`,
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
      "Error editing funder:",
      error.response ? error.response.data : error,
    );
    throw error;
  }
};

export const fetchInstitutions = async () => {
  try {
    const response = await api.get("/utils/gocardless/institutions");

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching institutions:",
      error.response ? error.response.data : error,
    );
    throw error;
  }
};

export const initiateGocardless = async (
  userId: number | string,
  institutionId: string,
  nDaysAccess: number,
  nDaysHistory: number,
  token: string,
) => {
  try {
    const response = await api.get(`/users/${userId}/gocardless-initiate`, {
      params: {
        institution_id: institutionId,
        n_days_access: nDaysAccess,
        n_days_history: nDaysHistory,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error initiating GoCardless:",
      error.response ? error.response.data : error,
    );
    throw error;
  }
};

export const fetchPayments = async (
  userId: number,
  token: string,
  offset: number = 0,
  limit: number = 20,
  initiativeName: string = "",
  activityName: string = "",
) => {
  try {
    const response = await api.get(`/payments/user/${userId}`, {
      params: {
        offset,
        limit,
        initiative_name: initiativeName,
        activity_name: activityName,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching payments:",
      error.response ? error.response.data : error,
    );
    throw error;
  }
};
export const fetchBankConnections = async (userId, token) => {
  try {
    const response = await api.get(`/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const ownedBankAccounts = response.data.owned_bank_accounts || [];
    const usedBankAccounts = response.data.used_bank_accounts || [];

    return { ownedBankAccounts, usedBankAccounts };
  } catch (error) {
    console.error(
      "Error fetching bank connections:",
      error.response ? error.response.data : error,
    );
    throw error;
  }
};

export const linkUsersToBankAccount = async (
  userId: number,
  token: string,
  bankAccountId: number,
  user_ids: number[],
) => {
  try {
    const response = await api.patch(
      `/user/${userId}/bank-account/${bankAccountId}/users`,
      {
        user_ids,
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
      "Error linking users to bank account:",
      error.response ? error.response.data : error,
    );
    throw error;
  }
};

export const fetchBankAccount = async (userId, token, bankAccountId) => {
  try {
    const response = await api.get(
      `/user/${userId}/bank-account/${bankAccountId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to fetch bank account data");
    }
  } catch (error) {
    console.error(
      "Error fetching bank account:",
      error.response ? error.response.data : error,
    );
    throw error;
  }
};

export const fetchUsersEmails = async (userId, token, bankAccountId) => {
  try {
    const response = await api.get(
      `/user/${userId}/bank-account/${bankAccountId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.status === 200) {
      if (response.data.users && Array.isArray(response.data.users)) {
        const userEmails = response.data.users.map((user) => user.email);
        return userEmails;
      } else {
        throw new Error(
          "Invalid response format: 'users' field is missing or not an array.",
        );
      }
    } else {
      throw new Error("Failed to fetch bank account data");
    }
  } catch (error) {
    console.error(
      "Error fetching users' email addresses:",
      error.response ? error.response.data : error,
    );
    throw error;
  }
};

export const searchUsersByEmail = async (
  token,
  email,
  offset = 0,
  limit = 20,
) => {
  try {
    const response = await api.get("/users", {
      params: {
        email,
        offset,
        limit,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const usersWithEmails = response.data.users.map((user) => ({
        id: user.id,
        email: user.email,
      }));

      return usersWithEmails;
    } else {
      throw new Error("Failed to search for users by email");
    }
  } catch (error) {
    console.error(
      "Error searching for users by email:",
      error.response ? error.response.data : error,
    );
    throw error;
  }
};

export const revokeBankConnection = async (userId, token, bankAccountId) => {
  try {
    const requestURL = `/user/${userId}/bank-account/${bankAccountId}`;
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await api.patch(requestURL, null, { headers });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to revoke bank connection");
    }
  } catch (error) {
    console.error(
      "Error revoking bank connection:",
      error.response ? error.response.data : error,
    );
    throw error;
  }
};

export const deleteBankAccount = async (userId, token, bankAccountId) => {
  try {
    const response = await api.patch(
      `/user/${userId}/bank-account/${bankAccountId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.status === 204) {
      return response.data;
    } else {
      throw new Error("Failed to delete bank account");
    }
  } catch (error) {
    console.error(
      "Error deleting bank account:",
      error.response ? error.response.data : error,
    );
    throw error;
  }
};

export const getEditFieldsForEntity = async (entityClass, entityId, token) => {
  try {
    const response = await api.get("/auth/entity-access/edit-fields", {
      params: {
        entity_class: entityClass,
        entity_id: entityId,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to fetch editable fields for entity");
    }
  } catch (error) {
    console.error(
      "Error fetching editable fields for entity:",
      error.response ? error.response.data : error,
    );
    throw error;
  }
};

export const getUsersByEmail = async (
  token: string,
  searchTerm: string,
  offset: number = 0,
  limit: number = 20,
) => {
  try {
    const response = await api.get("/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        email: searchTerm,
        offset,
        limit,
      },
    });
    return response.data.users;
  } catch (error) {
    console.error(
      "Error searching users by email:",
      error.response ? error.response.data : error,
    );
    throw error;
  }
};

export const getGrantOverseers = async (
  funderId,
  regulationId,
  grantId,
  token,
) => {
  try {
    const response = await api.get(
      `/funder/${funderId}/regulation/${regulationId}/grant/${grantId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.status === 200) {
      return response.data.overseers;
    } else {
      throw new Error("Failed to fetch overseers for grant");
    }
  } catch (error) {
    console.error(
      "Error fetching overseers for grant:",
      error.response ? error.response.data : error,
    );
    throw error;
  }
};

export const deleteSponsor = async (token: string, funderId: number) => {
  try {
    const response = await api.delete(`/funder/${funderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting funder:",
      error.response ? error.response.data : error,
    );
    throw error;
  }
};

export const deleteRegulation = async (token, funderId, regulationId) => {
  try {
    const response = await api.delete(
      `/funder/${funderId}/regulation/${regulationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.status === 204) {
      return;
    } else {
      console.error(
        "Failed to delete regulation. Server returned status code:",
        response.status,
      );
      console.error("Response data:", response.data);
      throw new Error("Failed to delete regulation");
    }
  } catch (error) {
    console.error("Error deleting regulation:", error);
    throw error;
  }
};

export const getUserGrants = async (userId: string, token: string) => {
  try {
    const response = await api.get(`/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const grants = response.data.grants.map((grant) => ({
      id: grant.id,
      name: grant.name,
    }));

    return grants;
  } catch (error) {
    throw error;
  }
};

export const linkInitiativeToPayment = async (
  token,
  paymentId,
  initiativeId,
) => {
  try {
    const requestData = {
      initiative_id: initiativeId,
    };

    const response = await api.patch(
      `/payment/${paymentId}/initiative`,
      requestData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.status === 200) {
      return response.data;
    } else if (response.status === 422) {
      console.error("Validation Error:", response.data);
      throw new Error("Validation Error");
    } else {
      console.error(
        "Failed to link initiative to payment. Server returned status code:",
        response.status,
      );
      console.error("Response data:", response.data);
      throw new Error("Failed to link initiative to payment");
    }
  } catch (error) {
    console.error("Error linking initiative to payment:", error);
    throw error;
  }
};

export const linkActivityToPayment = async (
  token,
  paymentId,
  initiativeId,
  activityId,
) => {
  try {
    const requestBody = {
      initiative_id: initiativeId,
      activity_id: activityId,
    };

    const response = await api.patch(
      `/payment/${paymentId}/activity`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (response.status === 200) {
      return response.data;
    } else if (response.status === 422) {
      console.error("Validation Error:", response.data);
      throw new Error("Validation Error");
    } else {
      console.error(
        "Failed to link activity to payment. Server returned status code:",
        response.status,
      );
      console.error("Response data:", response.data);
      throw new Error("Failed to link activity to payment");
    }
  } catch (error) {
    console.error("Error linking activity to payment:", error);
    throw error;
  }
};

export const fetchLinkableInitiatives = async (token, paymentId) => {
  try {
    const response = await api.get(
      `/auth/entity-access/linkable-initiatives?paymentId=${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.status === 200) {
      return response.data.initiatives;
    } else {
      throw new Error("Failed to fetch linkable initiatives");
    }
  } catch (error) {
    console.error("Error fetching linkable initiatives:", error);
    throw error;
  }
};

export const fetchLinkableActivities = async (token, initiativeId) => {
  try {
    const response = await api.get(
      `/auth/entity-access/initiative/${initiativeId}/linkable-activities`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.status === 200) {
      return response.data.activities;
    } else {
      throw new Error("Failed to fetch linkable activities");
    }
  } catch (error) {
    console.error("Error fetching linkable activities:", error);
    throw error;
  }
};

export const fetchActivityDetails = async (token, initiativeId, activityId) => {
  try {
    const response = await api.get(
      `/initiative/${initiativeId}/activity/${activityId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to fetch activity details");
    }
  } catch (error) {
    console.error("Error fetching activity details:", error);
    throw error;
  }
};

export const editFund = async (token, initiativeId, fundData) => {
  try {
    const response = await api.patch(`/initiative/${initiativeId}`, fundData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to edit fund");
    }
  } catch (error) {
    console.error("Error editing fund:", error);
    throw error;
  }
};

export const editActivity = async (
  token,
  initiativeId,
  activityId,
  activityData,
) => {
  try {
    const response = await api.patch(
      `/initiative/${initiativeId}/activity/${activityId}`,
      activityData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to edit activity");
    }
  } catch (error) {
    console.error("Error editing activity:", error);
    throw error;
  }
};

export const deleteInitiative = async (token, initiativeId) => {
  try {
    const response = await api.delete(`/initiative/${initiativeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 204) {
      // Successful deletion with no content
      return;
    } else if (response.status === 200) {
      // Successful deletion with content
      return response.data;
    } else if (response.status === 422) {
      throw new Error(`Validation Error: ${response.data.message}`);
    } else {
      throw new Error(
        `Failed to delete initiative. Status: ${
          response.status
        }, Data: ${JSON.stringify(response.data)}`,
      );
    }
  } catch (error) {
    console.error("Error deleting initiative:", error);
    throw error;
  }
};

export const deleteActivity = async (token, initiativeId, activityId) => {
  try {
    const response = await api.delete(
      `/initiative/${initiativeId}/activity/${activityId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (response.status === 204) {
      // Successful deletion with no content
      return;
    } else if (response.status === 200) {
      // Successful deletion with content
      return response.data;
    } else if (response.status === 422) {
      throw new Error("Validation Error: " + JSON.stringify(response.data));
    } else {
      throw new Error("Failed to delete activity");
    }
  } catch (error) {
    console.error("Error deleting activity:", error);
    throw error;
  }
};

export const getPaymentsByInitiative = async (
  token,
  initiativeId,
  page: number = 0,
  limit: number = 20,
  queryParams = {},
) => {
  try {
    const offset = (page - 1) * limit;
    const response = await api.get(`/payments/initiative/${initiativeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      params: {
        ...queryParams,
        offset,
        limit,
      },
    });

    if (response.status === 200) {
      return response.data;
    } else if (response.status === 422) {
      throw new Error("Validation Error: " + JSON.stringify(response.data));
    } else {
      throw new Error("Failed to fetch payments by initiative");
    }
  } catch (error) {
    console.error("Error fetching payments by initiative:", error);
    throw error;
  }
};

export const getPaymentsByActivity = async (
  token,
  initiativeId,
  activityId,
  page: number = 0,
  limit: number = 20,
  queryParams = {},
) => {
  try {
    const offset = (page - 1) * limit;
    const response = await api.get(
      `/payments/initiative/${initiativeId}/activity/${activityId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: {
          ...queryParams,
          offset,
          limit,
        },
      },
    );

    if (response.status === 200) {
      return response.data;
    } else if (response.status === 422) {
      throw new Error("Validation Error: " + JSON.stringify(response.data));
    } else {
      throw new Error("Failed to fetch payments by initiative");
    }
  } catch (error) {
    console.error("Error fetching payments by initiative:", error);
    throw error;
  }
};

export const uploadFundPicture = async (initiativeId, file, token) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(
      `/initiative/${initiativeId}/profile-picture`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      },
    );

    if (response.status === 200) {
      return response.data;
    } else if (response.status === 422) {
      throw new Error("Validation Error: " + JSON.stringify(response.data));
    } else {
      throw new Error("Failed to upload fund picture");
    }
  } catch (error) {
    console.error("Error uploading fund picture:", error);
    throw error;
  }
};

export const uploadActivityPicture = async (
  initiativeId,
  activityId,
  file,
  token,
) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(
      `/initiative/${initiativeId}/activity/${activityId}/profile-picture`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      },
    );

    if (response.status === 200) {
      return response.data;
    } else if (response.status === 422) {
      throw new Error("Validation Error: " + JSON.stringify(response.data));
    } else {
      throw new Error("Failed to upload activity picture");
    }
  } catch (error) {
    console.error("Error uploading activity picture:", error);
    throw error;
  }
};

export const updateInitiativeOwners = async (initiativeId, user_ids, token) => {
  try {
    const requestBody = {
      user_ids: user_ids,
    };

    const response = await api.patch(
      `/initiative/${initiativeId}/owners`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (response.status === 200) {
      return response.data;
    } else if (response.status === 422) {
      throw new Error("Validation Error: " + JSON.stringify(response.data));
    } else {
      throw new Error("Failed to update initiative owners");
    }
  } catch (error) {
    console.error("Error updating initiative owners:", error);
    throw error;
  }
};

export const updateActivityOwners = async (
  initiativeId,
  activityId,
  user_ids,
  token,
) => {
  try {
    const requestBody = {
      user_ids: user_ids,
    };

    const response = await api.patch(
      `/initiative/${initiativeId}/activity/${activityId}/owners`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (response.status === 200) {
      return response.data;
    } else if (response.status === 422) {
      throw new Error("Validation Error: " + JSON.stringify(response.data));
    } else {
      throw new Error("Failed to update activity owners");
    }
  } catch (error) {
    console.error("Error updating activity owners:", error);
    throw error;
  }
};

export const createPayment = async (paymentData, token) => {
  try {
    const response = await api.post("/payment", paymentData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return response.data;
    } else if (response.status === 422) {
      throw new Error("Validation Error: " + JSON.stringify(response.data));
    } else {
      throw new Error("Failed to create payment");
    }
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
};

export const fetchPaymentDetails = async (paymentId, token?) => {
  try {
    const response = await api.get(`/payment/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return response.data;
    } else if (response.status === 422) {
      throw new Error("Validation Error: " + JSON.stringify(response.data));
    } else {
      throw new Error("Failed to fetch payment");
    }
  } catch (error) {
    console.error("Error fetching payment:", error);
    throw error;
  }
};

export const editPayment = async (paymentId, paymentData, token) => {
  try {
    const response = await api.patch(`/payment/${paymentId}`, paymentData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return response.data;
    } else if (response.status === 422) {
      throw new Error("Validation Error: " + JSON.stringify(response.data));
    } else {
      throw new Error("Failed to edit payment");
    }
  } catch (error) {
    console.error("Error editing payment:", error);
    throw error;
  }
};

export const cancelPayment = async (paymentId, token) => {
  try {
    await api.delete(`/payment/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return null;
  } catch (error) {
    console.error("Error canceling payment:", error);
    throw error;
  }
};

export const uploadPaymentAttachment = async (paymentId, file, token) => {
  try {
    const formData = new FormData();

    formData.append("files", file);

    const response = await api.post(
      `/payment/${paymentId}/attachments`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      },
    );

    if (response.status === 200) {
      return response.data;
    } else if (response.status === 422) {
      throw new Error("Validation Error: " + JSON.stringify(response.data));
    } else {
      throw new Error("Failed to upload payment attachment");
    }
  } catch (error) {
    console.error("Error uploading payment attachment:", error);
    throw error;
  }
};

export const fetchInitiativeMedia = async (
  initiativeId,
  offset = 0,
  limit = 20,
  token,
) => {
  try {
    const response = await api.get(`/initiative/${initiativeId}/media`, {
      params: {
        offset,
        limit,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return response.data;
    } else if (response.status === 422) {
      throw new Error("Validation Error: " + JSON.stringify(response.data));
    } else {
      console.error("Non-200 status code:", response.status);
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching initiative media:", error);
    throw error;
  }
};

export const fetchActivityMedia = async (
  initiativeId,
  actitivyId,
  offset = 0,
  limit = 20,
  token,
) => {
  try {
    const response = await api.get(
      `/initiative/${initiativeId}/activity/${actitivyId}/media`,
      {
        params: {
          offset,
          limit,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.status === 200) {
      return response.data;
    } else if (response.status === 422) {
      throw new Error("Validation Error: " + JSON.stringify(response.data));
    } else {
      throw new Error("Failed to fetch initiative media");
    }
  } catch (error) {
    console.error("Error fetching initiative media:", error);
    throw error;
  }
};

export const fetchGrantDetails = async (
  token,
  funderId,
  regulationId,
  grantId,
) => {
  try {
    const response = await api.get(
      `/funder/${funderId}/regulation/${regulationId}/grant/${grantId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to fetch grant details");
    }
  } catch (error) {
    console.error("Error fetching grant details:", error);
    throw error;
  }
};

export const fetchPaymentAttachments = async (paymentId, token) => {
  try {
    const response = await api.get(`/payment/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const { attachments } = response.data;
      return attachments;
    } else if (response.status === 422) {
      throw new Error("Validation Error: " + JSON.stringify(response.data));
    } else {
      console.error("Non-200 status code:", response.status);
      return [];
    }
  } catch (error) {
    console.error("Error fetching payment attachments:", error);
    throw error;
  }
};

export const deletePaymentAttachment = async (
  paymentId,
  attachmentId,
  token,
) => {
  try {
    const response = await api.delete(
      `/payment/${paymentId}/attachment/${attachmentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.status === 200) {
    } else if (response.status === 422) {
      throw new Error("Validation Error: " + JSON.stringify(response.data));
    } else {
      console.error("Non-200 status code:", response.status);
    }
  } catch (error) {
    console.error("Error deleting payment attachment:", error);
    throw error;
  }
};
