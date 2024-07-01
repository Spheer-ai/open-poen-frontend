import React, { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin } from "../components/middleware/Api";
import { UserData, AuthContextValue } from "../types/AuthContextTypes";
import { IntlProvider, createIntl, IntlShape } from "react-intl";
import { messages, defaultLocale } from "../locale/messages";
import { getLocale } from "../locale/locale";
import jwtDecode from "jwt-decode";

interface JwtPayload {
  exp: number;
  userId: string;
  username: string;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  login: async () => false,
  logout: () => {},
  isLoading: false,
  isAuthenticated: false,
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
  const locale = getLocale();
  const intl: IntlShape = createIntl({ locale, messages: messages[locale] });

  const decodeToken = (token: string): JwtPayload | null => {
    try {
      const decodedToken = jwtDecode<JwtPayload>(token);
      return decodedToken;
    } catch (error) {
      return null;
    }
  };

  const isTokenExpired = (token: string) => {
    const decodedToken = decodeToken(token);
    if (!decodedToken || !decodedToken.exp) {
      return true;
    }

    return decodedToken.exp * 1000 < Date.now();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      if (isTokenExpired(token)) {
        logout();
      } else {
        const decodedToken = decodeToken(token);
        if (decodedToken) {
          setUser({
            token,
            userId: Number(decodedToken.userId),
            username: decodedToken.username,
          });
        }
      }
    }
  }, []);

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem("token");
      if (token) {
        if (isTokenExpired(token)) {
          window.location.href = "/login";
        }
      }
    };

    const tokenExpirationCheckInterval = setInterval(() => {
      checkTokenExpiration();
    }, 60000);

    return () => {
      clearInterval(tokenExpirationCheckInterval);
    };
  }, []);

  const login = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    try {
      if (!username || !password) {
        throw new Error(
          intl.formatMessage({ id: "auth.usernamePasswordRequired" }),
        );
      }

      setIsLoading(true);

      const response = await apiLogin(username, password);
      const token = response.access_token;

      const decodedToken = decodeToken(token);
      if (decodedToken) {
        setUser({
          token,
          userId: Number(decodedToken.userId),
          username: decodedToken.username,
        });

        localStorage.setItem("token", token);
      }

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
    isAuthenticated: !!user,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      <IntlProvider
        locale={intl.locale}
        messages={messages[intl.locale] || messages[defaultLocale]}
      >
        {children}
      </IntlProvider>
    </AuthContext.Provider>
  );
};
