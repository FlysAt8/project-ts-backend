export interface User {
    id: number;
    email: string;
    password_hash: string;
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
    is_verified: boolean;
    created_at: Date;
}

export interface JwtPayload {
    userId: number;
    email: string;
}