import { Document, Schema, Types } from 'mongoose';

export const GroupSchema = new Schema({
  name: { type: String, required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  hisabs: [{ type: Schema.Types.ObjectId, ref: 'Hisab' }],
});

GroupSchema.set('toJSON', {
  transform: (_, ret) => {
    ret.id = ret._id;   // Rename _id to id
    delete ret._id;     // Optionally remove _id
    return ret;
  },
});

GroupSchema.set('toObject', {
  transform: (_, ret) => {
    ret.id = ret._id;   // Rename _id to id
    delete ret._id;     // Optionally remove _id
    return ret;
  },
});
