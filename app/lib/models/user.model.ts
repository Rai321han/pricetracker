import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface User extends Document {
  userId: number;
  username: string;
  firstName: string;
  lastName: string;
  authDate: number;
  hash: string;
  chatId: number;
  products: Types.ObjectId[];
}

const userSchema: Schema<User> = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  authDate: {
    type: Number,
    required: true,
  },
  hash: {
    type: String,
    required: true,
  },
  chatId: {
    type: Number,
  },
  products: [{ type: Types.ObjectId }],
});

const User: Model<User> =
  mongoose.models.User || mongoose.model<User>("User", userSchema);
export default User;
