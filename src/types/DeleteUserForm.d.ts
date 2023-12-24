export interface DeleteUserFormProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onUserDeleted: () => void;
  isBlockingInteraction: boolean;
}
