export default interface UserDetails {
  activities: any;
  biography: ReactNode;
  role: any;
  first_name: string;
  last_name: string;
  email: string;
  image: string | null;
  userId: string;
  token: string | null;
  is_superuser?: boolean;
  profile_picture: {
    attachment_url: string;
  } | null;
}
