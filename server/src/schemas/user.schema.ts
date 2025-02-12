import { Document, Schema, Types } from 'mongoose';

export const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  groups: [{ type: Schema.Types.ObjectId, ref: 'Group', required: true }],
});

UserSchema.set('toJSON', {
  transform: (_, ret) => {
      ret.id = ret._id;   // Rename _id to id
      delete ret._id;     // Optionally remove _id
      delete ret.password;
      return ret;
  }
});

UserSchema.set('toObject', {
  transform: (_, ret) => {
      ret.id = ret._id;
      delete ret._id;
      return ret;
  }
});