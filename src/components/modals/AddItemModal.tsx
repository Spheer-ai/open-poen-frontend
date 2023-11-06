import React, { useState } from "react";
import { AddItemModalProps } from "../../types/AddItemModalTypes";
import { useTransition, animated, config } from "react-spring";

const AddItemModal: React.FC<AddItemModalProps & { isConfirmed?: boolean }> = ({
  isOpen,
  onClose,
  children,
  onConfirm,
  isConfirmed: propIsConfirmed,
}) => {
  const transitions = useTransition(isOpen, {
    from: { opacity: 0, transform: "translateX(100%)" },
    enter: { opacity: 1, transform: "translateX(0%)" },
    leave: { opacity: 0, transform: "translateX(100%)" },
    config: config.default,
  });
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  console.log("AddItemModal isOpen:", isOpen);

  const handleConfirmClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onConfirm) {
      onConfirm();

      if (isConfirmed) {
        window.location.reload();
      } else {
        onClose();
      }
    }
  };

  return (
    <>
      {transitions(
        (props, item) =>
          item && (
            <animated.div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1000,
              }}
              onClick={onClose}
            >
              <animated.div
                className="modal-overlay"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 100000,
                  background: "rgba(0, 0, 0, 0.6)",
                  opacity: props.opacity,
                }}
              ></animated.div>
              <animated.div
                className="modal-content"
                style={{
                  position: "absolute",
                  right: "0",
                  width: "500px",
                  height: "100%",
                  background: "#fff",
                  padding: "20px",
                  overflowY: "auto",
                  zIndex: "999999",
                  transform: props.transform,
                }}
                onClick={handleContentClick}
              >
                <button
                  className="close-button"
                  onClick={handleConfirmClick}
                  style={{
                    background: "none",
                    border: "none",
                    color: "rgb(143, 142, 142)",
                    fontSize: "30px",
                    cursor: "pointer",
                    position: "absolute",
                    right: "41px",
                    top: "30px",
                  }}
                >
                  &times;
                </button>
                {children}
              </animated.div>
            </animated.div>
          ),
      )}
    </>
  );
};

export default AddItemModal;
