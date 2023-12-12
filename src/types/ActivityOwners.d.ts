export interface ActivityOwner {
  id: number;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
  first_name: string | null;
  last_name: string | null;
  biography: string | null;
  role: string;
  hidden: boolean;
  profile_picture: {
    id: number;
    attachment_url: string;
    attachment_thumbnail_url_128: string;
    attachment_thumbnail_url_256: string;
    attachment_thumbnail_url_512: string;
  };
}
