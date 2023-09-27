export interface AddUserFormProps {
  formData: {
    email: string;
    first_name: string;
    last_name: string;
    biography: string;
    role: string;
    is_active: boolean;
    is_superuser: boolean;
    is_verified: boolean;
    hidden: boolean;
  };
  token: string;
  onSubmit: (formData: typeof initialFormData) => void;
  onContinue: () => void;
  onCancel: () => void;
}
