// Lightweight email service for password reset codes
// Uses nodemailer under the hood and SMTP settings from environment variables.

// @ts-ignore – nodemailer has its own CJS/Esm typings, we keep it simple here
import nodemailer from "nodemailer";

// Avoid bringing in full @types/node – declare minimal process type locally
declare const process: any;

class EmailService {
    private getConfig() {
        const env = process?.env ?? {};

        const host = env.SMTP_HOST as string | undefined;
        const portRaw = env.SMTP_PORT as string | undefined;
        const user = env.SMTP_USER as string | undefined;
        const pass = env.SMTP_PASS as string | undefined;
        const from = (env.SMTP_FROM as string | undefined) || user;
        const secure = env.SMTP_SECURE === "true";

        if (!host || !portRaw || !from) {
            return null;
        }

        const port = Number(portRaw) || 587;

        return {
            host,
            port,
            secure,
            auth: user && pass ? { user, pass } : undefined,
            from,
        };
    }

    async sendPasswordResetEmail(to: string, code: string): Promise<void> {
        const config = this.getConfig();

        // If SMTP is not configured – fall back to console so dev не ломается
        if (!config) {
            console.warn("[email] SMTP env vars not set, fallback to console output");
            console.info(`[password-reset] ${to}: ${code}`);
            return;
        }

        const transporter = nodemailer.createTransport({
            host: config.host,
            port: config.port,
            secure: config.secure,
            auth: config.auth,
        });

        await transporter.sendMail({
            from: config.from,
            to,
            subject: "Код для восстановления пароля DermoLand",
            text: `Ваш код для восстановления пароля: ${code}`,
        });
    }
}

export default new EmailService();

