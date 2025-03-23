import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { config } from "@/src/lib/config";

// NextAuth configuration
export const { handlers, signIn, signOut, auth } = NextAuth({
  // Providers are defined here
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "Enter your username",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },

      // The authorize method is used to check credentials
      async authorize(credentials) {
        try {
          // Send the credentials to the backend
          const response = await fetch(
            `${config.HTTP_BACKEND_URL}/user/signin`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(credentials),
              credentials: "include",
            }
          );

          // If the response is not ok, throw an error
          if (!response.ok) {
            throw new Error("Invalid credentials");
          }

          // Return the user object
          const { user } = await response.json();

          return user;
        } catch (error) {
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user.id = user.id;
        token.user.username = user.username;
        token.user.email = user.email;
        token.user.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.user.id as string;
      session.user.username = token.user.username;
      session.user.email = token.user.email as string;
      session.user.accessToken = token.user.accessToken;

      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  pages: {
    signIn: "/signin",
  },
  secret: config.AUTH_SECRET,
});
