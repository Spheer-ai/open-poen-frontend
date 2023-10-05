import React, { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin } from "../components/middleware/Api";
import { UserData, AuthContextValue } from "../types/AuthContextTypes";
import { IntlProvider, createIntl, IntlShape } from 'react-intl';
import { messages, defaultLocale } from "../locale/messages"; // Import the messages and defaultLocale
import { getLocale } from "../locale/locale"; // Import the getLocale function

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

  // Initialize 'intl' here with the current locale
  const locale = getLocale(); // Get the current locale
  const intl: IntlShape = createIntl({ locale, messages: messages[locale] });

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
        throw new Error(intl.formatMessage({ id: "auth.usernamePasswordRequired" }));
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
    <AuthContext.Provider value={contextValue}>
      <IntlProvider locale={intl.locale} messages={messages[intl.locale] || messages[defaultLocale]}>
        {children}
      </IntlProvider>
    </AuthContext.Provider>
  );
};
