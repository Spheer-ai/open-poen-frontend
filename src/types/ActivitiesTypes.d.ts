export interface Activities {
  id: number;
  name: string;
  budget: number;
  income: number;
  expenses: number;
  initiativeName: string;
  hidden: boolean;
  beschikbaar?: number;
  id: number;
  name: string;
  budget: number;
  income: number;
  expenses: number;
  initiativeId: string;
  hidden?: boolean;
  initiativeData: InitiativeData;
}

export interface InitiativeData {
  id: number;
  name: string;
  budget: number;
  income: number;
  expenses: number;
  hidden: boolean;
  beschikbaar?: number;
  grant: {
    id: number;
    name: string;
    reference: string;
    budget: number;
  };
}

export interface ActivityDetails {
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

interface FundDetails {
  grant: {
    id: number;
    name: string;
    reference: string;
    budget: number;
  };
}
