import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import UserDetails from "../types/UserTypes";
import ProfilePlaceholder from "/profile-placeholder.png";
import "./UserDetailPage.css";
import InitiativeList from "../lists/InitiativeList"; // Import the InitiativeList component
import LoadingDot from "../animation/LoadingDot";

function UserDetailsPage() {
  const { userId } = useParams<{ userId: string }>();

  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [initiatives, setInitiatives] = useState([]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`/api/user/${userId}`);
        setUserDetails(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    const fetchInitiatives = async () => {
      try {
        const response = await axios.get(`/api/initiatives`);
        setInitiatives(response.data.initiatives);
      } catch (error) {
        console.error("Error fetching initiatives:", error);
      }
    };

    if (userId) {
      fetchUserDetails();
      fetchInitiatives(); // Fetch initiatives data
    }
  }, [userId]);

  return (
    <div className="user-details-container">
      <div className="user-details-content">
        {userDetails ? (
          <div className="user-details">
            <div className="user-profile">
              <div>
                <img
                  src={ProfilePlaceholder}
                  alt="Profile"
                  className="user-image circular"
                />
              </div>
              <div className="user-info">
                <p className="user-name">
                  {userDetails.first_name} {userDetails.last_name}
                </p>
                {userDetails.email && (
                  <p className="user-email">Email: {userDetails.email}</p>
                )}
                <div className="user-role-label">
                  <p className="user-role">{userDetails.role}</p>
                </div>
              </div>
            </div>

            <div className="user-description">
              <h3 className="section-title">Description</h3>
              <p className="section-content">{userDetails.biography}</p>
            </div>

            <div className="user-initiatives">
              <h3 className="section-title">Initiatives</h3>
              <InitiativeList initiatives={initiatives} />
            </div>
            <div className="user-activities">
              <h3 className="section-title">Activities</h3>
              {userDetails.activities.length > 0 ? (
                <ul>
                  {userDetails.activities.map((activity) => (
                    <li key={activity.id}>
                      <h4>{activity.name}</h4>
                      <p className="section-content">
                        Description: {activity.description}
                      </p>
                      <p className="section-content">
                        Finished: {activity.finished ? "Yes" : "No"}
                      </p>
                      {activity.finished && (
                        <p className="section-content">
                          Finished Description: {activity.finished_description}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="section-content">No activities available.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="loading-container">
            <LoadingDot delay={0} />
            <LoadingDot delay={0.1} />
            <LoadingDot delay={0.1} />
            <LoadingDot delay={0.2} />
            <LoadingDot delay={0.2} />
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDetailsPage;
