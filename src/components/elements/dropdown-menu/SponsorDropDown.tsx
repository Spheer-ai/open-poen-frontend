import React, { useState, useEffect, useRef } from "react";
import DropdownMenu from "./DropDownMenu";
import styles from "../../../assets/scss/SponsorDropdown.module.scss";

const SponsorDropdown = ({
  isOpen,
  onEditClick,
  onDeleteClick,
  sponsorId,
  userPermissions,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(isOpen);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    }

    if (isDropdownOpen) {
      window.addEventListener("click", handleClickOutside);
    }

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <div className={styles["dot-menu-container"]} ref={dropdownRef}>
      <div
        className={styles["three-dots"]}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <div className={styles["dot"]}></div>
        <div className={styles["dot"]}></div>
        <div className={styles["dot"]}></div>
      </div>
      {isDropdownOpen && (
        <DropdownMenu
          isOpen={isDropdownOpen}
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
          userPermissions={userPermissions}
        />
      )}
    </div>
  );
};

export default SponsorDropdown;
