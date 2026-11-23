import { z } from "zod";

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
});

export const confirmSchema = z.object({
    email: z.string().email(),
    code: z.string(),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});