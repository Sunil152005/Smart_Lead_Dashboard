import mongoose from "mongoose";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: "ADMIN" | "SALES";
  avatar?: string;
  createdAt: Date;
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["ADMIN", "SALES"],
      default: "SALES",
    },
    avatar: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);