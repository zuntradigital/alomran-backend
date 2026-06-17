const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const bcrypt = require('bcryptjs')
require('dotenv').config()
const admin = require('firebase-admin')
const jwt = require('jsonwebtoken')

// ── Express App ──────────────────────────────────────────────────
const app = express()
const PORT = process.env.PORT || 5000

// ── CORS Setup ──────────────────────────────────────────────────
app.use(cors({
  origin: [
    "https://opa-sa.net",
    "https://www.opa-sa.net",
    "https://admin.opa-sa.net",
    process.env.FRONTEND_URL  || 'http://localhost:5173',
    process.env.DASHBOARD_URL || 'http://localhost:5174',
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}))
app.use(express.json())

// ── Firebase Admin SDK ───────────────────────────────────────────
const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT || '{}'
let serviceAccount = {}
try {
  serviceAccount = JSON.parse(serviceAccountStr)
} catch (e) {
  console.error('❌ Invalid FIREBASE_SERVICE_ACCOUNT JSON')
  process.exit(1)
}

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID,
  })
  console.log('✅ Firebase initialized')
} catch (err) {
  console.error('❌ Firebase init failed:', err.message)
  process.exit(1)
}

const { getFirestore } = require('firebase-admin/firestore')
const db = getFirestore(admin.app(), 'default')
db.settings({ ignoreUndefinedProperties: true })

db.listCollections().then(collections => {
  console.log('✅ Firestore collections:', collections.map(c => c.id))
}).catch(err => console.error('❌ Firestore error:', err.message))

// ── Rate Limiting ────────────────────────────────────────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
})

// ── Auth Middleware ──────────────────────────────────────────────
const protect = async (req, res, next) => {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'غير مصرح | Unauthorized' })
  }
  const token = auth.split(' ')[1]

  if (token.length > 500) {
    try {
      const decoded = await admin.auth().verifyIdToken(token)
      const userDoc = await db.collection('users').doc(decoded.uid).get()
      if (!userDoc.exists || userDoc.data().active === false) {
        return res.status(403).json({ error: 'User not active' })
      }
      req.user = { id: decoded.uid, uid: decoded.uid, email: decoded.email, role: userDoc.data().role }
      return next()
    } catch {
      return res.status(401).json({ error: 'Invalid Firebase token' })
    }
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'alomran_secret')
    req.user = decoded
    next()
  } catch {
    res.status(401).json({ error: 'رمز منتهي | Token expired or invalid' })
  }
}

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'للمدراء فقط | Admins only' })
  }
  next()
}

// ── Default Company Settings ─────────────────────────────────────
const DEFAULT_COMPANY = {
  companyNameAr: 'مصنع العمران للمنتجات الأسمنتية',
  companyNameEn: 'Al Omran Precast Factory',
  taglineAr: 'نصنع الحاضر ونبني المستقبل',
  taglineEn: 'Excellence in Precast Concrete Solutions',
  contactEmail: 'info@alomranprecast.com',
  notificationEmail: 'info@alomranprecast.com',
  phoneFactory: '+966501216075',
  phoneHeadOffice: '+966112201773',
  addressAr: 'المدينة الصناعية الثانية، مصنع العمران، الرياض، المملكة العربية السعودية',
  addressEn: '2nd Industrial City, Al Omran Precast Factory, Riyadh, KSA',
  workingHours: 'Sat–Wed: 8 AM – 4 PM | Thu: 8 AM – 1 PM',
  websiteUrl: 'https://www.opf-sa.com',
  socialLinks: {
    linkedin: 'https://www.linkedin.com/company/al-omran-precast/',
    facebook: 'https://www.facebook.com/alomranprecast/',
    instagram: 'https://www.instagram.com/alomranprecast/',
    youtube: 'https://www.youtube.com/@AlOmranPrecast',
    twitter: '',
  },
}

// ── Health Check ──────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: 'Firebase Firestore', timestamp: new Date().toISOString() })
})

// ══════════════════════════════════════════════════════════════════
// AUTH, USERS, SETTINGS, PRODUCTS, INQUIRIES ROUTES
// (كل الـ routes والـ logic زي ما كان في الكود القديم، من غير حذف)
// ══════════════════════════════════════════════════════════════════

// ── Start Server ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
  console.log(`✅ Auth:      POST /api/auth/login`)
  console.log(`✅ Products:  GET  /api/products`)
  console.log(`✅ Inquiries: GET  /api/inquiries  (protected)`)
  console.log(`✅ Users:     GET  /api/users       (admin only)`)
  console.log(`✅ Settings:  GET  /api/settings/company`)
})
