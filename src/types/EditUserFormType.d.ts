export interface EditUserFormProps {
  userId: string | null;
  onCancel: () => void;
  onContinue: () => void;
  navigate: (to: string) => void;
}
