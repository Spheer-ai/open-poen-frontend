export interface UserDetails {
  initiatives: any;
  profile_picture: any;
  is_superuser: any;
  profileImage: string;
  activities: string;
  biography: string;
  x: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  image: string | null;
  id: number;
  activities: {
    id: number;
    name: string;
  }[];

  initiatives: {
    id: number;
    name: string;
  }[];
}

export default UserDetails;
