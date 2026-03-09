import { z } from "zod";

export const CreateUserSchema = z.object({
    username: z.string().min(3).max(50),
    password: z.string().min(6),
    name: z.string().min(2).max(50)
})

export const SigninSchema = z.object({
    username: z.string().min(3).max(50),
    password: z.string(),
})

export const CreateRoomSchema = z.object({
    name: z.string().min(3).max(50),
})
