import React from "react";
import { useTransition, animated } from "react-spring";
import "./SlideInModal.module.scss";

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
        <animated.div style={styles} className="modal">
          <div className="modal-content">
            {" "}
            <button className="close-button" onClick={onClose}>
              {" "}
              &times;
            </button>
            {children}
          </div>
        </animated.div>
      ),
  );
};

export default SlideInModal;
