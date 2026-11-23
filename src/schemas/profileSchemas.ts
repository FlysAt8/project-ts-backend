import { z } from "zod";

export const updateProfileSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
});

export const changePasswordSchema = z.object({
    oldPassword: z.string(),
    newPassword: z.string().min(6),
});