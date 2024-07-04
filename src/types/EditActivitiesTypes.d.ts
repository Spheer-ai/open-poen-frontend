export interface EditActivityProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  onActivityEdited: (updatedActivityData: activityDetails) => void;
  initiativeId: string;
  activityId: string;
  authToken: string;
  activityData: ActivityDetails | null;
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
}

export interface ActivityDetails {
  id?: number;
  name?: string;
  description?: string;
  budget?: number;
  purpose?: string;
  target_audience?: string;
}
