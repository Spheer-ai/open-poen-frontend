// ProfileContent.tsx
import React, { useEffect, useState } from "react";
import { getUserData } from "../../middleware/Api";
import "./ProfileContent.css";
import LoadingSkeleton from "../../animation/LoadingSkeleton";

function ProfileContent({
  token,
  isLoading,
}: {
  token: string | null;
  isLoading: boolean;
}) {
  const [userData, setUserData] = useState<{
    name: string;
    last_name: string;
    first_name: string;
    email: string;
    biography: string;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        try {
          const userDataResponse = await getUserData(token);
          setUserData(userDataResponse);
        } catch (error) {}
      }
    };

    fetchData();
  }, [token]);

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-item">
          <h2 className="bold-text">Naam</h2>
          {isLoading ? (
            <LoadingSkeleton />
          ) : userData ? (
            userData.first_name !== null ? (
              <p>{`${userData.first_name} ${userData.last_name || ""}`}</p>
            ) : (
              <p>Fout bij ophalen gegevens</p>
            )
          ) : (
            <p>Loading...</p>
          )}
        </div>
        <div className="profile-item">
          <h2 className="bold-text">Beschrijving</h2>
          {isLoading ? (
            <LoadingSkeleton />
          ) : userData ? (
            userData.biography !== null ? (
              <p>{userData.biography}</p>
            ) : (
              <p>Fout bij ophalen gegevens</p>
            )
          ) : (
            <p>Loading...</p>
          )}
        </div>
        <div className="profile-item">
          <h2 className="bold-text">E-mailadres</h2>
          {isLoading ? (
            <LoadingSkeleton />
          ) : userData ? (
            userData.email !== null ? (
              <p>{userData.email}</p>
            ) : (
              <p>Fout bij ophalen gegevens</p>
            )
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileContent;
