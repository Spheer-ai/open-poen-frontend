import React, { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin } from "../components/middleware/Api";
import { UserData, AuthContextValue } from "../types/AuthContextTypes";
import { FormattedMessage } from "react-intl";
import ReactDOMServer from "react-dom/server";

const AuthContext = createContext<AuthContextValue>({
  user: null,
  login: async () => false,
  logout: () => {},
  isLoading: false,
});

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ token });
    }
  }, []);

  const login = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    try {
      if (!username || !password) {
        const errorMessage = (
          <FormattedMessage
            id="auth.validation.required"
            defaultMessage="Field is required"
          />
        );

        const errorMessageString = ReactDOMServer.renderToString(errorMessage);

        throw errorMessageString;
      }

      setIsLoading(true);

      const response = await apiLogin(username, password);

      const token = response.access_token;
      localStorage.setItem("token", token);
      setUser({ token });

      setIsLoading(false);

      return true;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const contextValue: AuthContextValue = {
    user,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
