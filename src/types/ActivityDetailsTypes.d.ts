interface ActivityDetails {
  id: number;
  name: string;
  description: string;
  purpose: string;
  target_audience: string;
  budget: number;
  income: number;
  expenses: number;
  profile_picture: {
    attachment_thumbnail_url_512: string;
  };
  activity_owners: ActivityOwner[];
  entityPermissions: string[];
  grant: {
    id: number;
    name: string;
    reference: string;
    budget: number;
  };
  initiative: {
    kvk_registration: string;
    location: string;
  };
}
