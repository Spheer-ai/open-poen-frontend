import React from "react";
import { useTransition, animated } from "react-spring";
import "./SlideInModal.module.scss"; // Remove the styles import

interface SlideInModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const SlideInModal: React.FC<SlideInModalProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  const transitions = useTransition(isOpen, {
    from: { transform: "translateX(100%)", opacity: 0 },
    enter: { transform: "translateX(0)", opacity: 1 },
    leave: { transform: "translateX(100%)", opacity: 0 },
  });

  return transitions(
    (styles, item) =>
      item && (
        <animated.div
          style={styles}
          className="modal" // Use the class names directly
        >
          <div className="modal-content">
            {" "}
            // Use the class names directly
            <button className="close-button" onClick={onClose}>
              {" "}
              // Use the class names directly &times;
            </button>
            {children}
          </div>
        </animated.div>
      ),
  );
};

export default SlideInModal;
