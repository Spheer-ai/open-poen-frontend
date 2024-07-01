export interface Initiative {
  id: number;
  name: string;
  budget: number;
  income: number;
  expenses: number;
  hidden: boolean;
  beschikbaar?: number;
}
