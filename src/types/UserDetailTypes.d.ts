export interface UserDetails {
  first_name: string;
  last_name: string;
  email: string;
  image: string | null;
  userId: string;
  token: string | null;
  is_superuser?: boolean;
  id: number;
  email: string;
  activities: {
    id: string;
    name: string;
  }[];

  initiatives: {
    id: number;
    name: string;
  }[];
}
