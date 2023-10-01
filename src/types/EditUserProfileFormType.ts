export interface EditUserProfileFormProps {
  userId: string | null;
  onCancel: () => void;
  onContinue: () => void;
  first_name: string;
  last_name: string;
  biography: string;
  hidden: true;
}
