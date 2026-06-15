/**
 * One-time script to initialize settings/company in Firestore.
 * Safe to re-run — uses merge: true so it won't overwrite manual edits.
 * Run: node backend/init-settings.js
 */
const admin = require('firebase-admin')
require('dotenv').config()

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}')
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })

const { getFirestore } = require('firebase-admin/firestore')
const db = getFirestore(admin.app(), 'default')
db.settings({ ignoreUndefinedProperties: true })

const defaults = {
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
  updatedAt: new Date().toISOString(),
}

async function initSettings() {
  try {
    await db.collection('settings').doc('company').set(defaults, { merge: true })
    console.log('✅ settings/company initialized in Firestore')
    console.log('   Fields set:', Object.keys(defaults).join(', '))
    process.exit(0)
  } catch (err) {
    console.error('❌', err.message)
    process.exit(1)
  }
}

initSettings()
