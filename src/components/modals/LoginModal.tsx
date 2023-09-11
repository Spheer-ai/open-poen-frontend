import React from "react";
import "./LoginModal.css";

function LoginModal({ onClose, onLogin }) {
  const handleLogin = () => {
    onLogin();
  };

  return (
    <div className="login-modal">
      <div className="login-content" onClick={onClose}>
        <h2>Login</h2>
        <button onClick={handleLogin}>Login</button>
      </div>
      <div className="modal-overlay" onClick={onClose}></div>
    </div>
  );
}

export default LoginModal;
