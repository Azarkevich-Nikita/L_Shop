/**
 * Generates a six-digit numeric code for password reset flows.
 *
 * @returns Six-digit code as a string.
 */
export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
