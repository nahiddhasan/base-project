"use server";
import { signIn } from "@/utils/auth";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { z } from "zod";
import { LoginSchema, RegisterSchema } from "./zodSchemas";

//register user
export const registerAction = async (
  values: z.infer<typeof RegisterSchema>
) => {
  const validatedRegisterValues = RegisterSchema.safeParse(values);
  if (!validatedRegisterValues.success) {
    return { error: "Invalid fields error!" };
  }
  const { name, email, password } = validatedRegisterValues.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const existingUser = await prisma?.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return { error: "User already exist with this email!" };
    }

    await prisma?.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
    });
    redirect("/auth/login");
  } catch (error) {
    console.log(error);
    return { error: "Register error!" };
  }
};

//login user
export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedLoginValues = LoginSchema.safeParse(values);

  if (!validatedLoginValues.success) {
    return { error: "Invalid fields error!" };
  }
  const { email, password } = validatedLoginValues.data;
  const existingUser = await prisma?.user.findUnique({
    where: {
      email,
    },
  });
  if (!existingUser || !existingUser.email) {
    return { error: "User does not Exist!" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }
    throw error;
  }
};
