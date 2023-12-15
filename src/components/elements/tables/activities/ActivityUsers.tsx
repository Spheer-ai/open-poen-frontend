import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../../../assets/scss/FundsUsers.module.scss";
import LinkActivityOwners from "../../../modals/LinkActivityOwners";

const ActivityUsers: React.FC<{
  activityOwners: any[];
  initiativeId: string;
  activityId: string;
  token: string;
}> = ({ activityOwners, initiativeId, activityId, token }) => {
  const navigate = useNavigate();
  const [isBlockingInteraction, setIsBlockingInteraction] = useState(false);
  const [isLinkActivityOwnerModalOpen, setIsLinkActivityOwnerModalOpen] =
    useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
        initiativeId={initiativeId}
        activityId={activityId}
        token={token}
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
        {activityOwners.map((owner, index) => (
          <div className={styles["user-container"]} key={owner.id}>
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
        ))}
      </div>
    </div>
  );
};

export default ActivityUsers;
