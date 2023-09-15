import axios from "axios";
import React, { useState, useEffect } from "react";

// Define a TypeScript type for user details
interface UserDetails {
  first_name: string;
  last_name: string;
  email: string;
  // Add more fields as needed
}

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
    // Get the token from local storage
    const token = localStorage.getItem("token");

    // Check if the token is null
    if (!token) {
      console.error("User not authenticated");
      // Handle the case where the user is not authenticated (e.g., show an error message)
      return;
    }

    // Fetch user details when the component mounts or userId changes
    const fetchUserDetails = async () => {
      try {
        // Use the getUserDataWithUserId function to fetch user details
        const userData = await getUserDataWithUserId(token, userId);

        setUserDetails(userData);
      } catch (error) {
        console.error("Error fetching user details:", error);
        // Handle error, e.g., show an error message to the user
      }
    };

    fetchUserDetails(); // Call the fetchUserDetails function
  }, [userId]); // Trigger the effect whenever userId changes

  // Render user details
  return (
    <div>
      {userDetails ? (
        <div>
          <h2>User Details</h2>
          <p>
            Name: {userDetails.first_name} {userDetails.last_name}
          </p>
          <p>Email: {userDetails.email}</p>
          {/* Add more user details here */}
        </div>
      ) : (
        <p>Loading user details...</p>
      )}
    </div>
  );
};

export default UserDetail;
