import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { query } from "../db/pool";
import { env } from "../config/env";
import { User, JwtPayload } from "../types/user";

export async function registerUser(data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
}): Promise<{ userId: number }> {
    const existing = await query("SELECT id FROM users WHERE email = $1", [data.email]);
    if (existing.length > 0) {
        throw new ServiceError("Пользователь уже существует", 409);
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const [user] = await query<{ id: number }>(
        `INSERT INTO users (email, password_hash, first_name, last_name, phone)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [data.email, passwordHash, data.firstName ?? null, data.lastName ?? null, data.phone ?? null]
    );

    return { userId: user.id };
}

export async function confirmEmail(email: string, code: string): Promise<void> {
    if (code !== "000000") {
        throw new ServiceError("Неверный код подтверждения", 400);
    }

    const result = await query(
        "UPDATE users SET is_verified = TRUE WHERE email = $1 RETURNING id",
        [email]
    );

    if (result.length === 0) {
        throw new ServiceError("Пользователь не найден", 404);
    }
}

export async function loginUser(email: string, password: string): Promise<{ token: string; userId: number; email: string }> {
    const [user] = await query<User>(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );

    if (!user) {
        throw new ServiceError("Неверный email или пароль", 401);
    }

    if (!user.is_verified) {
        throw new ServiceError("Почта не подтверждена", 403);
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
        throw new ServiceError("Неверный email или пароль", 401);
    }

    const payload: JwtPayload = { userId: user.id, email: user.email };
    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });

    return { token, userId: user.id, email: user.email };
}

export class ServiceError extends Error {
    constructor(message: string, public statusCode: number) {
        super(message);
    }
}