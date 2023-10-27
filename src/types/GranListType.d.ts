export type Grant = {
  id: number;
  name: string;
  reference: string;
  budget: number;
  income: number;
  expenses: number;
  permissions: string[];
};

export type GrantOfficer = {
  email: string;
};

export type PolicyOfficer = {
  email: string;
};
