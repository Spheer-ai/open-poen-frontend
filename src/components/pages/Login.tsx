import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import "./Login.css";

function Login({ onLogin }: { onLogin: () => void; onClose: () => void }) {
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const success = await login(username, password);

      if (success) {
        onLogin();
      } else {
        setError("Verkeerde gebruikersnaam en wachtwoord");
      }
    } catch (error) {
      setError(
        error.message || "Er is een fout opgetreden tijdens het inloggen.",
      );
    }
  };
  return (
    <div className="login-modal">
      <div className="login-modal-content">
        <div className="login-container">
          <div className="login-box">
            <div className="logo">
              <img src="/open-poen-logo-gradient.svg" alt="Project Logo" />
            </div>
            <div className="project-title">
              <img src="/login-openpoen-logo.svg" alt="Project Name" />
            </div>
            <div className="input-container">
              <span className="icon">
                <img
                  src="/input-username.svg"
                  alt="Username"
                  width="20"
                  height="20"
                />
              </span>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="input-container">
              <span className="icon">
                <img
                  src="/input-password.svg"
                  alt="Password"
                  width="20"
                  height="20"
                />
              </span>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              className="login-button"
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? "Inloggen..." : "Login"}
            </button>

            {error && <p className="error-message">{error}</p>}

            {isLoading && (
              <div className="loading-animation">
                <div className="spinner"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
