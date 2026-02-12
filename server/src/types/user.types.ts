export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    hashed_password: string;
    created_at: number;
}