import { FastifyInstance, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { JwtPayload } from "../types/user";

declare module "fastify" {
    interface FastifyRequest {
        user?: JwtPayload;
    }
}

export function setupAuth(app: FastifyInstance) {
    app.decorateRequest("user", undefined);

    app.addHook("onRequest", async (request, reply) => {
        const authHeader = request.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return;
        }

        const token = authHeader.slice(7);

        try {
            const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
            request.user = payload;
        } catch (err) {
            
        }
    });
}