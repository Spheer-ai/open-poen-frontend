// AddItemModal.tsx
import React from "react";
import "./AddItemModal.css";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default AddItemModal;
