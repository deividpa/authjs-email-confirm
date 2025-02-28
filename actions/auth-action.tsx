"use server";

import { signIn } from "@/auth";
import { loginSchema } from "@/lib/zod";
import { z } from "zod";

export const loginAction = async (data: z.infer<typeof loginSchema>) => {
  try {
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
  } catch (error) {
    console.error(error);
  }
}