import { FastifyInstance } from "fastify";
import { registerSchema, confirmSchema, loginSchema } from "../schemas/authSchemas";
import { registerUser, confirmEmail, loginUser, ServiceError } from "../services/authService";

export async function authRoutes(app: FastifyInstance) {
    
    app.post("/api/auth/register", async (request, reply) => {
        const parsed = registerSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.status(400).send({ error: "Неверные данные", details: parsed.error.issues });
        }

        try {
            const result = await registerUser(parsed.data);
            return reply.status(201).send({ message: "Пользователь создан. Подтвердите почту.", ...result });
        } catch (err) {
            if (err instanceof ServiceError) {
                return reply.status(err.statusCode).send({ error: err.message });
            }
            throw err;
        }
    });

    app.post("/api/auth/confirm", async (request, reply) => {
        const parsed = confirmSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.status(400).send({ error: "Неверные данные" });
        }

        try {
            await confirmEmail(parsed.data.email, parsed.data.code);
            return reply.send({ message: "Почта подтверждена" });
        } catch (err) {
            if (err instanceof ServiceError) {
                return reply.status(err.statusCode).send({ error: err.message });
            }
            throw err;
        }
    });

    app.post("/api/auth/login", async (request, reply) => {
        const parsed = loginSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.status(400).send({ error: "Неверные данные" });
        }

        try {
            const result = await loginUser(parsed.data.email, parsed.data.password);
            return reply.send(result);
        } catch (err) {
            if (err instanceof ServiceError) {
                return reply.status(err.statusCode).send({ error: err.message });
            }
            throw err;
        }
    });
}