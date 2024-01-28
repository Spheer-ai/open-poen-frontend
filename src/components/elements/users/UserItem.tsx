import React from "react";
import { Link } from "react-router-dom";
import ProfileIcon from "../../../assets/profile-icon.svg";
import styles from "../../../assets/scss/Contacts.module.scss";
import { useAuth } from "../../../contexts/AuthContext";

const UserItem = ({ user, isActive, handleUserClick }) => {
  const userItemId = user.id;
  const { user: authUser } = useAuth();
  const isUserHidden = user.hidden === true;
  const isUserInactive = user.is_active === false;

  const fullName = `${user.first_name || "Voornaam"} ${user.last_name || ""}`;

  return (
    <div
      onClick={() => handleUserClick(userItemId)}
      className={`${styles["user-list"]} ${
        isActive ? styles["active-user"] : ""
      }`}
      style={{
        backgroundColor: isActive ? "gray" : "white",
      }}
    >
      <Link to={`/contacts/${userItemId}`} className={`${styles["user-link"]}`}>
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
            <p data-tip={fullName}>{fullName}</p>
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
        {authUser && userItemId === authUser.id && (
          <div>
            <img
              src={ProfileIcon}
              alt="Profile Icon"
              className={styles["profile-icon"]}
            />
          </div>
        )}
      </Link>
    </div>
  );
};

export default UserItem;
