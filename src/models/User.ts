import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
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
      enum: ["ADMIN", "SELLER", "USER"],
      default: "USER"
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);
export default User;
