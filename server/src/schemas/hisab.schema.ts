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
