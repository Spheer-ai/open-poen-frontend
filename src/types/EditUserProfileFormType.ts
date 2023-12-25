export interface EditUserProfileFormProps {
  userId: string | null;
  first_name: string;
  last_name: string;
  biography: string;
  hidden: true;
  fieldPermissions;
  fields: string[];
  isOpen: boolean;
  onClose: () => void;
  onUserProfileEdited: () => void;
  isBlockingInteraction: boolean;
}
