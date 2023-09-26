import axios from "axios";
import { useState, useEffect } from "react";
import { UserDetails } from "../../types/UserDetailTypes";

const getUserDataWithUserId = async (
  token: string | null,
  userId: number,
): Promise<UserDetails> => {
  if (!token || !userId) {
    throw new Error("User not authenticated");
  }

  try {
    const response = await axios.get<UserDetails>(`/api/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("getUserDataWithUserId response:", response.data);
    return response.data;
  } catch (error) {
    console.error("getUserDataWithUserId error:", error);
    throw error;
  }
};

const UserDetail = ({ userId }: { userId: number }) => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("User not authenticated");
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const userData = await getUserDataWithUserId(token, userId);

        setUserDetails(userData);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [userId]);

  return (
    <div>
      {userDetails ? (
        <div>
          <h2>User Details</h2>
          <p>
            Name: {userDetails.first_name} {userDetails.last_name}
          </p>
          <p>Email: {userDetails.email}</p>
        </div>
      ) : (
        <p>Loading user details...</p>
      )}
    </div>
  );
};

export default UserDetail;
