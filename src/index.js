const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const bcrypt = require('bcryptjs')
require('dotenv').config()
const admin = require('firebase-admin')
const jwt = require('jsonwebtoken')

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

// ── Express App ──────────────────────────────────────────────────
const app = express()
const PORT = process.env.PORT || 5000

const allowedOrigins = [
  /^http:\/\/localhost:\d+$/,
  /^https?:\/\/.*\.vercel\.app$/,
  /^https?:\/\/.*\.opa-sa\.com$/,
  'https://opa-sa.com',
  'https://www.opa-sa.com',
  'https://admin.opa-sa.com',
  'https://alomran-factory.vercel.app',
  'https://alomran-factory-gk73.vercel.app',
]

if (process.env.FRONTEND_URL) {
  process.env.FRONTEND_URL.split(',').forEach(url => allowedOrigins.push(url.trim()))
}
if (process.env.DASHBOARD_URL) {
  process.env.DASHBOARD_URL.split(',').forEach(url => allowedOrigins.push(url.trim()))
}

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)

    const allowed = allowedOrigins.some(pattern => {
      if (typeof pattern === 'string') return pattern === origin
      if (pattern instanceof RegExp) return pattern.test(origin)
      return false
    })

    if (allowed) {
      callback(null, true)
    } else {
      console.warn('CORS blocked origin:', origin)
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}))
app.use(express.json())

// ── Rate Limiting ────────────────────────────────────────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
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

  // Try Firebase ID token (they are longer than JWTs)
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

  // Try JWT
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
  companyNameAr:    'مصنع العمران للمنتجات الأسمنتية',
  companyNameEn:    'Al Omran Precast Factory',
  taglineAr:        'نصنع الحاضر ونبني المستقبل',
  taglineEn:        'Excellence in Precast Concrete Solutions',
  contactEmail:     'info@alomranprecast.com',
  notificationEmail:'info@alomranprecast.com',
  phoneFactory:     '+966501216075',
  phoneHeadOffice:  '+966112201773',
  addressAr:        'المدينة الصناعية الثانية، مصنع العمران، الرياض، المملكة العربية السعودية',
  addressEn:        '2nd Industrial City, Al Omran Precast Factory, Riyadh, KSA',
  workingHours:     'Sat–Wed: 8 AM – 4 PM | Thu: 8 AM – 1 PM',
  websiteUrl:       'https://www.opf-sa.com',
  socialLinks: {
    linkedin:  'https://www.linkedin.com/company/al-omran-precast/',
    facebook:  'https://www.facebook.com/alomranprecast/',
    instagram: 'https://www.instagram.com/alomranprecast/',
    youtube:   'https://www.youtube.com/@AlOmranPrecast',
    twitter:   '',
  },
}

// ── Health Check ──────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: 'Firebase Firestore', timestamp: new Date().toISOString() })
})

// ══════════════════════════════════════════════════════════════════
// AUTH
// ══════════════════════════════════════════════════════════════════

app.post('/api/auth/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' })
    }

    const normalizedEmail = email.toLowerCase().trim()

    // 1. Try 'users' collection first (new system)
    const usersSnap = await db.collection('users')
      .where('email', '==', normalizedEmail)
      .get()

    if (!usersSnap.empty) {
      const doc = usersSnap.docs[0]
      const data = doc.data()

      if (data.active === false) {
        return res.status(401).json({ error: 'Account is disabled' })
      }

      let valid = false
      if (data.passwordHash) {
        valid = await bcrypt.compare(password, data.passwordHash)
      } else if (data.password) {
        // Plaintext fallback for migrated accounts
        valid = (password === data.password)
        if (valid) {
          // Upgrade to bcrypt on next login
          const hash = await bcrypt.hash(password, 12)
          await doc.ref.update({ passwordHash: hash, password: admin.firestore.FieldValue.delete() })
        }
      }

      if (!valid) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }

      await doc.ref.update({ lastLogin: new Date().toISOString() })

      const token = jwt.sign(
        { id: doc.id, uid: doc.id, email: data.email, role: data.role || 'admin' },
        process.env.JWT_SECRET || 'alomran_secret',
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      )

      return res.json({
        token,
        user: { id: doc.id, email: data.email, displayName: data.displayName || data.name || 'Admin', role: data.role || 'admin' },
      })
    }

    // 2. Fallback to 'admins' collection (legacy)
    const adminsSnap = await db.collection('admins')
      .where('email', '==', normalizedEmail)
      .where('password', '==', password)
      .get()

    if (!adminsSnap.empty) {
      const doc = adminsSnap.docs[0]
      const data = doc.data()

      const token = jwt.sign(
        { id: doc.id, uid: doc.id, email: data.email, role: data.role || 'admin' },
        process.env.JWT_SECRET || 'alomran_secret',
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      )

      return res.json({
        token,
        user: { id: doc.id, email: data.email, displayName: data.name || 'Admin', role: data.role || 'admin' },
      })
    }

    return res.status(401).json({ error: 'Invalid credentials' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Exchange Firebase ID token for a backend JWT (called after Firebase sign-in)
app.post('/api/auth/firebase-login', loginLimiter, async (req, res) => {
  try {
    const { idToken } = req.body
    if (!idToken) return res.status(400).json({ error: 'idToken required' })

    const decoded = await admin.auth().verifyIdToken(idToken)

    // Look up or create user in Firestore
    const userRef = db.collection('users').doc(decoded.uid)
    const userDoc = await userRef.get()

    let userData
    if (!userDoc.exists) {
      // Auto-provision Google / new users
      userData = {
        uid:         decoded.uid,
        email:       decoded.email ?? '',
        displayName: decoded.name ?? decoded.email ?? 'User',
        role:        'viewer',
        active:      true,
        createdAt:   new Date().toISOString(),
        lastLogin:   new Date().toISOString(),
      }
      await userRef.set(userData)
    } else {
      userData = userDoc.data()
      if (userData.active === false) {
        return res.status(403).json({ error: 'Account is disabled' })
      }
      await userRef.update({ lastLogin: new Date().toISOString() })
    }

    const token = jwt.sign(
      { id: decoded.uid, uid: decoded.uid, email: decoded.email, role: userData.role || 'viewer' },
      process.env.JWT_SECRET || 'alomran_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    res.json({
      token,
      user: {
        id:          decoded.uid,
        email:       decoded.email,
        displayName: userData.displayName ?? decoded.name,
        role:        userData.role || 'viewer',
      },
    })
  } catch (err) {
    res.status(401).json({ error: 'Invalid Firebase token' })
  }
})

app.get('/api/auth/me', protect, async (req, res) => {
  try {
    const doc = await db.collection('users').doc(req.user.id).get()
    if (!doc.exists) {
      return res.json({ id: req.user.id, email: req.user.email, role: req.user.role })
    }
    const data = doc.data()
    delete data.passwordHash
    delete data.password
    res.json({ id: doc.id, ...data })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ══════════════════════════════════════════════════════════════════
// USERS (admin only)
// ══════════════════════════════════════════════════════════════════

app.get('/api/users', protect, requireAdmin, async (req, res) => {
  try {
    const snap = await db.collection('users').orderBy('createdAt', 'desc').get()
    const users = snap.docs.map(doc => {
      const d = { id: doc.id, ...doc.data() }
      delete d.passwordHash
      delete d.password
      return d
    })
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/users', protect, requireAdmin, async (req, res) => {
  try {
    const { email, password, displayName, role = 'editor' } = req.body
    if (!email || !password || !displayName) {
      return res.status(400).json({ error: 'Email, password, and name are required' })
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' })
    }
    if (!['admin', 'editor', 'viewer'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const existing = await db.collection('users').where('email', '==', normalizedEmail).get()
    if (!existing.empty) {
      return res.status(400).json({ error: 'Email already in use' })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const docRef = await db.collection('users').add({
      email: normalizedEmail,
      displayName,
      role,
      passwordHash,
      active: true,
      createdAt: new Date().toISOString(),
      createdBy: req.user.email || req.user.id,
      lastLogin: null,
    })

    res.json({ id: docRef.id, email: normalizedEmail, displayName, role, active: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/users/:id', protect, requireAdmin, async (req, res) => {
  try {
    const doc = await db.collection('users').doc(req.params.id).get()
    if (!doc.exists) return res.status(404).json({ error: 'User not found' })
    const d = { id: doc.id, ...doc.data() }
    delete d.passwordHash
    delete d.password
    res.json(d)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/users/:id', protect, requireAdmin, async (req, res) => {
  try {
    const { displayName, role, active } = req.body
    const updates = {}
    if (displayName !== undefined) updates.displayName = displayName
    if (role !== undefined) {
      if (!['admin', 'editor', 'viewer'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' })
      }
      updates.role = role
    }
    if (active !== undefined) updates.active = Boolean(active)
    updates.updatedAt = new Date().toISOString()

    await db.collection('users').doc(req.params.id).update(updates)
    res.json({ id: req.params.id, ...updates })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/users/:id/password', protect, async (req, res) => {
  try {
    // Only admin or the user themselves can change password
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    const { newPassword } = req.body
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' })
    }
    const passwordHash = await bcrypt.hash(newPassword, 12)
    await db.collection('users').doc(req.params.id).update({ passwordHash, updatedAt: new Date().toISOString() })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/users/:id', protect, requireAdmin, async (req, res) => {
  try {
    if (req.user.id === req.params.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' })
    }
    await db.collection('users').doc(req.params.id).delete()
    res.json({ deleted: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ══════════════════════════════════════════════════════════════════
// COMPANY SETTINGS
// ══════════════════════════════════════════════════════════════════

app.get('/api/settings/company', async (req, res) => {
  try {
    const doc = await db.collection('settings').doc('company').get()
    if (!doc.exists) return res.json(DEFAULT_COMPANY)
    res.json({ ...DEFAULT_COMPANY, ...doc.data() })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/settings/company', protect, requireAdmin, async (req, res) => {
  try {
    const allowed = [
      'companyNameAr','companyNameEn','taglineAr','taglineEn',
      'contactEmail','notificationEmail',
      'phoneFactory','phoneHeadOffice',
      'addressAr','addressEn','workingHours','websiteUrl','socialLinks',
    ]
    const updates = {}
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k] })
    updates.updatedAt = new Date().toISOString()
    updates.updatedBy = req.user.email || req.user.id

    await db.collection('settings').doc('company').set(updates, { merge: true })
    res.json({ success: true, ...updates })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ══════════════════════════════════════════════════════════════════
// PRODUCTS
// ══════════════════════════════════════════════════════════════════

app.get('/api/products', async (req, res) => {
  try {
    const snapshot = await db.collection('products').get()
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    res.json(products)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/products', protect, async (req, res) => {
  try {
    const docRef = await db.collection('products').add({
      ...req.body,
      createdAt: new Date().toISOString(),
      active: true,
    })
    res.json({ id: docRef.id, ...req.body })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/products/:id', async (req, res) => {
  try {
    const doc = await db.collection('products').doc(req.params.id).get()
    if (!doc.exists) return res.status(404).json({ error: 'Not found' })
    res.json({ id: doc.id, ...doc.data() })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/products/:id', protect, async (req, res) => {
  try {
    await db.collection('products').doc(req.params.id).update({ ...req.body, updatedAt: new Date().toISOString() })
    res.json({ id: req.params.id, ...req.body })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/products/:id', protect, requireAdmin, async (req, res) => {
  try {
    await db.collection('products').doc(req.params.id).delete()
    res.json({ deleted: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ══════════════════════════════════════════════════════════════════
// INQUIRIES
// ══════════════════════════════════════════════════════════════════

app.get('/api/inquiries', protect, async (req, res) => {
  try {
    const snapshot = await db.collection('inquiries').orderBy('createdAt', 'desc').get()
    const inquiries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    res.json(inquiries)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/inquiries', async (req, res) => {
  try {
    const { name, email, message } = req.body
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' })
    }
    const docRef = await db.collection('inquiries').add({
      ...req.body,
      createdAt: new Date().toISOString(),
      status: 'new',
    })
    res.json({ id: docRef.id, ...req.body, status: 'new' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/inquiries/:id', protect, async (req, res) => {
  try {
    const doc = await db.collection('inquiries').doc(req.params.id).get()
    if (!doc.exists) return res.status(404).json({ error: 'Not found' })
    res.json({ id: doc.id, ...doc.data() })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/inquiries/:id', protect, async (req, res) => {
  try {
    await db.collection('inquiries').doc(req.params.id).update({
      ...req.body,
      updatedAt: new Date().toISOString(),
    })
    res.json({ id: req.params.id, ...req.body })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/inquiries/:id', protect, requireAdmin, async (req, res) => {
  try {
    await db.collection('inquiries').doc(req.params.id).delete()
    res.json({ deleted: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ══════════════════════════════════════════════════════════════════
// START
// ══════════════════════════════════════════════════════════════════

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
  console.log(`✅ Auth:      POST /api/auth/login`)
  console.log(`✅ Products:  GET  /api/products`)
  console.log(`✅ Inquiries: GET  /api/inquiries  (protected)`)
  console.log(`✅ Users:     GET  /api/users       (admin only)`)
  console.log(`✅ Settings:  GET  /api/settings/company`)
})
