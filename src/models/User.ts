import {
  Types,
  Schema,
  models,
  model,
  HydratedDocument,
  InferSchemaType
} from "mongoose";

export type Roles = "ADMIN" | "SELLER" | "USER"; // "admin" | "moderator";

const userSchema = new Schema(
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
    isPasswordEnabled: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    verificationCodeExpiredAt: { type: Date },
    signinMethod: {
      type: String,
      required: true,
      enum: ["google", "github", "credentials"]
    },
    lastSignin: { type: Date, default: Date.now },
    image: String,
    role: {
      type: String,
      enum: ["ADMIN", "SELLER", "USER"] satisfies Roles[],
      default: "USER"
    },

    stores: [
      {
        type: Schema.Types.ObjectId,
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

export type IUser = InferSchemaType<typeof userSchema> & {
  _id: Types.ObjectId;
};
export type UserDoc = HydratedDocument<IUser>;

const User = models.User<IUser> || model<IUser>("User", userSchema);

export default User;

//
// Warning: Only plain objects can be passed to Client Components from Server Components. Objects with toJSON methods are not supported. Convert it manually to a simple value before passing it to props.
//
// export function serialize<T>(data: T): T {
// 1. const data = JSON.parse(JSON.stringify(data));
// 2. const data = data.toObject();
// 3. const data = data.map((items)=> items.toObject()); // if data is an arr of docs
//   return data
// }

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
  field: [{type:Types.ObjectId, ref:"Model"}] --> field: [ "ObjectId(a49d)", ... ]
  field: [{product:{_id:Types.ObjecId }, quantity: Number }]
  ---> field: [ { product: { ...productdata}, quantity: 102 }, ... ]
*/
