import { FastifyInstance } from "fastify";
import { updateProfileSchema, changePasswordSchema } from "../schemas/profileSchemas";
import { getUserById, updateProfile, changePassword } from "../services/profileService";
import { ServiceError } from "../services/authService";

export async function profileRoutes(app: FastifyInstance) {
    
    const requireAuth = async (request: any, reply: any) => {
        if (!request.user) {
            return reply.status(401).send({ error: "Требуется авторизация" });
        }
    };

    app.get("/api/profile", { preHandler: requireAuth }, async (request: any, reply) => {
        try {
            const user = await getUserById(request.user.userId);
            return reply.send(user);
        } catch (err) {
            if (err instanceof ServiceError) {
                return reply.status(err.statusCode).send({ error: err.message });
            }
            throw err;
        }
    });

    app.patch("/api/profile", { preHandler: requireAuth }, async (request: any, reply) => {
        const parsed = updateProfileSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.status(400).send({ error: "Неверные данные", details: parsed.error.issues });
        }

        try {
            const user = await updateProfile(request.user.userId, parsed.data);
            return reply.send(user);
        } catch (err) {
            if (err instanceof ServiceError) {
                return reply.status(err.statusCode).send({ error: err.message });
            }
            throw err;
        }
    });

    app.post("/api/profile/change-password", { preHandler: requireAuth }, async (request: any, reply) => {
        const parsed = changePasswordSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.status(400).send({ error: "Неверные данные" });
        }

        try {
            await changePassword(request.user.userId, parsed.data.oldPassword, parsed.data.newPassword);
            return reply.send({ message: "Пароль изменён" });
        } catch (err) {
            if (err instanceof ServiceError) {
                return reply.status(err.statusCode).send({ error: err.message });
            }
            throw err;
        }
    });
}