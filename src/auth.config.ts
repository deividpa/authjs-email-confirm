import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials"
import { loginSchema } from "./lib/zod";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { sendVerificationEmail } from "./lib/mail";

const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      authorize: async (credentials) => {
        
        const { data, success } = loginSchema.safeParse(credentials);

        if (!success) {
          throw new Error("Invalid credentials");
        }

        // Check if the email exists in the database
        const user = await prisma.user.findUnique({
          where: {
            email: data.email
          },
        });

        if (!user || !user.password) {
          throw new Error("No user found with this email");
        }

        // Check if the password is correct
        const isValid = await bcrypt.compare(data.password, user.password);

        if (!isValid) {
          throw new Error("Incorrect password");
        }

        // Email Verification
        if (!user.emailVerified) {

          const verifyEmailToken = await prisma.verificationToken.findFirst({
            where: {
              identifier: user.email,
            },
          });

          // Delete the token if it exists
          if (verifyEmailToken?.identifier) {
            await prisma.verificationToken.delete({
              where: {
                identifier: user.email,
              },
            });
          }

          const token = nanoid();

          // Create a new token
          await prisma.verificationToken.create({
            data: {
              identifier: user.email,
              token,
              expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
            },
          });

          // Send verification email
          await sendVerificationEmail(user.email, token);

          // Show an error message if the email is not verified
          throw new Error("Email not verified");

        }

        return user;
      },
    }),
  ],
};

export default authConfig;