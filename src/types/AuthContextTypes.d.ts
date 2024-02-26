export interface UserData {
  userId?: number;
  username?: string;
  token: string;
  id?: string;
}

export interface AuthContextValue {
  user: UserData | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}
