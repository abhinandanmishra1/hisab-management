export type Distribution = {
  userId: string;
  amount: number;
};

export interface Hisab {
  id: string;
  name: string;
  amount: number;
  date: Date;
  paidBy: string;
  distributions: Distribution[];
  group: string;
}
