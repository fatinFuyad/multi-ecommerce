import { dbConnect } from "@/lib/dbConnect";
import User, { IUser, UserDoc } from "@/models/User";
import bcrypt from "bcryptjs";
import NextAuth, {
  Account,
  User as AuthUser,
  Profile,
  Session,
  SessionStrategy,
  Theme
} from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    }),

    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string
    }),

    CredentialsProvider({
      id: "credentials",
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        identifier: {
          label: "Username or Email",
          type: "text",
          placeholder: "Enter your username or email"
        },
        password: { label: "Password", type: "password" }
      },

      async authorize(credentials: any, req): Promise<any> {
        try {
          await dbConnect();
          // You need to provide your own logic here that takes the credentials
          // submitted and returns either a object representing a user or value
          // that is false/null if the credentials are invalid.
          // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
          // You can also use the `req` object to obtain additional parameters
          // (i.e., the request IP address)
          const existingUser: UserDoc = await User.findOne({
            $or: [
              { username: credentials.identifier },
              { email: credentials.identifier }
            ]
          }).select("+password");
          console.log(existingUser);
          // Return null or throw error if no existingUser is associated with the credentials
          if (!existingUser) {
            throw new Error("No user is associated with the email or username");
          }
          // console.log("authorize-->", { user });
          if (!existingUser.isPasswordEnabled) {
            throw new Error(
              `You previously signed in with ${existingUser.provider}. You didn't setup password for credentials sign in`
            );
          }
          const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            existingUser.password as string
          );
          if (!isCorrectPassword) {
            throw new Error("Incorrect password. Please try again later.");
          }

          existingUser.provider = "credentials";
          existingUser.signinMethod = "credentials";
          existingUser.lastSignedin = new Date();

          await existingUser.save();
          // If credentials is correct and no error and we need to return the existingUser
          return existingUser;
        } catch (error: any) {
          throw new Error(error.message);
        }
      }
    })
  ],
  callbacks: {
    async signIn({
      user,
      account,
      profile
    }: {
      user: AuthUser | AdapterUser;
      account: Account | null;
      profile?: Profile | undefined;
    }) {
      try {
        // console.log("signIn callback -->", profile, user, account);
        // when using credentials profile is undefined but in OAuth profile is an object
        if (account?.provider === "credentials") {
          return user ? true : false;
        }

        // profile.name.replaceAll(' ','_') + '_'+ Math.random().toString(32).slice(-5)

        if (!user?.email) return false;
        // setup db connection
        await dbConnect();

        const existingUser: UserDoc | null = await User.findOne({
          email: user.email
        });

        if (existingUser) {
          existingUser.provider = account?.provider as string;
          existingUser.signinMethod = account?.type as string;
          existingUser.lastSignedin = new Date();
          await existingUser.save();
          return true;
        }

        await User.create({
          name: user.name as string,
          username: user.email.split("@")[0],
          email: user.email,
          image: user.image as string,
          provider: account?.provider as string,
          signinMethod: account?.type as string,
          lastSignedin: new Date(),
          role: "USER",
          isPasswordEnabled: false,
          isVerified: true,
          verificationCode: undefined,
          verificationCodeExpiredAt: undefined
        } satisfies IUser);

        return true;
      } catch (error) {
        throw error;
      }
    },
    async jwt({ token }: { token: JWT }) {
      // user is undefined in OAuth but not in credentials sign in, hence only the token is returned from this here and no additional user data with token

      // OAuth provides account, profile. credentials provide user
      // if no _id, it means sign in occured with OAuth

      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      await dbConnect();
      const user = await User.findOne<Promise<UserDoc | null>>({
        email: token.email
      });
      // .select("username email image name role");

      if (!user) {
        // no user means user is deleted from db
        session.user = null;
      } else {
        session.user = user; // as SessionUser;
      }
      // console.log("callback session ==>", { user, token });
      return session;
    },
    async redirect({ baseUrl }: { url: string; baseUrl: string }) {
      return baseUrl + "/dashboard";
    }
  },

  session: { strategy: "jwt" as SessionStrategy },
  secret: process.env.NEXTAUTH_SECRET,
  theme: {
    colorScheme: "auto", // "auto" | "dark" | "light"
    brandColor: "#11ffaa" // Hex color code
    // logo: "/images/feedback-logo.jpg", // Absolute URL to image
    // buttonText: "#afafaf" // Hex color code
  } as Theme,
  pages: {
    signIn: "/signin" // overriding the default redirection to "/api/auth/signin" for unaunthenticated user
  }

  // pages: {
  // default page redirections from nextauth
  // signIn: '/api/auth/signin',
  // signOut: '/api/auth/signout',
  // error: '/api/auth/error', // Error code passed in query string as ?error=
  // verifyRequest: '/api/auth/verify-request', // (used for check email message)
  // newUser: '/api/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  // }
};

export default NextAuth(authOptions);
