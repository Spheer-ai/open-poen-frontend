import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../../../assets/scss/FundsUsers.module.scss";
import LoadingDot from "../../../animation/LoadingDot";
import { useAuth } from "../../../../contexts/AuthContext";
import LinkFundOwners from "../../../modals/LinkFundOwners";
import { fetchFundDetails } from "../../../middleware/Api";
import { InitiativeOwner } from "../../../../types/EditFundTypes";

const FundsUsers: React.FC<{
  initiativeId: string;
  token: string;
  initiativeOwners: InitiativeOwner[];
  refreshTrigger: number;
}> = ({ initiativeId, token, initiativeOwners, refreshTrigger }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isBlockingInteraction, setIsBlockingInteraction] = useState(false);
  const [isLinkFundOwnerModalOpen, setIsLinkFundOwnerModalOpen] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [owners, setOwners] = useState<InitiativeOwner[]>(initiativeOwners);

  const handleToggleLinkFundOwnerModal = () => {
    if (isLinkFundOwnerModalOpen) {
      setIsBlockingInteraction(true);
      setTimeout(() => {
        setIsBlockingInteraction(false);
        setIsLinkFundOwnerModalOpen(false);
        navigate(`/funds/${initiativeId}/gebruikers`);
      }, 300);
    } else {
      setIsLinkFundOwnerModalOpen(true);
      navigate(`/funds/${initiativeId}/gebruikers/link-owners`);
    }
  };

  const handleFundOwnerLinked = (newOwners: InitiativeOwner[]) => {
    setOwners(newOwners);
  };

  useEffect(() => {
    setIsLoading(true);
    fetchFundDetails(token, initiativeId)
      .then((data) => {
        setOwners(data.initiative_owners);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching fund owners:", error);
        setIsLoading(false);
      });
  }, [refreshTrigger, initiativeId, token]);

  return (
    <div className={styles["users-container"]}>
      <LinkFundOwners
        isOpen={isLinkFundOwnerModalOpen}
        onClose={handleToggleLinkFundOwnerModal}
        isBlockingInteraction={isBlockingInteraction}
        onFundOwnerLinked={handleFundOwnerLinked}
        onUpdateInitiativeOwners={setOwners}
        initiativeId={initiativeId}
        token={token}
        initiativeOwners={owners}
      />
      {user && token ? (
        <button
          className={styles["saveButton"]}
          onClick={handleToggleLinkFundOwnerModal}
        >
          <img
            src="../../../../link-owner.svg"
            alt="Link owner"
            className={styles["link-owner"]}
          />
          Initiatiefnemer toevoegen
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
                Geen initiatiefnemers gevonden
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
                      />
                    ) : (
                      <img
                        src="../../../profile-placeholder.png"
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

export default FundsUsers;
