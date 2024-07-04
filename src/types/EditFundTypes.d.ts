export interface EditFundProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  onFundEdited: (updatedFundData: FundDetails) => void;
  initiativeId: string;
  authToken: string;
  fundData: FundDetails | null;
}

export interface FundDetails {
  id?: number;
  name?: string;
  description?: string;
  budget?: number;
  income?: number;
  expenses?: number;
  purpose?: string;
  target_audience?: string;
  kvk_registration?: string;
  location?: string;
  profile_picture?: { attachment_thumbnail_url_512: string };
  initiative_owners?: InitiativeOwner[];
}

export interface InitiativeOwner {
  id: number;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
  first_name: string;
  last_name: string;
  biography: string;
  role: string;
  profile_picture: {
    attachment_thumbnail_url_128: string;
  } | null;
}
