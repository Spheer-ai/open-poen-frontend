import React from "react";
import styles from "../../../assets/scss/DropDownMenu.module.scss";
import { DropdownMenuProps } from "../../../types/DropDownMenuTypes";

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  isOpen,
  onEditClick,
  onDeleteClick,
  userPermissions,
}) => {
  if (!isOpen) {
    return null;
  }

  const hasEditPermission = userPermissions.includes("edit");
  const hasDeletePermission = userPermissions.includes("delete");

  return (
    <div className={styles["dropdown-menu"]}>
      {hasEditPermission && (
        <button className={styles["menu-option"]} onClick={onEditClick}>
          Bewerken
        </button>
      )}
      {hasDeletePermission && (
        <button
          className={styles["menu-option-delete"]}
          onClick={onDeleteClick}
        >
          Verwijderen
        </button>
      )}
    </div>
  );
};

export default DropdownMenu;
