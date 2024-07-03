export interface EditFundProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  onFundEdited: (updatedFundData: FundDetails) => void; // Update this line
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
  profile_picture?: { attachment_thumbnail_url_512: string }; // Add this line
}
