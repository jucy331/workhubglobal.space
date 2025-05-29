const bcrypt = require("bcryptjs")

async function generateAdminCredentials() {
  // Replace this with your desired admin password
  const adminPassword = "YourSecureAdminPassword123!"

  console.log("=== Generating Admin Credentials ===\n")

  try {
    // Generate password hash
    const passwordHash = await bcrypt.hash(adminPassword, 12)

    console.log("Your admin credentials:")
    console.log("Username: admin (or your preferred username)")
    console.log("Password:", adminPassword)
    console.log("Password Hash:", passwordHash)

    console.log("\n=== Environment Variables ===")
    console.log("Add these values to your Vercel environment variables:")
    console.log(`ADMIN_USERNAME=admin`)
    console.log(`ADMIN_PASSWORD_HASH=${passwordHash}`)
    console.log(`ADMIN_EMAIL=admin@yourdomain.com`)

    console.log("\n=== Security Note ===")
    console.log("⚠️  Store the password securely - the hash will be used in production")
    console.log("✅ The password hash is safe to store in environment variables")
  } catch (error) {
    console.error("Error generating credentials:", error)
  }
}

generateAdminCredentials()
