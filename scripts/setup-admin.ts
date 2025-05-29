// Run this script to generate admin credentials
import { generatePasswordHash } from "../lib/auth-utils"

async function setupAdmin() {
  console.log("=== Admin Setup ===")

  // Replace with your desired admin password
  const adminPassword = "your_secure_admin_password_here"

  const passwordHash = await generatePasswordHash(adminPassword)

  console.log("\nAdd these to your .env.local file:")
  console.log(`ADMIN_USERNAME=admin`)
  console.log(`ADMIN_PASSWORD_HASH=${passwordHash}`)
  console.log(`ADMIN_EMAIL=admin@yourdomain.com`)

  console.log("\n=== Setup Complete ===")
}

setupAdmin().catch(console.error)
