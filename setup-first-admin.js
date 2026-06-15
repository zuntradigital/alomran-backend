/**
 * One-time script to create the first admin user.
 * Run: node backend/setup-first-admin.js <email> <password> [displayName]
 * Example: node backend/setup-first-admin.js admin@client.com TempPass123 "Ahmed Al-Omran"
 */
const admin = require('firebase-admin')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}')

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
const { getFirestore } = require('firebase-admin/firestore')
const db = getFirestore(admin.app(), 'default')
db.settings({ ignoreUndefinedProperties: true })

async function createFirstAdmin() {
  const email       = process.argv[2]
  const password    = process.argv[3]
  const displayName = process.argv[4] || 'Administrator'

  if (!email || !password) {
    console.error('Usage: node setup-first-admin.js <email> <password> [displayName]')
    console.error('Example: node setup-first-admin.js admin@company.com TempPass123 "Ahmed Al-Omran"')
    process.exit(1)
  }

  if (password.length < 8) {
    console.error('❌ Password must be at least 8 characters')
    process.exit(1)
  }

  const normalizedEmail = email.toLowerCase().trim()

  try {
    // Check if user already exists
    const existing = await db.collection('users').where('email', '==', normalizedEmail).get()
    if (!existing.empty) {
      console.error(`❌ A user with email ${normalizedEmail} already exists`)
      process.exit(1)
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const docRef = await db.collection('users').add({
      email: normalizedEmail,
      displayName,
      role: 'admin',
      passwordHash,
      active: true,
      createdAt: new Date().toISOString(),
      createdBy: 'setup-script',
      lastLogin: null,
      isFirstAdmin: true,
    })

    console.log('')
    console.log('✅ First admin created successfully!')
    console.log('────────────────────────────────────────')
    console.log(`   Email:     ${normalizedEmail}`)
    console.log(`   Password:  ${password}`)
    console.log(`   Name:      ${displayName}`)
    console.log(`   Role:      admin`)
    console.log(`   Doc ID:    ${docRef.id}`)
    console.log('────────────────────────────────────────')
    console.log('⚠️  Change this password immediately after first login!')
    console.log('')
    process.exit(0)
  } catch (err) {
    console.error('❌ Error:', err.message)
    process.exit(1)
  }
}

createFirstAdmin()
