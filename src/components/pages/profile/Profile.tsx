import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import ProfileContent from "./ProfileContent";
import TopNavigationBar from "../../TopNavigationBar";
import { useAuth } from "../../../contexts/AuthContext";

function Profile() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleSettingsClick = () => {
    // Handle settings click
  };

  const handleCtaClick = () => {
    // Handle CTA click
  };

  if (!user || user.token === null) {
    return <Navigate to="/login" />;
  }
  const handleSearch = (query) => {
    // Handle the search logic specific to this component
    console.log("Search query in UserDetailsPage:", query);
  };

  return (
    <div>
      <TopNavigationBar
        title="Accountinstellingen"
        showSettings={false}
        showCta={false}
        onSettingsClick={handleSettingsClick}
        onCtaClick={handleCtaClick}
        onSearch={handleSearch}
      />
      <ProfileContent />
    </div>
  );
}

export default Profile;
