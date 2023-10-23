export interface TopNavigationBarProps {
  title: string;
  showSettings: boolean;
  onSettingsClick: () => void;
  showCta: boolean;
  onCtaClick: () => void;
  onSearch: (query: any) => void;
  globalPermissions: string[];
  showBackButton?: boolean;
  onBackClick?: () => void;
  onBackArrowClick?: () => void;
}
