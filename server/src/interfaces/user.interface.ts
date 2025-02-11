import { Document, Types } from 'mongoose';

export interface User extends Document {
  id: string;
  name: string;
  email: string;
  password: string;
  groups: Types.ObjectId[];
}
