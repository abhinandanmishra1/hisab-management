import { Document, Types } from 'mongoose';

export interface Distribution {
  amount: number;
  userId: Types.ObjectId;
}

export interface Hisab extends Document {
  id: string;
  name: string;
  amount: number;
  date: Date;
  paidBy: string;
  distributionType: 'equal' | 'unequal';
  distributions: Distribution[];
  group: Types.ObjectId;
}
