import { z } from "zod";

export const loginSchema = z.object({
  regNo: z.string().trim().min(2, "Registration number is required"),
  password: z.string().min(1, "Password is required")
});
