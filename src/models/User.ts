import mongoose, { Document } from "mongoose";

export interface IUser {
  // _id: string;
  name: string;
  email: string;
  picture: string;
  role: "ADMIN" | "SELLER" | "USER";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserData extends IUser, Document {}

const userSchema = new mongoose.Schema<UserData>(
  {
    _id: String, // overriding mongoose default ObjectId
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
      enum: ["ADMIN", "MINE", "USER"],
      default: "USER"
    }
  },
  {
    timestamps: true
  }
);

const User =
  mongoose.models.User<UserData> || mongoose.model("User", userSchema);
export default User;
