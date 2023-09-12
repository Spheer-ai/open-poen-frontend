import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import ProfileContent from "./ProfileContent";
import TopNavigationBar from "../../TopNavigationBar";

interface ProfileProps {
  token: string | null;
}

function Profile({ token }: ProfileProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleSettingsClick = () => {};

  const handleCtaClick = () => {};

  if (token === null) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <TopNavigationBar
        title="Accountinstellingen"
        showSettings={false}
        showCta={false}
        onSettingsClick={handleSettingsClick}
        onCtaClick={handleCtaClick}
      />
      <ProfileContent token={token} isLoading={isLoading} />
    </div>
  );
}

export default Profile;
