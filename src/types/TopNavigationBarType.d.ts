export interface TopNavigationBarProps {
  title: string;
  showSettings: boolean;
  onSettingsClick: () => void;
  showCta: boolean;
  onCtaClick: () => void;
  onSearch: (query: any) => void;
  showBackButton?: boolean;
  onBackClick?: () => void;
  onBackArrowClick?: () => void;
  entityClass?: string;
  children?: ReactNode;
  hasPermission: boolean;
}
