export interface TopNavigationBarProps {
  title: string;
  subtitle?: React.ReactNode;
  subtitleStyle?: React.CSSProperties;
  showSettings: boolean;
  onSettingsClick: () => void;
  showCta: boolean;
  onCtaClick: () => void;
  onSearch: (query: any) => void;
  showBackButton?: boolean;
  onBackClick?: () => void;
  onBackArrowClick?: () => void;
  entityClass?: string;
  children?: React.ReactNode;
  hasPermission: boolean;
  showSearch: boolean;
  onTitleClick?: () => void;
  showHomeLink: boolean;
  showTitleOnSmallScreen: boolean;
}
