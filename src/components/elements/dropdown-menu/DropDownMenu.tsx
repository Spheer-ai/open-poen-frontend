import React from "react";
import styles from "../../../assets/scss/DropDownMenu.module.scss";
import { DropdownMenuProps } from "../../../types/DropDownMenuTypes";

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  isOpen,
  onEditClick,
  onDeleteClick,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles["dropdown-menu"]}>
      <button className={styles["menu-option"]} onClick={onEditClick}>
        Bewerken
      </button>
      <button className={styles["menu-option-delete"]} onClick={onDeleteClick}>
        Verwijderen
      </button>
    </div>
  );
};

export default DropdownMenu;
