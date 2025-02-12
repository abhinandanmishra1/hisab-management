import { Document, Schema, Types } from 'mongoose';

export const DistributionSchema = new Schema({
  amount: { type: Number, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

export const HisabSchema = new Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  paidBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  distributions: { type: [DistributionSchema], required: true },
  group: { type: Schema.Types.ObjectId, ref: 'Group' },
});


HisabSchema.set('toJSON', {
  transform: (_, ret) => {
    ret.id = ret._id;   // Rename _id to id
    delete ret._id;     // Optionally remove _id
    return ret;
  },
});


HisabSchema.set('toObject', {
  transform: (_, ret) => {
    ret.id = ret._id;   // Rename _id to id
    delete ret._id;     // Optionally remove _id
    return ret;
  },
});
