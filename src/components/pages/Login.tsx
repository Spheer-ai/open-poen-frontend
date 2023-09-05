// Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../middleware/Api";
import "./Login.css";
import backgroundImage from "../../assets/open-poen-background.jpg";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      if (!username || !password) {
        setError("Gebruikersnaam en wachtwoord zijn verplicht.");
        return;
      }

      // Set loading state to true when login starts
      setIsLoading(true);

      // Call the login function from your API file
      const response = await login(username, password);

      // Handle the response as needed
      const token = response.access_token;
      localStorage.setItem("token", token);

      // Loading animation
      setTimeout(() => {
        setIsLoading(false);
        navigate("/profile");
      }, 1000);
    } catch (error) {
      setError("Verkeerde gebruikersnaam en wachtwoord");
      setIsLoading(false);
    }
  };

  return (
    <div
      className="login-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
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
  );
}

export default Login;
