import Fastify from "fastify";
import cors from "@fastify/cors";
import { authRoutes } from "./routes/auth";
import { profileRoutes } from "./routes/profile";
import { setupAuth } from "./plugins/auth";
import { initDb } from "./db/init";
import { env } from "./config/env";

const app = Fastify({ logger: true });

app.register(cors, {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
});

setupAuth(app);

app.register(authRoutes);
app.register(profileRoutes);

app.get("/", async () => {
    return { message: "ProjectTS backend is running" };
});

const start = async () => {
    try {
        await initDb();
        await app.listen({ port: env.PORT, host: "0.0.0.0" });
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();