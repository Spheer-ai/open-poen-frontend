export interface DropdownMenuProps {
  isOpen: boolean;
  onEditClick: () => void;
  onDeleteClick: () => void;
  userPermissions;
  hasDeletePermission;
}
