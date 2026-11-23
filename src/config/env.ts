import dotenv from "dotenv";

dotenv.config();

function required(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Не задана переменная окружения: ${name}`);
    }
    return value;
}

export const env = {
    PORT: Number(process.env.PORT ?? 3000),
    DATABASE_URL: required("DATABASE_URL"),
    JWT_SECRET: required("JWT_SECRET"),
};