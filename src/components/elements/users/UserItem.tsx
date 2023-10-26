import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ProfileIcon from "../../../assets/profile-icon.svg";
import UserDropdown from "../dropdown-menu/UserDropwdown";
import styles from "../../../assets/scss/Contacts.module.scss";

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
          {user.id && (
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
