const admin = require('firebase-admin')
require('dotenv').config()

const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT || '{}'
const serviceAccount = JSON.parse(serviceAccountStr)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: process.env.FIREBASE_PROJECT_ID,
})

const db = admin.firestore()

async function addAdmin() {
  try {
    await db.collection('admins').add({
      email: 'admin@alomranprecast.com',
      password: 'alomran2024',
      name: 'Admin User',
      role: 'admin',
      createdAt: new Date().toISOString()
    })

    console.log('✅ Admin created')
    process.exit(0)
  } catch (err) {
    console.error('❌', err.message)
    process.exit(1)
  }
}

addAdmin()
