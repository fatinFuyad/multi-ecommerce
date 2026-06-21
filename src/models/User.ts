import mongoose, { Document } from "mongoose";

export interface IUser {
  clerkId: string;
  name: string;
  email: string;
  picture: string;
  role: "ADMIN" | "SELLER" | "USER";
  stores?: mongoose.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserData extends IUser, Document {}

const userStoreSchema = new mongoose.Schema({
  stores: {
    type: mongoose.Types.ObjectId,
    ref: "Store"
  }
});

const userSchema = new mongoose.Schema<UserData>(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: [true, "User should provider user's name"]
    },
    email: {
      type: String,
      required: [true, "User should provide a email"],
      unique: true
    },
    picture: String,
    role: {
      type: String,
      enum: ["ADMIN", "SELLER", "USER"],
      default: "USER"
    },
    stores: [userStoreSchema]
  },
  {
    timestamps: true
  }
);

const User =
  mongoose.models.User<UserData> || mongoose.model("User", userSchema);
export default User;
