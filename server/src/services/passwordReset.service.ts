type PasswordResetRecord = {
    email: string;
    code: string;
    createdAt: number;
    expiresAt: number;
};

class PasswordResetService {
    // In-memory store вместо JSON-файла
    private records: Map<string, PasswordResetRecord> = new Map();

    private cleanupExpired() {
        const now = Date.now();
        for (const [email, record] of this.records.entries()) {
            if (record.expiresAt < now) {
                this.records.delete(email);
            }
        }
    }

    async create(email: string, ttlMs: number = 5 * 60 * 1000): Promise<string> {
        this.cleanupExpired();
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        this.records.set(email, {
            email,
            code,
            createdAt: Date.now(),
            expiresAt: Date.now() + ttlMs,
        });
        return code;
    }

    async verify(email: string, code: string): Promise<boolean> {
        this.cleanupExpired();
        const record = this.records.get(email);
        if (!record) {
            return false;
        }
        if (record.expiresAt < Date.now()) {
            await this.consume(email);
            return false;
        }
        return record.code === code;
    }

    async consume(email: string): Promise<void> {
        this.records.delete(email);
    }
}

export default new PasswordResetService();

