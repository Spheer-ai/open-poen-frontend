// Profile.js
import React, { useEffect, useState } from "react";
import { logoutUser } from "../../middleware/Api";
import { useNavigate } from "react-router-dom";
import ProfileContent from "./ProfileContent";
import TopNavigationBar from "../../TopnavigationBar";
import LoadingSkeleton from "../../animation/LoadingSkeleton"; // Import the LoadingSkeleton component

function Profile() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 0);
  }, []);

  const handleSettingsClick = () => {};

  const handleCtaClick = () => {};

  const handleLogout = async () => {
    try {
      await logoutUser(token);
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div>
      <TopNavigationBar
        title="Accountinstellingen"
        showSettings={true}
        showCta={true}
        onSettingsClick={handleSettingsClick}
        onCtaClick={handleCtaClick}
      />
      <ProfileContent token={token} isLoading={isLoading} />
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <button onClick={handleLogout}>Uitloggen</button>
      )}
    </div>
  );
}

export default Profile;
