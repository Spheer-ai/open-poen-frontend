import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../../../assets/scss/FundsUsers.module.scss";
import LinkFundOwners from "../../../modals/LinkFundOwners";

const FundsUsers: React.FC<{
  initiativeOwners: any[];
  initiativeId: string;
  token: string;
}> = ({ initiativeOwners, initiativeId, token }) => {
  const navigate = useNavigate();
  const [isBlockingInteraction, setIsBlockingInteraction] = useState(false);
  const [isLinkFundOwnerModalOpen, setIsLinkFundOwnerModalOpen] =
    useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleToggleLinkFundOwnerModal = () => {
    if (isLinkFundOwnerModalOpen) {
      setIsBlockingInteraction(true);
      setTimeout(() => {
        setIsBlockingInteraction(false);
        setIsLinkFundOwnerModalOpen(false);
        navigate(`/funds/${initiativeId}/activities/gebruikers`);
      }, 300);
    } else {
      setIsLinkFundOwnerModalOpen(true);
      navigate(`/funds/${initiativeId}/activities/gebruikers/link-owners`);
    }
  };

  const handleFundOwnerLinked = () => {
    setRefreshTrigger((prev) => prev + 1);
  };
  console.log("initiativeOwners:", initiativeOwners);
  return (
    <div>
      <LinkFundOwners
        isOpen={isLinkFundOwnerModalOpen}
        onClose={handleToggleLinkFundOwnerModal}
        isBlockingInteraction={isBlockingInteraction}
        onFundOwnerLinked={handleFundOwnerLinked}
        initiativeId={initiativeId}
        token={token}
        initiativeOwners={initiativeOwners}
      />
      <button
        className={styles["saveButton"]}
        onClick={handleToggleLinkFundOwnerModal}
      >
        <img
          src="../../../link-owner.svg"
          alt="Link owner"
          className={styles["link-owner"]}
        />
        Initatiefnemer toevoegen
      </button>
      <div className={styles["user-list-container"]}>
        {initiativeOwners.map((owner, index) => (
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
                  src="../../../profile-placeholder.png"
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

export default FundsUsers;
