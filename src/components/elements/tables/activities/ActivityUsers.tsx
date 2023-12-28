import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../../../assets/scss/FundsUsers.module.scss";
import LinkActivityOwners from "../../../modals/LinkActivityOwners";
import { fetchActivityDetails } from "../../../middleware/Api";
import LoadingDot from "../../../animation/LoadingDot";

const ActivityUsers: React.FC<{
  activityOwners: any[];
  initiativeId: string;
  activityId: string;
  token: string;
}> = ({ initiativeId, activityId, token }) => {
  const navigate = useNavigate();
  const [isBlockingInteraction, setIsBlockingInteraction] = useState(false);
  const [isLinkActivityOwnerModalOpen, setIsLinkActivityOwnerModalOpen] =
    useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activityOwners, setActivityOwners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    setIsLoading(true);
    if (initiativeId) {
      fetchActivityDetails(token, initiativeId, activityId)
        .then((data) => {
          setActivityOwners(data.activity_owners);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching fund details:", error);
          setIsLoading(false);
        });
    }
  }, [initiativeId, activityId, token, refreshTrigger]);

  const handleActivityOwnerLinked = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div>
      <LinkActivityOwners
        isOpen={isLinkActivityOwnerModalOpen}
        onClose={handleToggleLinkActivityOwnerModal}
        isBlockingInteraction={isBlockingInteraction}
        onActivityOwnerLinked={handleActivityOwnerLinked}
        onUpdateActivityOwners={setActivityOwners}
        initiativeId={initiativeId}
        activityId={activityId}
        token={token}
        activityOwners={activityOwners}
      />
      <button
        className={styles["saveButton"]}
        onClick={handleToggleLinkActivityOwnerModal}
      >
        <img
          src="../../../../link-owner.svg"
          alt="Link owner"
          className={styles["link-owner"]}
        />
        Activiteitnemer toevoegen
      </button>
      <div className={styles["user-list-container"]}>
        {isLoading ? (
          <div className={styles["loading-parent"]}>
            <div className={styles["loading-container"]}>
              <LoadingDot delay={0} />
              <LoadingDot delay={0.1} />
              <LoadingDot delay={0.1} />
              <LoadingDot delay={0.2} />
              <LoadingDot delay={0.2} />
            </div>
          </div>
        ) : (
          <>
            {activityOwners.length === 0 ? (
              <p className={styles["no-users"]}>
                Geen activiteitnemers gevonden
              </p>
            ) : (
              activityOwners.map((owner, index) => (
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
                      />
                    ) : (
                      <img
                        src="../../../../profile-placeholder.png"
                        alt="Profile"
                        className={styles["profile-image"]}
                      />
                    )}
                  </div>
                  <div className={styles["user-card"]} key={index}>
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
