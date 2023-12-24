import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import SettingsIcon from "/setting-icon.svg";
import ChangePasswordIcon from "/change-password-icon.svg";
import { fetchUserDetails } from "../middleware/Api";
import { usePermissions } from "../../contexts/PermissionContext";
import { useFieldPermissions } from "../../contexts/FieldPermissionContext";
import EditUserForm from "../modals/EditUser";
import DeleteUser from "../modals/DeleteUser";

const roleLabels = {
  administrator: "Beheerder",
  financial: "Financieel",
  user: "Gebruiker",
  superuser: "Super beheerder",
};

interface DecodedToken {
  sub: string;
}

interface UserDetailsPageProps {
  onUserDeleted: () => void;
  onUserEdited: () => void;
  onUserProfileEdited: () => void;}

export default function UserDetailsPage({
  onUserDeleted,
  onUserEdited,
  onUserProfileEdited
}: UserDetailsPageProps) {
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
  const navigate = useNavigate();
  const [isBlockingInteraction, setIsBlockingInteraction] = useState(false);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isEditUserProfileModalOpen, setIsEditUserProfileModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const { fetchFieldPermissions } = useFieldPermissions();
  const { fetchPermissions } = usePermissions();
  const [entityPermissions, setEntityPermissions] = useState<string[]>([]);
  const [hasEditPermission, setHasEditPermission] = useState(false);
  const [hasDeletePermission, setHasDeletePermission] = useState(false);
  const [selectedInitiativeId, setSelectedInitiativeId] = useState(null);

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

    if (userId) {
      fetchUserData();
    }
  }, [userId, token, refreshTrigger]);

  const handleChangePasswordClick = () => {
    setActiveAction("changePassword");
  };

  const handleCloseModal = () => {
    setActiveAction(null);
  };

  const handleToggleDeleteUserModal = () => {
    if (isDeleteUserModalOpen) {
      setIsBlockingInteraction(true);
      setTimeout(() => {
        setIsBlockingInteraction(false);
        setIsDeleteUserModalOpen(false);
        if (onUserDeleted) {
          onUserDeleted();
        }
      }, 300);
    } else {
      setIsDeleteUserModalOpen(true);
    }
  };

  const handleUserDeleted = () => {
    setRefreshTrigger((prev) => prev + 1);
    if (onUserDeleted) {
      onUserDeleted();
    }
    navigate(`/contacts/${loggedInUserId}`);
  };

  const handleUserEdited = () => {
    setRefreshTrigger((prev) => prev + 1);
    if (onUserEdited) {
      onUserEdited();
    }
  };

  const handleToggleEditUserModal = () => {
    if (isEditUserModalOpen) {
      setIsBlockingInteraction(true);
      setTimeout(() => {
        setIsBlockingInteraction(false);
        setIsEditUserModalOpen(false);
        if (onUserEdited) {
          onUserEdited();
        }
      }, 300);
    } else {
      setIsEditUserModalOpen(true);
    }
  };

  const handleUserProfileEdited = () => {
    setRefreshTrigger((prev) => prev + 1);
    if (onUserProfileEdited) {
      onUserProfileEdited();
    }
  };

  const handleToggleEditUserProfileModal = () => {
    if (isEditUserProfileModalOpen) {
      setIsBlockingInteraction(true);
      setTimeout(() => {
        setIsBlockingInteraction(false);
        setIsEditUserProfileModalOpen(false);
        if (onUserProfileEdited) {
          onUserProfileEdited();
        }
      }, 300);
    } else {
      setIsEditUserProfileModalOpen(true);
    }
  };

  console.log("hasEditPermission:", hasEditPermission);
  console.log("API Response for permissions:", entityPermissions);

  console.log("User Details:", userDetails);

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
                      onClick={handleToggleEditUserProfileModal}
                    >
                      <img
                        src={EditIcon}
                        alt="Profiel"
                        className={styles["icon"]}
                      />
                      Profiel
                    </div>
                  )}
                  {hasEditPermission && (
                    <div
                      className={styles["top-right-button"]}
                      onClick={handleToggleEditUserModal}
                    >
                      <img
                        src={SettingsIcon}
                        alt="Instellingen"
                        className={styles["icon"]}
                      />
                      Instellingen
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
                      Wachtwoord
                    </div>
                  )}
                  {hasDeletePermission && (
                    <div
                      className={styles["top-right-button"]}
                      onClick={handleToggleDeleteUserModal}
                    >
                      <img
                        alt="Delete User"
                        className={styles["icon"]}
                        src={DeleteIcon}
                      />
                      Verwijderen
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
                <ul className={styles["initiative-list"]}>
                  {userDetails?.initiatives.map((initiative) => (
                    <li
                      className={styles["initiative-list-item"]}
                      key={initiative.id}
                    >
                      {initiative.name}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles["user-activities"]}>
                <h3 className={styles["section-title"]}>Activiteiten</h3>
                <ul className={styles["initiative-list"]}>
                  {Array.isArray(userDetails?.activities) &&
                    userDetails.activities.map((activity) => (
                      <li
                        className={styles["initiative-list-item"]}
                        key={activity.id}
                      >
                        {activity.name}
                      </li>
                    ))}
                </ul>
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

      {activeAction === "changePassword" && (
        <AddItemModal isOpen={true} onClose={handleCloseModal}>
          <ChangePasswordForm onClose={handleCloseModal} userId={userId} />
        </AddItemModal>
      )}

<EditUserProfileForm
            userId={userId || null}
            first_name={""}
            last_name={""}
            biography={""}
            hidden={true}
            fieldPermissions={entityPermissions}
            fields={[]}
            isOpen={isEditUserProfileModalOpen}
            onClose={handleToggleEditUserProfileModal}
            isBlockingInteraction={isBlockingInteraction}
            onUserProfileEdited={handleUserProfileEdited}
          />

      <EditUserForm
        userId={userId || ""}
        fieldPermissions={entityPermissions}
        fields={[]}
        isOpen={isEditUserModalOpen}
        onClose={handleToggleEditUserModal}
        isBlockingInteraction={isBlockingInteraction}
        onUserEdited={handleUserEdited}
      />
      <DeleteUser
        isOpen={isDeleteUserModalOpen}
        onClose={handleToggleDeleteUserModal}
        onUserDeleted={handleUserDeleted}
        userId={userId}
        isBlockingInteraction={isBlockingInteraction}
      />
    </>
  );
}
