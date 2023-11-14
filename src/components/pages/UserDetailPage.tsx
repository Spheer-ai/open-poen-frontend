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
import DeleteIcon from "/bin-icon.svg";
import ChangePasswordIcon from "/change-password-icon.svg";
import { fetchUserDetails, fetchInitiatives } from "../middleware/Api";
import { usePermissions } from "../../contexts/PermissionContext";
import { useFieldPermissions } from "../../contexts/FieldPermissionContext";
import EditUserForm from "../forms/EditUserForm";
import DeleteUserForm from "../forms/DeleteUserForm";

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
  const { fetchFieldPermissions } = useFieldPermissions();
  const { fetchPermissions } = usePermissions();
  const [entityPermissions, setEntityPermissions] = useState<string[]>([]);
  const [hasEditPermission, setHasEditPermission] = useState(false);
  const [hasDeletePermission, setHasDeletePermission] = useState(false);

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

          if (userPermissions && userPermissions.includes("delete")) {
            console.log("User has delete permission");
            setHasDeletePermission(true);
          } else {
            console.log("User does not have delete permission");
            setHasDeletePermission(false);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user permissions:", error);
      }
    }

    fetchUserPermissions();
  }, [user, userId]);

  useEffect(() => {
    async function fetchFieldPermissionsOnMount() {
      try {
        if (user && user.token && userId) {
          const fieldPermissions: string[] | undefined =
            await fetchFieldPermissions("User", parseInt(userId), user.token);

          if (fieldPermissions) {
            setEntityPermissions(fieldPermissions);
          }
        }
      } catch (error) {
        console.error("Failed to fetch field permissions:", error);
      }
    }

    fetchFieldPermissionsOnMount();
  }, [user, userId, fetchFieldPermissions]);

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

  const handleEditUserClick = () => {
    setActiveAction("editUser");
  };

  const handleDeleteUserClick = () => {
    setActiveAction("deleteUser");
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
                    srcSet={
                      userDetails?.profile_picture
                        ? userDetails.profile_picture
                            .attachment_thumbnail_url_128 +
                          " 128w, " +
                          userDetails.profile_picture
                            .attachment_thumbnail_url_256 +
                          " 256w"
                        : undefined
                    }
                    sizes="(max-width: 768px) 128px, 256px"
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

                  {hasEditPermission && (
                    <div
                      className={styles["top-right-button"]}
                      onClick={handleEditUserClick}
                    >
                      <img
                        src={EditIcon}
                        alt="Edit User"
                        className={styles["icon"]}
                      />
                      Gebruiker bewerken
                    </div>
                  )}

                  {hasDeletePermission && (
                    <div
                      className={styles["top-right-button"]}
                      onClick={handleDeleteUserClick}
                    >
                      <img
                        alt="Delete User"
                        className={styles["icon"]}
                        src={DeleteIcon}
                      />
                      Gebruiker verwijderen
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
            fieldPermissions={entityPermissions}
            fields={[]}
          />
        </AddItemModal>
      )}

      {activeAction === "changePassword" && (
        <AddItemModal isOpen={true} onClose={handleCloseModal}>
          <ChangePasswordForm onClose={handleCloseModal} userId={userId} />
        </AddItemModal>
      )}

      {activeAction === "editUser" && (
        <AddItemModal isOpen={true} onClose={handleCloseModal}>
          <EditUserForm
            userId={userId || ""}
            onCancel={handleCloseModal}
            onContinue={handleCloseModal}
            fieldPermissions={entityPermissions}
            fields={[]}
          />
        </AddItemModal>
      )}

      {activeAction === "deleteUser" && (
        <AddItemModal isOpen={true} onClose={handleCloseModal}>
          <DeleteUserForm
            userId={userId || ""}
            onCancel={handleCloseModal}
            onContinue={handleCloseModal}
          />
        </AddItemModal>
      )}
    </>
  );
}
