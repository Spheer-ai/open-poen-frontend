import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../../../assets/scss/FundsUsers.module.scss";
import LoadingDot from "../../../animation/LoadingDot";
import { fetchFundDetails } from "../../../middleware/Api";

import LinkFundOwners from "../../../modals/LinkFundOwners";

const FundsUsers: React.FC<{
  initiativeId: string;
  token: string;
}> = ({ initiativeId, token }) => {
  const navigate = useNavigate();
  const [isBlockingInteraction, setIsBlockingInteraction] = useState(false);
  const [isLinkFundOwnerModalOpen, setIsLinkFundOwnerModalOpen] =
    useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [initiativeOwners, setInitiativeOwners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    setIsLoading(true);
    if (initiativeId) {
      fetchFundDetails(token, initiativeId)
        .then((data) => {
          setInitiativeOwners(data.initiative_owners);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching fund details:", error);
          setIsLoading(false);
        });
    }
  }, [initiativeId, token, refreshTrigger]);

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
        onUpdateInitiativeOwners={setInitiativeOwners}
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
            {initiativeOwners.length === 0 ? (
              <p className={styles["no-users"]}>
                Geen initiatiefnemers gevonden
              </p>
            ) : (
              initiativeOwners.map((owner, index) => (
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
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FundsUsers;
