import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { useAuth } from "../../contexts/AuthContext";
import UserDetails from "../../types/UserTypes";
import ProfilePlaceholder from "/profile-placeholder.png";
import styles from "../../assets/scss/UserDetailPage.module.scss";
import LoadingDot from "../animation/LoadingDot";
import AddItemModal from "../modals/AddItemModal";
import ChangePasswordForm from "../forms/ChangePasswordForm";
import EditUserProfileForm from "../forms/EditUserProfileForm";
import EditIcon from "/edit-icon.svg";
import ChangePasswordIcon from "/change-password-icon.svg";
import { fetchUserDetails, fetchInitiatives } from "../middleware/Api";
import { usePermissions } from "../../contexts/PermissionContext";

const roleLabels = {
  administrator: "Beheerder",
  financial: "Financieel",
  user: "Gebruiker",
  superuser: "Super beheerder",
};

interface DecodedToken {
  sub: string;
}

export default function UserDetailsPage() {
  const { user: authUser } = useAuth();
  const { user } = useAuth();
  const token = authUser?.token;
  const { userId } = useParams<{ userId: string }>();

  let loggedInUserId: string | null = null;
  if (token) {
    const decodedToken: DecodedToken = jwtDecode(token);
    loggedInUserId = decodedToken.sub;
  }
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [initiatives, setInitiatives] = useState([]);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const { fetchPermissions } = usePermissions();
  const [entityPermissions, setEntityPermissions] = useState<string[]>([]);
  const [hasEditPermission, setHasEditPermission] = useState(false);

  useEffect(() => {
    async function fetchUserPermissions() {
      try {
        if (user && user.token && userId) {
          const userPermissions: string[] | undefined = await fetchPermissions(
            "User",
            parseInt(userId),
            user.token,
          );

          if (userPermissions && userPermissions.includes("edit")) {
            console.log("User has edit permission");
            setHasEditPermission(true);
          } else {
            console.log("User does not have edit permission");
            setHasEditPermission(false);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user permissions:", error);
      }
    }

    fetchUserPermissions();
  }, [user, userId]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId && token) {
        try {
          const userResponse = await fetchUserDetails(userId, token);
          setUserDetails(userResponse);
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
    };

    const fetchUserInitiatives = async () => {
      try {
        const initiativesResponse = await fetchInitiatives();
        setInitiatives(initiativesResponse);
      } catch (error) {
        console.error("Error fetching initiatives:", error);
      }
    };

    if (userId) {
      fetchUserData();
      fetchUserInitiatives();
    }
  }, [userId, token]);

  const handleEditClick = () => {
    setActiveAction("edit");
  };

  const handleChangePasswordClick = () => {
    setActiveAction("changePassword");
  };

  const handleCloseModal = () => {
    setActiveAction(null);
  };

  console.log("hasEditPermission:", hasEditPermission);
  console.log("API Response for permissions:", entityPermissions);

  return (
    <>
      <div className={styles["user-details-container"]}>
        <div className={styles["user-details-content"]}>
          {userDetails ? (
            <div className={styles["user-details"]}>
              <div className={styles["user-profile"]}>
                <div>
                  <img
                    src={
                      userDetails?.profile_picture?.attachment_url ||
                      ProfilePlaceholder
                    }
                    alt="Profile"
                    className={`${styles["user-image"]} ${styles["circular"]}`}
                  />
                </div>
                <div className={styles["user-container"]}>
                  <div className={styles["user-info"]}>
                    <p className={styles["user-name"]}>
                      {userDetails.first_name} {userDetails.last_name}
                    </p>
                    {userDetails.email && (
                      <p className={styles["user-email"]}>
                        {userDetails.email}
                      </p>
                    )}
                  </div>
                </div>
                <div className={styles["user-role-label"]}>
                  <p className={styles["user-role"]}>
                    {roleLabels[userDetails.role] || userDetails.role}
                  </p>
                  {userDetails.is_superuser && (
                    <p className={styles["user-role"]}>
                      {roleLabels.superuser}
                    </p>
                  )}
                </div>
                <div className={styles["top-right-button-container"]}>
                  {hasEditPermission && (
                    <div
                      className={styles["top-right-button"]}
                      onClick={handleEditClick}
                    >
                      <img
                        src={EditIcon}
                        alt="Edit"
                        className={styles["icon"]}
                      />
                      Profiel bewerken
                    </div>
                  )}
                  {loggedInUserId === userId && (
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
                  )}
                </div>
              </div>

              <div className={styles["user-description"]}>
                <h3 className={styles["section-title"]}>Omschrijving</h3>
                <p className={styles["section-content"]}>
                  {userDetails.biography}
                </p>
              </div>

              <div className={styles["user-initiatives"]}>
                <h3 className={styles["section-title"]}>Initiatieven</h3>
              </div>
              <div className={styles["user-activities"]}>
                <h3 className={styles["section-title"]}>Activiteiten</h3>
                {userDetails.activities.length > 0 ? (
                  <></>
                ) : (
                  <p className={styles["section-content"]}>
                    Geen activiteiten beschikbaar.
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
