export interface EditUserFormProps {
  userId: string | null;
  fieldPermissions;
  fields: string[];
  isOpen: boolean;
  onClose: () => void;
  onUserEdited: () => void;
  isBlockingInteraction: boolean;
}
