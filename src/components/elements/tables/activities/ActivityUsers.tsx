import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../../../assets/scss/FundsUsers.module.scss";
import { useAuth } from "../../../../contexts/AuthContext";
import LinkActivityOwners from "../../../modals/LinkActivityOwners";
import { ActivityOwner } from "../../../../types/ActivityOwners";
import LoadingDot from "../../../animation/LoadingDot";
import { fetchActivityDetails } from "../../../middleware/Api";
import useCachedImages from "../../../utils/images";

const ActivityUsers: React.FC<{
  activityOwners: ActivityOwner[];
  initiativeId: string;
  activityId: string;
  token: string;
}> = ({ activityOwners: initialOwners, initiativeId, activityId, token }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isBlockingInteraction, setIsBlockingInteraction] = useState(false);
  const [isLinkActivityOwnerModalOpen, setIsLinkActivityOwnerModalOpen] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [owners, setOwners] = useState<ActivityOwner[]>(initialOwners);
  const images = useCachedImages();

  useEffect(() => {
    const fetchOwners = async () => {
      setIsLoading(true);
      try {
        const data = await fetchActivityDetails(
          token,
          initiativeId,
          activityId,
        );
        setOwners(data.activity_owners);
      } catch (error) {
        console.error("Error fetching activity details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOwners();
  }, [initiativeId, activityId, token]);

  const handleToggleLinkActivityOwnerModal = () => {
    if (isLinkActivityOwnerModalOpen) {
      setIsBlockingInteraction(true);
      setTimeout(() => {
        setIsBlockingInteraction(false);
        setIsLinkActivityOwnerModalOpen(false);
        navigate(`/funds/${initiativeId}/activities/${activityId}/gebruikers`);
      }, 300);
    } else {
      setIsLinkActivityOwnerModalOpen(true);
      navigate(
        `/funds/${initiativeId}/activities/${activityId}/gebruikers/link-owners`,
      );
    }
  };

  const handleActivityOwnerLinked = (newOwners: ActivityOwner[]) => {
    setOwners(newOwners);
  };

  return (
    <div className={styles["users-container"]}>
      <LinkActivityOwners
        isOpen={isLinkActivityOwnerModalOpen}
        onClose={handleToggleLinkActivityOwnerModal}
        isBlockingInteraction={isBlockingInteraction}
        onActivityOwnerLinked={handleActivityOwnerLinked}
        onUpdateActivityOwners={setOwners}
        initiativeId={initiativeId}
        activityId={activityId}
        token={token}
        activityOwners={owners}
      />
      {user && token ? (
        <button
          className={styles["saveButton"]}
          onClick={handleToggleLinkActivityOwnerModal}
        >
          <img
            src={images.linkOwner}
            alt="Link owner"
            className={styles["link-owner"]}
          />
          Activiteitnemer toevoegen
        </button>
      ) : null}
      <div className={styles["user-list-container"]}>
        {isLoading ? (
          <div className={styles["loading-container"]}>
            <LoadingDot delay={0} />
            <LoadingDot delay={0.1} />
            <LoadingDot delay={0.1} />
            <LoadingDot delay={0.2} />
            <LoadingDot delay={0.2} />
          </div>
        ) : (
          <>
            {owners.length === 0 ? (
              <p className={styles["no-users"]}>
                Geen activiteitnemers gevonden
              </p>
            ) : (
              owners.map((owner) => (
                <div
                  className={`${styles["user-container"]} ${styles["fundusers-fade-in"]}`}
                  key={owner.id}
                >
                  <div className={styles["user-image"]}>
                    {owner.profile_picture ? (
                      <img
                        src={owner.profile_picture.attachment_thumbnail_url_128}
                        alt="Profile"
                        className={styles["profile-image"]}
                        onError={(e) => {
                          console.error(
                            `Failed to load image for ${owner.email}`,
                            e,
                          );
                          e.currentTarget.src = `${images.placeholderProfile}`;
                        }}
                      />
                    ) : (
                      <img
                        src={images.placeholderProfile}
                        alt="Profile"
                        className={styles["profile-image"]}
                      />
                    )}
                  </div>
                  <div className={styles["user-card"]}>
                    <span>
                      {owner.first_name} {owner.last_name}
                    </span>
                    <p>{owner.email}</p>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ActivityUsers;
