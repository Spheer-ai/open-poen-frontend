export interface TopNavigationBarProps {
  title: string;
  showSettings: boolean;
  showCta: boolean;
  onSettingsClick?: () => void;
  onCtaClick?: () => void;
  onSearch: (query: string) => void;
  permissions: string[];
}
