import { z } from "zod";

//login schema
export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email Required!",
  }),
  password: z.string().min(1, {
    message: "Password is required!",
  }),
});

//register schema
export const RegisterSchema = z.object({
  name: z.string().min(1, {
    message: "Name is Required!",
  }),
  email: z.string().email({
    message: "Email is Required!",
  }),
  password: z.string().min(6, {
    message: "Minumum 6 characters required!",
  }),
});
