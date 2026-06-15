import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import * as admin from 'firebase-admin'

dotenv.config()

// Initialize Firebase
const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT || '{}'
const serviceAccount = JSON.parse(serviceAccountStr)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  projectId: process.env.FIREBASE_PROJECT_ID,
})

const db = admin.firestore()
const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
  origin: [
    process.env.FRONTEND_URL  || 'http://localhost:5173',
    process.env.DASHBOARD_URL || 'http://localhost:5174',
  ],
  credentials: true,
}))

app.use(express.json())

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: 'Firebase Firestore' })
})

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
  console.log(`✅ Using Firebase Firestore`)
  console.log(`✅ Health check: http://localhost:${PORT}/api/health`)
})
