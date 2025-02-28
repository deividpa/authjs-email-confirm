"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { z } from "zod";
import { loginSchema, registerSchema } from "@/lib/zod";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const loginAction = async (values: z.infer<typeof loginSchema>) => {
  try {
    await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    return { success: true };

  } catch (error) {
    if(error instanceof AuthError) {
      return { error: error.cause?.err?.message };
    }
    return { error: "Error 500" };
  }
}

export const registerAction = async (values: z.infer<typeof registerSchema>) => {
  try {
    
    const { data, success } = registerSchema.safeParse(values);

    if(!success) {
      return { error: "Invalid data" };
    }

    // Check if the user already exists
    const user = await prisma.user.findUnique({
      where: {
        email: values.email,
      }
    });

    if(user) {
      return { error: "User already exists" };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(values.password, 10);

    // Create the user
    await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
      }
    });

    // Sign in the user
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    return { success: true };

  } catch (error) {
    if(error instanceof AuthError) {
      return { error: error.cause?.err?.message };
    }
    return { error: "Error 500" };
  }
}