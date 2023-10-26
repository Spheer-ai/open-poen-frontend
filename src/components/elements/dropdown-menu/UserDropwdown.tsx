import React, { useState, useEffect, useRef } from "react";
import DropdownMenu from "../dropdown-menu/DropDownMenu";
import styles from "../../../assets/scss/UserDropDown.module.scss";

const UserDropdown = ({ isOpen, onEditClick, onDeleteClick, userId }) => {
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
    <div ref={dropdownRef}>
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
        />
      )}
    </div>
  );
};

export default UserDropdown;
