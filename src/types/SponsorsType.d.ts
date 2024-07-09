export interface Regulation {
  id: number;
  name: string;
  funder: {
    name: string;
  };
}

export interface GrantDetails {
  regulation?: Regulation;
  verantwoordelijk?: string;
  verantwoordelijkheid?: string;
}

export interface RegulationDetails {
  name: string;
  funder: {
    name: string;
  };
}
