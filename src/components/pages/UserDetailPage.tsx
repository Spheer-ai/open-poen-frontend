import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import UserDetails from "../../types/UserTypes";
import ProfilePlaceholder from "/profile-placeholder.png";
import styles from "../../assets/scss/UserDetailPage.module.scss";
import InitiativeList from "../lists/InitiativeList";
import LoadingDot from "../animation/LoadingDot";
import AddItemModal from "../modals/AddItemModal";
import ChangePasswordForm from "../forms/ChangePasswordForm";
import EditUserProfileForm from "../forms/EditUserProfileForm";
import EditIcon from "/edit-icon.svg";
import ChangePasswordIcon from "/change-password-icon.svg";

export default function UserDetailsPage() {
  const { userId } = useParams<{ userId: string }>();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [initiatives, setInitiatives] = useState([]);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`/api/user/${userId}`);
        setUserDetails(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    const fetchInitiatives = async () => {
      try {
        const response = await axios.get(`/api/initiatives`);
        setInitiatives(response.data.initiatives);
      } catch (error) {
        console.error("Error fetching initiatives:", error);
      }
    };

    if (userId) {
      fetchUserDetails();
      fetchInitiatives();
    }
  }, [userId]);

  const handleEditClick = () => {
    setActiveAction("edit");
  };

  const handleChangePasswordClick = () => {
    setActiveAction("changePassword");
  };

  const handleCloseModal = () => {
    setActiveAction(null);
  };

  return (
    <>
      <div className={styles["user-details-container"]}>
        <div className={styles["user-details-content"]}>
          {userDetails ? (
            <div className={styles["user-details"]}>
              <div className={styles["user-profile"]}>
                <div>
                  <img
                    src={ProfilePlaceholder}
                    alt="Profile"
                    className={styles["user-image circular"]}
                  />
                </div>
                <div className={styles["user-info"]}>
                  <p className={styles["user-name"]}>
                    {userDetails.first_name} {userDetails.last_name}
                  </p>
                  {userDetails.email && (
                    <p className={styles["user-email"]}>
                      Email: {userDetails.email}
                    </p>
                  )}
                  <div className={styles["user-role-label"]}>
                    <p className={styles["user-role"]}>{userDetails.role}</p>
                  </div>
                </div>
                <div className={styles["top-right-button-container"]}>
                  <div
                    className={styles["top-right-button"]}
                    onClick={handleEditClick}
                  >
                    <img src={EditIcon} alt="Edit" className={styles["icon"]} />
                    Bewerken
                  </div>
                  <div
                    className={styles["top-right-button"]}
                    onClick={handleChangePasswordClick}
                  >
                    <img
                      src={ChangePasswordIcon}
                      alt="Change Password"
                      className={styles["icon"]}
                    />
                    Verander wachtwoord
                  </div>
                </div>
              </div>

              <div className={styles["user-description"]}>
                <h3 className={styles["section-title"]}>Description</h3>
                <p className={styles["section-content"]}>
                  {userDetails.biography}
                </p>
              </div>

              <div className={styles["user-initiatives"]}>
                <h3 className={styles["section-title"]}>Initiatives</h3>
                <InitiativeList initiatives={initiatives} />
              </div>
              <div className={styles["user-activities"]}>
                <h3 className={styles["section-title"]}>Activities</h3>
                {userDetails.activities.length > 0 ? (
                  <></>
                ) : (
                  <p className={styles["section-content"]}>
                    No activities available.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className={styles["loading-container"]}>
              <LoadingDot delay={0} />
              <LoadingDot delay={0.1} />
              <LoadingDot delay={0.1} />
              <LoadingDot delay={0.2} />
              <LoadingDot delay={0.2} />
            </div>
          )}
        </div>
      </div>
      {activeAction === "edit" && (
        <AddItemModal isOpen={true} onClose={handleCloseModal}>
          <EditUserProfileForm
            userId={userId || null}
            onCancel={handleCloseModal}
            onContinue={handleCloseModal}
            first_name={""}
            last_name={""}
            biography={""}
            hidden={true}
          />
        </AddItemModal>
      )}

      {activeAction === "changePassword" && (
        <AddItemModal isOpen={true} onClose={handleCloseModal}>
          <ChangePasswordForm onClose={handleCloseModal} userId={userId} />
        </AddItemModal>
      )}
    </>
  );
}
