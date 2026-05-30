import bcrypt from "bcrypt";

class HashService {
    private readonly saltRounds: number = 10;

    /**
     * Hashes a raw password with bcrypt.
     *
     * @param password - Raw user password.
     * @returns Bcrypt password hash.
     */
    async hashPassword(password: string): Promise<string> {
        const hashedPassword: string = await bcrypt.hash(password, this.saltRounds);
        return hashedPassword;
    }

    /**
     * Compares a raw password with a stored bcrypt hash.
     *
     * @param password - Raw user password.
     * @param hash - Stored bcrypt hash.
     * @returns True when the password matches the hash.
     */
    async comparePassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }
}

export default new HashService();
