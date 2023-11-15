export interface EditUserFormProps {
  userId: string | null;
  onCancel: () => void;
  onContinue: () => void;
  fieldPermissions;
  fields: string[];
}
