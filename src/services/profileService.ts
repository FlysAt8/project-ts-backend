import bcrypt from "bcrypt";
import { query } from "../db/pool";
import { User } from "../types/user";
import { ServiceError } from "./authService";

export async function getUserById(userId: number) {
    const [user] = await query<User>(
        "SELECT id, email, first_name, last_name, phone, is_verified, created_at FROM users WHERE id = $1",
        [userId]
    );

    if (!user) {
        throw new ServiceError("Пользователь не найден", 404);
    }

    return user;
}

export async function updateProfile(
    userId: number,
    data: { firstName?: string; lastName?: string; phone?: string; email?: string }
) {
    if (data.email) {
        const existing = await query(
            "SELECT id FROM users WHERE email = $1 AND id != $2",
            [data.email, userId]
        );
        if (existing.length > 0) {
            throw new ServiceError("Этот email уже занят", 409);
        }
    }

    await query(
        `UPDATE users
         SET first_name = COALESCE($1, first_name),
             last_name  = COALESCE($2, last_name),
             phone      = COALESCE($3, phone),
             email      = COALESCE($4, email)
         WHERE id = $5`,
        [data.firstName ?? null, data.lastName ?? null, data.phone ?? null, data.email ?? null, userId]
    );

    return getUserById(userId);
}

export async function changePassword(userId: number, oldPassword: string, newPassword: string) {
    const [user] = await query<{ password_hash: string }>(
        "SELECT password_hash FROM users WHERE id = $1",
        [userId]
    );

    if (!user) {
        throw new ServiceError("Пользователь не найден", 404);
    }

    const match = await bcrypt.compare(oldPassword, user.password_hash);
    if (!match) {
        throw new ServiceError("Неверный текущий пароль", 401);
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await query("UPDATE users SET password_hash = $1 WHERE id = $2", [newHash, userId]);
}