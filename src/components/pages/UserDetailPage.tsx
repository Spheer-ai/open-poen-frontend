import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import UserDetails from "../types/UserTypes";

function UserDetailsPage({ navigate }) {
  const { userId } = useParams<{ userId: string }>();

  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`/api/user/${userId}`);
        setUserDetails(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (userId) {
      fetchUserDetails();
    }
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
          {/* Add more user details here */}
          <Link to="/some-other-route">Go to Some Other Route</Link>
        </div>
      ) : (
        <p>Loading user details...</p>
      )}
    </div>
  );
}

export default UserDetailsPage;
