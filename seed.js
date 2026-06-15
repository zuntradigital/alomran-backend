const admin = require('firebase-admin')
require('dotenv').config()

const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT || '{}'
const serviceAccount = JSON.parse(serviceAccountStr)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: process.env.FIREBASE_PROJECT_ID,
})

const db = admin.firestore()

async function seed() {
  try {
    await db.collection('products').add({ name: 'Bench BE-01', code: 'BE-01', price: 500 })
    await db.collection('products').add({ name: 'Table TA-01', code: 'TA-01', price: 750 })
    console.log('✅ Products seeded')
  } catch (err) {
    console.error('❌ Products:', err.message)
    throw err
  }
}

async function createAdmin() {
  try {
    await db.collection('admins').add({
      email: 'admin@alomranprecast.com',
      password: 'alomran2024',
      name: 'Admin User',
      role: 'admin',
      createdAt: new Date().toISOString()
    })
    console.log('✅ Admin user created')
  } catch (err) {
    console.error('❌ Admin:', err.message)
    throw err
  }
}

async function run() {
  try {
    await seed()
    await createAdmin()
    console.log('✅ Database seeded')
    process.exit(0)
  } catch (err) {
    process.exit(1)
  }
}

run()
