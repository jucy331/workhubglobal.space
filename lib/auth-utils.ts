import bcrypt from "bcryptjs"

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

export function generateSecureToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Helper function to generate password hash for setup
export async function generatePasswordHash(password: string) {
  const hash = await hashPassword(password)
  console.log(`Password hash for "${password}":`, hash)
  return hash
}
