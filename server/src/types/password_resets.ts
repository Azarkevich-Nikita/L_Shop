export interface PasswordReset {
    email: string;
    code: string;
    expiresAt: number;
}