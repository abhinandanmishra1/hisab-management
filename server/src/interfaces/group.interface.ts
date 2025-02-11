import { Document, Types } from 'mongoose';

export interface Group extends Document {
  id: string;
  name: string;
  members: Types.ObjectId[];
  hisabs: Types.ObjectId[];
}
