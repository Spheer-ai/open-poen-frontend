import React from "react";
import { Link } from "react-router-dom";
import ProfileIcon from "../../../assets/profile-icon.svg";
import styles from "../../../assets/scss/Contacts.module.scss";
import { useAuth } from "../../../contexts/AuthContext";

const UserItem = ({
  user,
  isActive,
  loggedInId,
  isLoggedActiveUser,
  handleUserClick,
  isLoggedIn,
}) => {
  const userItemId = user.id;
  const { user: authUser } = useAuth();
  const token = authUser?.token;
  const isUserHidden = user.hidden === true;
  const isUserInactive = user.is_active === false;

  return (
    <div
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
          to={`/contacts/${userItemId}`}
          className={`${styles["user-link"]} ${
            isLoggedActiveUser ? styles["logged-in"] : ""
          }`}
        >
          <div className={styles["profile"]}>
            {user.profile_picture && (
              <img
                srcSet={`${
                  user.profile_picture.attachment_thumbnail_url_128 || ""
                } 128w, ${
                  user.profile_picture.attachment_thumbnail_url_256 || ""
                } 256w`}
                sizes="(max-width: 768px) 128px, 256px"
                src={user.profile_picture.attachment_url}
                alt="Profile"
                className={styles["profile-image"]}
              />
            )}
            {!user.profile_picture && (
              <img
                src="../../../profile-placeholder.png"
                alt="Profile"
                className={styles["profile-image"]}
              />
            )}

            <div className={styles["user-info"]}>
              <p data-tip={`${user.first_name} ${user.last_name}`}>
                {user.first_name} {user.last_name}
              </p>
              <p className={styles["profile-email"]} data-tip={user.email}>
                {user.email}
              </p>
              {isUserHidden && (
                <span className={styles["hidden-label"]}>Verborgen</span>
              )}
              {isUserInactive && (
                <span className={styles["inactive-label"]}>Inactief</span>
              )}
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
        </Link>
      ) : (
        <div
          className={`${styles["user-link"]} ${
            isLoggedActiveUser ? styles["logged-in"] : ""
          }`}
        >
          <div className={styles["profile"]}>
            {user.profile_picture && (
              <img
                src={user.profile_picture.attachment_url}
                alt="Profile"
                className={styles["profile-image"]}
              />
            )}
            {!user.profile_picture && (
              <img
                src="../../../profile-placeholder.png"
                alt="Profile"
                className={styles["profile-image"]}
              />
            )}
            <div className={styles["user-info"]}>
              <p data-tip={`${user.first_name} ${user.last_name}`}>
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
    </div>
  );
};

export default UserItem;
