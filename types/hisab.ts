import { User } from "./user";

export type Distribution = {
  userId: string;
  amount: number;
};

export interface Hisab {
  id: string;
  name: string;
  amount: number;
  date: Date;
  paidBy: User;
  distributions: Distribution[];
  group: string;
}

export interface CreateHisabPayload extends Omit<Hisab, "id" | "paidBy"> {
  paidBy: string;
}