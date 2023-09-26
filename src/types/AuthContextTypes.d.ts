export interface UserData {
  token: string | null;
}

export interface AuthContextValue {
  user: UserData | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}
