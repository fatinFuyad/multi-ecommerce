import { dbConnect } from "@/lib/dbConnect";
import { ApiResponse } from "@/lib/types";
import UserModel, { IUser, UserData } from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    // check db connection
    await dbConnect();

    // 1) eheck if username already exists then success: false
    const { name, username, email, password } = await request.json();
    const existingUserByUsername = await UserModel.findOne({
      username
    });

    if (existingUserByUsername)
      throw new Error("Sorry, the username is already taken.");

    // 2) check if email already exists in db then success: false
    const existingUserByEmail = await UserModel.findOne({ email });

    // 3) check if user exists
    if (existingUserByEmail)
      throw new Error("An user with this email already exists!");

    // 5) check if user is signing up for the first time

    const hashedPassword = await bcrypt.hash(password, 10); // hash salt is 10

    const newUser: UserData = await UserModel.create({
      name,
      username,
      email,
      password: hashedPassword,
      isPasswordEnabled: true,
      provider: "credentials",
      signinMethod: "credentials",
      lastSignedin: new Date(),
      isVerified: true, // making all users to be verfied without verify code ⚠️⚠️
      verificationCode: undefined,
      verificationCodeExpiredAt: undefined
    } satisfies IUser);
    console.log(newUser);

    newUser.password = undefined;

    // Ensure we return a `Response` from a route handler
    return Response.json(
      {
        // user: newUser,
        user: newUser,
        status: 201,
        success: true,
        message: "You have successfully signed up"
      } satisfies ApiResponse<{ user: UserData }>,
      { status: 201 }
    );
  } catch (error) {
    console.error("Error sign up user:", error);
    if (error instanceof Error) {
      return Response.json(
        {
          success: false,
          message: error.message
        },
        { status: 400 }
      );
    }
    return Response.json(
      {
        user: null,
        status: 500,
        success: false,
        message: "AN UNEXPECTED ERROR OCCURED WHILE SIGNING UP USER!"
      } satisfies ApiResponse<{ user: null }>,
      { status: 500 }
    );
  }
}
