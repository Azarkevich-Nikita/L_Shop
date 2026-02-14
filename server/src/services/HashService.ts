import bcrypt from "bcrypt";

class HashService {
    private readonly saltRounds: number = 10;

    async hashPassword(password: string): Promise<string> {
        const hashedPassword = await bcrypt.hash(password, this.saltRounds);
        return hashedPassword;
    }

    async comparePassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }
}

export default new HashService();
