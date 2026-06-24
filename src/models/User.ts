import mongoose, { Document } from "mongoose";

export type Roles = "ADMIN" | "SELLER" | "USER"; // "admin" | "moderator";

export interface IUser {
  _id?: mongoose.Types.ObjectId;
  name: string;
  username: string;
  email: string;
  isVerified: boolean;
  verificationCode?: string;
  verificationCodeExpiredAt?: Date;
  image?: string;
  role?: Roles;
  password?: string;
  isPasswordEnabled: boolean;
  provider: string;
  signinMethod: string;
  lastSignedin: Date;
  stores?: mongoose.Types.ObjectId[];
  address?: string;
  phone?: string;
  gender?: "MALE" | "FEMALE" | "OTHER" | "UNKOWN";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserData extends Omit<IUser, "_id">, Document {}

const userSchema = new mongoose.Schema<UserData>(
  {
    name: {
      type: String,
      required: [true, "User should provider user's name"]
    },
    email: {
      type: String,
      required: [true, "User should provide a email"],
      unique: true
    },
    username: {
      type: String,
      unique: true,
      required: [true, "Username is required"]
    },
    password: {
      type: String,
      select: false
      // required: [true, "Password is required"], // next-auth encourages passwordless
    },
    isPasswordEnabled: { type: Boolean, required: true, default: false },
    isVerified: { type: Boolean, required: true, default: false },
    verificationCode: { type: String },
    verificationCodeExpiredAt: { type: Date },
    provider: { type: String, required: true },
    signinMethod: { type: String, required: true },
    lastSignedin: { type: Date },
    image: String,
    role: {
      type: String,
      enum: ["ADMIN", "SELLER", "USER"] satisfies Roles[],
      default: "USER"
    },

    stores: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Store"
      }
    ],
    address: String,
    phone: String,
    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER", "UNKOWN"],
      default: "UNKOWN"
    }
  },
  {
    timestamps: true
  }
);

const User =
  mongoose.models.User<UserData> || mongoose.model("User", userSchema);

export default User;

//////////
// populate works with specifying path only if the path includes an array of objectId like: [ "ObjectId(393ad)" ] or just field: ObjectId(49bc4)

// for nested object inside path like :[{store:{ _id:ObjectId(ad939) }}]; use the field name along with path like: polulate({path:"path.field"})

// multiple fields like: [{product:{ _id:ObjectId(dk393)}, quantity:5 }}]
// populate({path: "path.product"}) => [ {product:{...productData}, quantity:5 }]

/*
* specifying an object with for type and validation doesn't make the field to be object
example:
 field:{ type:String, required:[true, 'Required' ]} --> field: string value

* specifying an object and for each it's field required additional object for specifying type and validation
example:
 field: {
  name: { type:String, ...},
  score: { type:Number, ...}
 }

* for arrays
 example:
  field: [{type:String, required:true}] --> field: [ 'string value', ... ]
  field: [{type:mongoose.Types.ObjectId, ref:"Model"}] --> field: [ "ObjectId(a49d)", ... ]
  field: [{product:{_id:mongoose.Types.ObjecId }, quantity: Number }]
  ---> field: [ { product: { ...productdata}, quantity: 102 }, ... ]
*/
