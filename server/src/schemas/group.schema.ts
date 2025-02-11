import { Document, Schema, Types } from 'mongoose';

export const GroupSchema = new Schema({
  name: { type: String, required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  hisabs: [{ type: Schema.Types.ObjectId, ref: 'Hisab' }],
});
