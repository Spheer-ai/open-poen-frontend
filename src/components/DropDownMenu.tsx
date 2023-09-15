// DropdownMenu.js
import React from "react";
import "../components/DropDownMenu.css";

interface DropdownMenuProps {
  isOpen: boolean;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  isOpen,
  onEditClick,
  onDeleteClick,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="dropdown-menu">
      <button className="menu-option" onClick={onEditClick}>
        Bewerken
      </button>
      <button className="menu-option delete" onClick={onDeleteClick}>
        Verwijderen
      </button>
    </div>
  );
};

export default DropdownMenu;
