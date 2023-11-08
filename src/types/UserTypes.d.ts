export default interface UserDetails {
  activities: any;
  biography: string;
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
    attachment_thumbnail_url_128?: string;
    attachment_thumbnail_url_256?: string;
  } | null;
}
