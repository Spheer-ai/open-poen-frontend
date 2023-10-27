import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ProfileIcon from "../../../assets/profile-icon.svg";
import UserDropdown from "../dropdown-menu/UserDropwdown";
import styles from "../../../assets/scss/Contacts.module.scss";
import { usePermissions } from "../../../contexts/PermissionContext";

import { useAuth } from "../../../contexts/AuthContext";

const UserItem = ({
  user,
  isActive,
  loggedInId,
  isLoggedActiveUser,
  handleUserClick,
  handleEditButtonClick,
  handleOpenDeleteModal,
  dropdownOpen,
  isLoggedIn,
}) => {
  const userItemId = user.id;
  const { fetchPermissions } = usePermissions();
  const { user: authUser } = useAuth();
  const token = authUser?.token;

  const [hasEditPermission, setHasEditPermission] = useState(false);
  const [permissionsFetched, setPermissionsFetched] = useState(false);

  useEffect(() => {
    async function fetchUserPermissions() {
      try {
        if (user.id && !permissionsFetched) {
          const userPermissions = await fetchPermissions(
            "User",
            user.id,
            token,
          );
          if (userPermissions && userPermissions.includes("edit")) {
            setHasEditPermission(true);
          } else {
            setHasEditPermission(false);
          }
          setPermissionsFetched(true);
          console.log(
            `Permissions fetched for user ${user.id}:`,
            userPermissions,
          );
        }
      } catch (error) {
        console.error(
          `Failed to fetch user permissions for user ${user.id}:`,
          error,
        );
      }
    }

    fetchUserPermissions();
  }, [user.id, fetchPermissions, permissionsFetched, token]);

  console.log(`Rendered UserItem for user ${user.id}`);
  console.log(`hasEditPermission for user ${user.id}:`, hasEditPermission);

  return (
    <li
      key={userItemId}
      onClick={() => handleUserClick(userItemId)}
      className={`${styles["user-list"]} ${
        isActive ? styles["active-user"] : ""
      }`}
      style={{
        backgroundColor:
          isActive && loggedInId === userItemId ? "gray" : "white",
      }}
    >
      {isLoggedIn ? (
        <Link
          to={`/contacts/user/${userItemId}`}
          className={`${styles["user-link"]} ${
            isLoggedActiveUser ? styles["logged-in"] : ""
          }`}
        >
          <div className={styles["profile"]}>
            <img
              src="../../../profile-placeholder.png"
              alt="Profile"
              className={styles["profile-image"]}
            />
            <div className={styles["user-info"]}>
              <p data-tip={user.first_name + " " + user.last_name}>
                {user.first_name} {user.last_name}
              </p>
              <p className={styles["profile-email"]} data-tip={user.email}>
                {user.email}
              </p>
            </div>
          </div>
          {loggedInId == userItemId && (
            <div>
              <img
                src={ProfileIcon}
                alt="Profile Icon"
                className={styles["profile-icon"]}
              />
            </div>
          )}
          {hasEditPermission && user.id && (
            <UserDropdown
              isOpen={dropdownOpen[user.id]}
              onEditClick={() => handleEditButtonClick(user.id)}
              onDeleteClick={() => handleOpenDeleteModal(user.id)}
              userId={user.id}
            />
          )}
        </Link>
      ) : (
        <div
          className={`${styles["user-link"]} ${
            isLoggedActiveUser ? styles["logged-in"] : ""
          }`}
        >
          <div className={styles["profile"]}>
            <img
              src="../../../profile-placeholder.png"
              alt="Profile"
              className={styles["profile-image"]}
            />
            <div className={styles["user-info"]}>
              <p data-tip={user.first_name + " " + user.last_name}>
                {user.first_name} {user.last_name}
              </p>
              <p className={styles["profile-email"]} data-tip={user.email}>
                {user.email}
              </p>
            </div>
          </div>
          {loggedInId == userItemId && (
            <div>
              <img
                src={ProfileIcon}
                alt="Profile Icon"
                className={styles["profile-icon"]}
              />
            </div>
          )}
        </div>
      )}
    </li>
  );
};

export default UserItem;
