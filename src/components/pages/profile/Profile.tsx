import React, { useEffect, useState } from "react";
import { logoutUser } from "../../middleware/Api";
import { Navigate, useNavigate } from "react-router-dom";
import ProfileContent from "./ProfileContent";
import TopNavigationBar from "../../TopNavigationBar";
import LoadingSkeleton from "../../animation/LoadingSkeleton";

interface ProfileProps {
  token: string | null;
}

function Profile({ token }: ProfileProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleSettingsClick = () => {};

  const handleCtaClick = () => {};

  const handleLogout = async () => {
    try {
      if (token) {
        await logoutUser(token);
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        navigate("/profile");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (token === null) {
    return <Navigate to="/login" />;
  }

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
