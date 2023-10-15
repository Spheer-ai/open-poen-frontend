import React from "react";
import styles from "../../../assets/scss/DropDownMenu.module.scss";
import { DropdownMenuProps } from "../../../types/DropDownMenuTypes";

const DropdownMenu: React.FC<DropdownMenuProps & { canDelete: boolean }> = ({
  isOpen,
  onEditClick,
  onDeleteClick,
  canDelete,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles["dropdown-menu"]}>
      <button className={styles["menu-option"]} onClick={onEditClick}>
        Bewerken
      </button>
      {canDelete && (
        <button
          className={styles["menu-option-delete"]}
          onClick={onDeleteClick}
          style={{ display: canDelete ? "block" : "none" }}
        >
          Verwijderen
        </button>
      )}
    </div>
  );
};

export default DropdownMenu;
