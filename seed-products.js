const admin = require('firebase-admin')
require('dotenv').config()

const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT || '{}'
let serviceAccount = {}
try {
  serviceAccount = JSON.parse(serviceAccountStr)
} catch (e) {
  console.error('❌ Invalid FIREBASE_SERVICE_ACCOUNT JSON')
  process.exit(1)
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: process.env.FIREBASE_PROJECT_ID,
})

const { getFirestore } = require('firebase-admin/firestore')
const db = getFirestore(admin.app(), 'default')
db.settings({ ignoreUndefinedProperties: true })

const products = [
  // ── Benches (BE) ───────────────────────────────────────────────
  { code:'BE-01',  nameAr:'مقعد BE-01',  nameEn:'Bench BE-01',  category:'BE', categoryAr:'مقاعد', categoryEn:'Benches', dimensions:'L 200 W 50 H 50', image:'/products/BE-01.png' },
  { code:'BE-02',  nameAr:'مقعد BE-02',  nameEn:'Bench BE-02',  category:'BE', categoryAr:'مقاعد', categoryEn:'Benches', dimensions:'L 200 W 50 H 50', image:'/products/BE-02.png' },
  { code:'BE-03',  nameAr:'مقعد BE-03',  nameEn:'Bench BE-03',  category:'BE', categoryAr:'مقاعد', categoryEn:'Benches', dimensions:'L 180 W 50 H 45', image:'/products/BE-03.png' },
  { code:'BE-04',  nameAr:'مقعد BE-04',  nameEn:'Bench BE-04',  category:'BE', categoryAr:'مقاعد', categoryEn:'Benches', dimensions:'L 200 W 50 H 70', image:'/products/BE-04.png' },
  { code:'BE-05',  nameAr:'مقعد BE-05',  nameEn:'Bench BE-05',  category:'BE', categoryAr:'مقاعد', categoryEn:'Benches', dimensions:'L 180 W 50 H 50', image:'/products/BE-05.png' },
  { code:'BE-06',  nameAr:'مقعد BE-06',  nameEn:'Bench BE-06',  category:'BE', categoryAr:'مقاعد', categoryEn:'Benches', dimensions:'L 180 W 50 H 45', image:'/products/BE-06.png' },
  { code:'BE-07',  nameAr:'مقعد BE-07',  nameEn:'Bench BE-07',  category:'BE', categoryAr:'مقاعد', categoryEn:'Benches', dimensions:'L 240 W 50 H 50', image:'/products/BE-07.png' },
  { code:'BE-08',  nameAr:'مقعد BE-08',  nameEn:'Bench BE-08',  category:'BE', categoryAr:'مقاعد', categoryEn:'Benches', dimensions:'L 240 W 50 H 50', image:'/products/BE-08.png' },
  { code:'BE-09',  nameAr:'مقعد BE-09',  nameEn:'Bench BE-09',  category:'BE', categoryAr:'مقاعد', categoryEn:'Benches', dimensions:'L 260 W 50 H 50', image:'/products/BE-09.png' },
  { code:'BE-010', nameAr:'مقعد BE-010', nameEn:'Bench BE-010', category:'BE', categoryAr:'مقاعد', categoryEn:'Benches', dimensions:'L 260 W 50 H 50', image:'/products/BE-010.png' },
  { code:'BE-011', nameAr:'مقعد BE-011', nameEn:'Bench BE-011', category:'BE', categoryAr:'مقاعد', categoryEn:'Benches', dimensions:'L 180 W 50 H 45', image:'/products/BE-011.png' },
  { code:'BE-012', nameAr:'مقعد BE-012', nameEn:'Bench BE-012', category:'BE', categoryAr:'مقاعد', categoryEn:'Benches', dimensions:'L 200 W 50 H 50', image:'/products/BE-012.png' },
  { code:'BE-013', nameAr:'مقعد BE-013', nameEn:'Bench BE-013', category:'BE', categoryAr:'مقاعد', categoryEn:'Benches', dimensions:'L 150 W 75 H 80', image:'/products/BE-013.png' },
  { code:'BE-014', nameAr:'مقعد BE-014', nameEn:'Bench BE-014', category:'BE', categoryAr:'مقاعد', categoryEn:'Benches', dimensions:'OUTER D 220 H 50', image:'/products/BE-014.png' },
  { code:'BE-015', nameAr:'مقعد BE-015', nameEn:'Bench BE-015', category:'BE', categoryAr:'مقاعد', categoryEn:'Benches', dimensions:'L 175 W 175 H 80', image:'/products/BE-015.png' },
  { code:'BE-016', nameAr:'مقعد BE-016', nameEn:'Bench BE-016', category:'BE', categoryAr:'مقاعد', categoryEn:'Benches', dimensions:'L 240 W 120 H 45', image:'/products/BE-016.png' },
  { code:'BE-017', nameAr:'مقعد BE-017', nameEn:'Bench BE-017', category:'BE', categoryAr:'مقاعد', categoryEn:'Benches', dimensions:'L 200 W 50 H 50', image:'/products/BE-017.png' },
  { code:'BE-018', nameAr:'مقعد BE-018', nameEn:'Bench BE-018', category:'BE', categoryAr:'مقاعد', categoryEn:'Benches', dimensions:'L 180 W 50 H 50', image:'/products/BE-018.png' },
  { code:'BE-019', nameAr:'مقعد BE-019', nameEn:'Bench BE-019', category:'BE', categoryAr:'مقاعد', categoryEn:'Benches', dimensions:'L 180 W 50 H 85', image:'/products/BE-019.png' },
  { code:'BE-020', nameAr:'مقعد BE-020', nameEn:'Bench BE-020', category:'BE', categoryAr:'مقاعد', categoryEn:'Benches', dimensions:'L 180 W 50 H 50', image:'/products/BE-020.png' },
  { code:'BE-021', nameAr:'مقعد BE-021', nameEn:'Bench BE-021', category:'BE', categoryAr:'مقاعد', categoryEn:'Benches', dimensions:'L 180 W 50 H 45', image:'/products/BE-021.png' },
  { code:'BE-022', nameAr:'مقعد BE-022', nameEn:'Bench BE-022', category:'BE', categoryAr:'مقاعد', categoryEn:'Benches', dimensions:'L 190 W 50 H 85', image:'/products/BE-022.png' },
  { code:'BE-023', nameAr:'مقعد BE-023', nameEn:'Bench BE-023', category:'BE', categoryAr:'مقاعد', categoryEn:'Benches', dimensions:'L 180 W 50 H 45', image:'/products/BE-023.png' },
  { code:'BE-024', nameAr:'مقعد BE-024', nameEn:'Bench BE-024', category:'BE', categoryAr:'مقاعد', categoryEn:'Benches', dimensions:'L 180 W 50 H 45', image:'/products/BE-024.png' },
  { code:'BE-025', nameAr:'مقعد BE-025', nameEn:'Bench BE-025', category:'BE', categoryAr:'مقاعد', categoryEn:'Benches', dimensions:'L 180 W 50 H 45', image:'/products/BE-025.png' },
  { code:'BE-026', nameAr:'مقعد BE-026', nameEn:'Bench BE-026', category:'BE', categoryAr:'مقاعد', categoryEn:'Benches', dimensions:'L 180 W 50 H 90', image:'/products/BE-026.png' },
  { code:'BE-027', nameAr:'مقعد BE-027', nameEn:'Bench BE-027', category:'BE', categoryAr:'مقاعد', categoryEn:'Benches', dimensions:'L 200 W 60 H 50', image:'/products/BE-027.png' },
  { code:'BE-028', nameAr:'مقعد BE-028', nameEn:'Bench BE-028', category:'BE', categoryAr:'مقاعد', categoryEn:'Benches', dimensions:'L 180 W 50 H 45', image:'/products/BE-028.png' },
  { code:'BE-029', nameAr:'مقعد BE-029', nameEn:'Bench BE-029', category:'BE', categoryAr:'مقاعد', categoryEn:'Benches', dimensions:'L 180 W 50 H 85', image:'/products/BE-029.png' },
  { code:'BE-030', nameAr:'مقعد BE-030', nameEn:'Bench BE-030', category:'BE', categoryAr:'مقاعد', categoryEn:'Benches', dimensions:'L 150 W 40 H 47', image:'/products/BE-030.png' },
  { code:'BE-031', nameAr:'مقعد BE-031', nameEn:'Bench BE-031', category:'BE', categoryAr:'مقاعد', categoryEn:'Benches', dimensions:'L 180 W 60 H 85', image:'/products/BE-031.png' },
  { code:'BE-032', nameAr:'مقعد BE-032', nameEn:'Bench BE-032', category:'BE', categoryAr:'مقاعد', categoryEn:'Benches', dimensions:'L 180 W 50 H 80', image:'/products/BE-032.png' },

  // ── Bollards (BO) ──────────────────────────────────────────────
  { code:'BO-01',  nameAr:'بوالرد BO-01',  nameEn:'Bollard BO-01',  category:'BO', categoryAr:'بوالرد', categoryEn:'Bollards', dimensions:'OUTER D 40 H 60 L 50 W 50 H 70', image:'/products/BO-01.png' },
  { code:'BO-02',  nameAr:'بوالرد BO-02',  nameEn:'Bollard BO-02',  category:'BO', categoryAr:'بوالرد', categoryEn:'Bollards', dimensions:'—', image:'/products/BO-02.png' },
  { code:'BO-03',  nameAr:'بوالرد BO-03',  nameEn:'Bollard BO-03',  category:'BO', categoryAr:'بوالرد', categoryEn:'Bollards', dimensions:'L 40 W 40 H 42', image:'/products/BO-03.png' },
  { code:'BO-04',  nameAr:'بوالرد BO-04',  nameEn:'Bollard BO-04',  category:'BO', categoryAr:'بوالرد', categoryEn:'Bollards', dimensions:'L 40 W 40 H 50', image:'/products/BO-04.png' },
  { code:'BO-05',  nameAr:'بوالرد BO-05',  nameEn:'Bollard BO-05',  category:'BO', categoryAr:'بوالرد', categoryEn:'Bollards', dimensions:'L 90 W 30 H 60 OUTER D 40 H 60 OUTER D 45 H 70 OUTER D 30 H 90', image:'/products/BO-05.png' },
  { code:'BO-06',  nameAr:'بوالرد BO-06',  nameEn:'Bollard BO-06',  category:'BO', categoryAr:'بوالرد', categoryEn:'Bollards', dimensions:'—', image:'/products/BO-06.png' },
  { code:'BO-07',  nameAr:'بوالرد BO-07',  nameEn:'Bollard BO-07',  category:'BO', categoryAr:'بوالرد', categoryEn:'Bollards', dimensions:'—', image:'/products/BO-07.png' },
  { code:'BO-08',  nameAr:'بوالرد BO-08',  nameEn:'Bollard BO-08',  category:'BO', categoryAr:'بوالرد', categoryEn:'Bollards', dimensions:'—', image:'/products/BO-08.png' },
  { code:'BO-09',  nameAr:'بوالرد BO-09',  nameEn:'Bollard BO-09',  category:'BO', categoryAr:'بوالرد', categoryEn:'Bollards', dimensions:'L 40 W 40 H 55', image:'/products/BO-09.png' },
  { code:'BO-010', nameAr:'بوالرد BO-010', nameEn:'Bollard BO-010', category:'BO', categoryAr:'بوالرد', categoryEn:'Bollards', dimensions:'L 60 W 60 H 30', image:'/products/BO-010.png' },
  { code:'BO-011', nameAr:'بوالرد BO-011', nameEn:'Bollard BO-011', category:'BO', categoryAr:'بوالرد', categoryEn:'Bollards', dimensions:'L 80 W 80 H 80', image:'/products/BO-011.png' },
  { code:'BO-012', nameAr:'بوالرد BO-012', nameEn:'Bollard BO-012', category:'BO', categoryAr:'بوالرد', categoryEn:'Bollards', dimensions:'L 40 W 40 H 40', image:'/products/BO-012.png' },
  { code:'BO-013', nameAr:'بوالرد BO-013', nameEn:'Bollard BO-013', category:'BO', categoryAr:'بوالرد', categoryEn:'Bollards', dimensions:'L 45 W 45 H 50', image:'/products/BO-013.png' },
  { code:'BO-014', nameAr:'بوالرد BO-014', nameEn:'Bollard BO-014', category:'BO', categoryAr:'بوالرد', categoryEn:'Bollards', dimensions:'L 30 W 30 H 100', image:'/products/BO-014.png' },
  { code:'BO-015', nameAr:'بوالرد BO-015', nameEn:'Bollard BO-015', category:'BO', categoryAr:'بوالرد', categoryEn:'Bollards', dimensions:'—', image:'/products/BO-015.png' },
  { code:'BO-016', nameAr:'بوالرد BO-016', nameEn:'Bollard BO-016', category:'BO', categoryAr:'بوالرد', categoryEn:'Bollards', dimensions:'H 60 OUTER D 40 L 30 W 30 H 55', image:'/products/BO-016.png' },

  // ── Concrete Barriers (CB) ─────────────────────────────────────
  { code:'CB-01', nameAr:'حاجز خرساني CB-01', nameEn:'Concrete Barrier CB-01', category:'CB', categoryAr:'حواجز خرسانية', categoryEn:'Concrete Barriers', dimensions:'L 100 W 50 H 50',   image:'/products/CB-01.png' },
  { code:'CB-02', nameAr:'حاجز خرساني CB-02', nameEn:'Concrete Barrier CB-02', category:'CB', categoryAr:'حواجز خرسانية', categoryEn:'Concrete Barriers', dimensions:'L 80 W 50 H 85',    image:'/products/CB-02.png' },
  { code:'CB-03', nameAr:'حاجز خرساني CB-03', nameEn:'Concrete Barrier CB-03', category:'CB', categoryAr:'حواجز خرسانية', categoryEn:'Concrete Barriers', dimensions:'L 100 W 50 H 85',   image:'/products/CB-03.png' },
  { code:'CB-04', nameAr:'حاجز خرساني CB-04', nameEn:'Concrete Barrier CB-04', category:'CB', categoryAr:'حواجز خرسانية', categoryEn:'Concrete Barriers', dimensions:'L 120 W 55 H 100',  image:'/products/CB-04.png' },
  { code:'CB-05', nameAr:'حاجز خرساني CB-05', nameEn:'Concrete Barrier CB-05', category:'CB', categoryAr:'حواجز خرسانية', categoryEn:'Concrete Barriers', dimensions:'L 150 W 55 H 100',  image:'/products/CB-05.png' },
  { code:'CB-06', nameAr:'حاجز خرساني CB-06', nameEn:'Concrete Barrier CB-06', category:'CB', categoryAr:'حواجز خرسانية', categoryEn:'Concrete Barriers', dimensions:'L 250 W 60 H 100',  image:'/products/CB-06.png' },

  // ── Planters (PL) ──────────────────────────────────────────────
  { code:'PL-01',  nameAr:'حوض زهور PL-01',  nameEn:'Planter PL-01',  category:'PL', categoryAr:'أحواض زهور', categoryEn:'Planters', dimensions:'H 90 OUTER D 60 L 60 W 60 H 60',       image:'/products/PL-01.png' },
  { code:'PL-02',  nameAr:'حوض زهور PL-02',  nameEn:'Planter PL-02',  category:'PL', categoryAr:'أحواض زهور', categoryEn:'Planters', dimensions:'—',                                     image:'/products/PL-02.png' },
  { code:'PL-03',  nameAr:'حوض زهور PL-03',  nameEn:'Planter PL-03',  category:'PL', categoryAr:'أحواض زهور', categoryEn:'Planters', dimensions:'L 75 W 75 H 75 H 55 OUTER D 90',       image:'/products/PL-03.png' },
  { code:'PL-04',  nameAr:'حوض زهور PL-04',  nameEn:'Planter PL-04',  category:'PL', categoryAr:'أحواض زهور', categoryEn:'Planters', dimensions:'—',                                     image:'/products/PL-04.png' },
  { code:'PL-05',  nameAr:'حوض زهور PL-05',  nameEn:'Planter PL-05',  category:'PL', categoryAr:'أحواض زهور', categoryEn:'Planters', dimensions:'L 50 W 50 H 80 H 50 OUTER D 50',       image:'/products/PL-05.png' },
  { code:'PL-06',  nameAr:'حوض زهور PL-06',  nameEn:'Planter PL-06',  category:'PL', categoryAr:'أحواض زهور', categoryEn:'Planters', dimensions:'L 50 W 50 H 50 H 70 OUTER D 90',       image:'/products/PL-06.png' },
  { code:'PL-07',  nameAr:'حوض زهور PL-07',  nameEn:'Planter PL-07',  category:'PL', categoryAr:'أحواض زهور', categoryEn:'Planters', dimensions:'—',                                     image:'/products/PL-07.png' },
  { code:'PL-08',  nameAr:'حوض زهور PL-08',  nameEn:'Planter PL-08',  category:'PL', categoryAr:'أحواض زهور', categoryEn:'Planters', dimensions:'—',                                     image:'/products/PL-08.png' },
  { code:'PL-09',  nameAr:'حوض زهور PL-09',  nameEn:'Planter PL-09',  category:'PL', categoryAr:'أحواض زهور', categoryEn:'Planters', dimensions:'L 70 W 70 H 60',                        image:'/products/PL-09.png' },
  { code:'PL-010', nameAr:'حوض زهور PL-010', nameEn:'Planter PL-010', category:'PL', categoryAr:'أحواض زهور', categoryEn:'Planters', dimensions:'L 90 W 45 H 60',                        image:'/products/PL-010.png' },
  { code:'PL-011', nameAr:'حوض زهور PL-011', nameEn:'Planter PL-011', category:'PL', categoryAr:'أحواض زهور', categoryEn:'Planters', dimensions:'L 80 W 80 H 60',                        image:'/products/PL-011.png' },
  { code:'PL-012', nameAr:'حوض زهور PL-012', nameEn:'Planter PL-012', category:'PL', categoryAr:'أحواض زهور', categoryEn:'Planters', dimensions:'L 100 W 50 H 50',                       image:'/products/PL-012.png' },
  { code:'PL-013', nameAr:'حوض زهور PL-013', nameEn:'Planter PL-013', category:'PL', categoryAr:'أحواض زهور', categoryEn:'Planters', dimensions:'L 100 W 40 H 60',                       image:'/products/PL-013.png' },
  { code:'PL-014', nameAr:'حوض زهور PL-014', nameEn:'Planter PL-014', category:'PL', categoryAr:'أحواض زهور', categoryEn:'Planters', dimensions:'L 170 W 70 H 70 H 50 OUTER D 170',     image:'/products/PL-014.png' },
  { code:'PL-015', nameAr:'حوض زهور PL-015', nameEn:'Planter PL-015', category:'PL', categoryAr:'أحواض زهور', categoryEn:'Planters', dimensions:'L 120 W 60 H 60',                       image:'/products/PL-015.png' },
  { code:'PL-016', nameAr:'حوض زهور PL-016', nameEn:'Planter PL-016', category:'PL', categoryAr:'أحواض زهور', categoryEn:'Planters', dimensions:'—',                                     image:'/products/PL-016.png' },

  // ── Stepping Stones (SS) ───────────────────────────────────────
  { code:'SS-01',  nameAr:'درجة سلم SS-01',  nameEn:'Stepping Stone SS-01',  category:'SS', categoryAr:'درج السلم', categoryEn:'Stepping Stones', dimensions:'L 100 W 35 H 15', image:'/products/SS-shapeA.png' },
  { code:'SS-02',  nameAr:'درجة سلم SS-02',  nameEn:'Stepping Stone SS-02',  category:'SS', categoryAr:'درج السلم', categoryEn:'Stepping Stones', dimensions:'L 100 W 35 H 10', image:'/products/SS-shapeA.png' },
  { code:'SS-03',  nameAr:'درجة سلم SS-03',  nameEn:'Stepping Stone SS-03',  category:'SS', categoryAr:'درج السلم', categoryEn:'Stepping Stones', dimensions:'L 50 W 35 H 15',  image:'/products/SS-shapeB.png' },
  { code:'SS-04',  nameAr:'درجة سلم SS-04',  nameEn:'Stepping Stone SS-04',  category:'SS', categoryAr:'درج السلم', categoryEn:'Stepping Stones', dimensions:'L 50 W 35 H 10',  image:'/products/SS-shapeA.png' },
  { code:'SS-05',  nameAr:'درجة سلم SS-05',  nameEn:'Stepping Stone SS-05',  category:'SS', categoryAr:'درج السلم', categoryEn:'Stepping Stones', dimensions:'L 100 W 33 H 3',  image:'/products/SS-shapeB.png' },
  { code:'SS-06',  nameAr:'درجة سلم SS-06',  nameEn:'Stepping Stone SS-06',  category:'SS', categoryAr:'درج السلم', categoryEn:'Stepping Stones', dimensions:'L 100 W 12 H 3',  image:'/products/SS-shapeA.png' },
  { code:'SS-07',  nameAr:'درجة سلم SS-07',  nameEn:'Stepping Stone SS-07',  category:'SS', categoryAr:'درج السلم', categoryEn:'Stepping Stones', dimensions:'L 120 W 33 H 3',  image:'/products/SS-shapeB.png' },
  { code:'SS-08',  nameAr:'درجة سلم SS-08',  nameEn:'Stepping Stone SS-08',  category:'SS', categoryAr:'درج السلم', categoryEn:'Stepping Stones', dimensions:'L 130 W 12 H 3',  image:'/products/SS-shapeA.png' },
  { code:'SS-09',  nameAr:'درجة سلم SS-09',  nameEn:'Stepping Stone SS-09',  category:'SS', categoryAr:'درج السلم', categoryEn:'Stepping Stones', dimensions:'L 130 W 33 H 3',  image:'/products/SS-shapeB.png' },
  { code:'SS-010', nameAr:'درجة سلم SS-010', nameEn:'Stepping Stone SS-010', category:'SS', categoryAr:'درج السلم', categoryEn:'Stepping Stones', dimensions:'L 130 W 12 H 3',  image:'/products/SS-shapeB.png' },
  { code:'SS-011', nameAr:'درجة سلم SS-011', nameEn:'Stepping Stone SS-011', category:'SS', categoryAr:'درج السلم', categoryEn:'Stepping Stones', dimensions:'L 150 W 33 H 3',  image:'/products/SS-shapeA.png' },
  { code:'SS-012', nameAr:'درجة سلم SS-012', nameEn:'Stepping Stone SS-012', category:'SS', categoryAr:'درج السلم', categoryEn:'Stepping Stones', dimensions:'L 150 W 12 H 3',  image:'/products/SS-shapeB.png' },
  { code:'SS-013', nameAr:'درجة سلم SS-013', nameEn:'Stepping Stone SS-013', category:'SS', categoryAr:'درج السلم', categoryEn:'Stepping Stones', dimensions:'L 170 W 33 H 3',  image:'/products/SS-shapeA.png' },
  { code:'SS-014', nameAr:'درجة سلم SS-014', nameEn:'Stepping Stone SS-014', category:'SS', categoryAr:'درج السلم', categoryEn:'Stepping Stones', dimensions:'L 170 W 12 H 3',  image:'/products/SS-shapeB.png' },

  // ── Steps / Slabs (ST) ─────────────────────────────────────────
  { code:'ST-01',  nameAr:'بلاطة خرسانية ST-01',  nameEn:'Concrete Slab ST-01',  category:'ST', categoryAr:'بلاطات خرسانية', categoryEn:'Steps/Slabs', dimensions:'L 60 W 30 H 6',   image:'/products/ST-shapeA.png' },
  { code:'ST-02',  nameAr:'بلاطة خرسانية ST-02',  nameEn:'Concrete Slab ST-02',  category:'ST', categoryAr:'بلاطات خرسانية', categoryEn:'Steps/Slabs', dimensions:'L 60 W 30 H 3',   image:'/products/ST-shapeA.png' },
  { code:'ST-03',  nameAr:'بلاطة خرسانية ST-03',  nameEn:'Concrete Slab ST-03',  category:'ST', categoryAr:'بلاطات خرسانية', categoryEn:'Steps/Slabs', dimensions:'L 40 W 30 H 6',   image:'/products/ST-shapeB.png' },
  { code:'ST-04',  nameAr:'بلاطة خرسانية ST-04',  nameEn:'Concrete Slab ST-04',  category:'ST', categoryAr:'بلاطات خرسانية', categoryEn:'Steps/Slabs', dimensions:'L 40 W 30 H 3',   image:'/products/ST-shapeA.png' },
  { code:'ST-05',  nameAr:'بلاطة خرسانية ST-05',  nameEn:'Concrete Slab ST-05',  category:'ST', categoryAr:'بلاطات خرسانية', categoryEn:'Steps/Slabs', dimensions:'L 100 W 40 H 6',  image:'/products/ST-shapeB.png' },
  { code:'ST-06',  nameAr:'بلاطة خرسانية ST-06',  nameEn:'Concrete Slab ST-06',  category:'ST', categoryAr:'بلاطات خرسانية', categoryEn:'Steps/Slabs', dimensions:'L 100 W 30 H 3',  image:'/products/ST-shapeA.png' },
  { code:'ST-07',  nameAr:'بلاطة خرسانية ST-07',  nameEn:'Concrete Slab ST-07',  category:'ST', categoryAr:'بلاطات خرسانية', categoryEn:'Steps/Slabs', dimensions:'L 120 W 40 H 6',  image:'/products/ST-shapeB.png' },
  { code:'ST-08',  nameAr:'بلاطة خرسانية ST-08',  nameEn:'Concrete Slab ST-08',  category:'ST', categoryAr:'بلاطات خرسانية', categoryEn:'Steps/Slabs', dimensions:'L 150 W 40 H 6',  image:'/products/ST-shapeA.png' },
  { code:'ST-09',  nameAr:'بلاطة خرسانية ST-09',  nameEn:'Concrete Slab ST-09',  category:'ST', categoryAr:'بلاطات خرسانية', categoryEn:'Steps/Slabs', dimensions:'L 200 W 40 H 6',  image:'/products/ST-shapeB.png' },
  { code:'ST-010', nameAr:'بلاطة خرسانية ST-010', nameEn:'Concrete Slab ST-010', category:'ST', categoryAr:'بلاطات خرسانية', categoryEn:'Steps/Slabs', dimensions:'L 50 W 50 H 6',   image:'/products/ST-shapeB.png' },
  { code:'ST-011', nameAr:'بلاطة خرسانية ST-011', nameEn:'Concrete Slab ST-011', category:'ST', categoryAr:'بلاطات خرسانية', categoryEn:'Steps/Slabs', dimensions:'L 80 W 80 H 6',   image:'/products/ST-shapeA.png' },
  { code:'ST-012', nameAr:'بلاطة خرسانية ST-012', nameEn:'Concrete Slab ST-012', category:'ST', categoryAr:'بلاطات خرسانية', categoryEn:'Steps/Slabs', dimensions:'L 100 W 100 H 6', image:'/products/ST-shapeB.png' },

  // ── Tables (TA) ────────────────────────────────────────────────
  { code:'TA-01', nameAr:'طاولة TA-01', nameEn:'Table TA-01', category:'TA', categoryAr:'طاولات', categoryEn:'Tables', dimensions:'H 80 OUTER D 100 H 50 OUTER D 45 L 45 W 45 H 45', image:'/products/TA-01.png' },
  { code:'TA-02', nameAr:'طاولة TA-02', nameEn:'Table TA-02', category:'TA', categoryAr:'طاولات', categoryEn:'Tables', dimensions:'L 80 W 80 H 70',   image:'/products/TA-02.png' },
  { code:'TA-03', nameAr:'طاولة TA-03', nameEn:'Table TA-03', category:'TA', categoryAr:'طاولات', categoryEn:'Tables', dimensions:'L 160 W 45 H 50',  image:'/products/TA-03.png' },
  { code:'TA-04', nameAr:'طاولة TA-04', nameEn:'Table TA-04', category:'TA', categoryAr:'طاولات', categoryEn:'Tables', dimensions:'L 80 W 80 H 70',   image:'/products/TA-04.png' },
  { code:'TA-05', nameAr:'طاولة TA-05', nameEn:'Table TA-05', category:'TA', categoryAr:'طاولات', categoryEn:'Tables', dimensions:'L 100 W 100 H 70', image:'/products/TA-05.png' },
  { code:'TA-06', nameAr:'طاولة TA-06', nameEn:'Table TA-06', category:'TA', categoryAr:'طاولات', categoryEn:'Tables', dimensions:'L 190 W 45 H 45',  image:'/products/TA-06.png' },
  { code:'TA-07', nameAr:'طاولة TA-07', nameEn:'Table TA-07', category:'TA', categoryAr:'طاولات', categoryEn:'Tables', dimensions:'L 274 W 152 H 76', image:'/products/TA-07.png' },
  { code:'TA-08', nameAr:'طاولة TA-08', nameEn:'Table TA-08', category:'TA', categoryAr:'طاولات', categoryEn:'Tables', dimensions:'L 274 W 152 H 76', image:'/products/TA-08.png' },

  // ── Trash Bins (TB) ────────────────────────────────────────────
  { code:'TB-01',  nameAr:'حاوية نفايات TB-01',  nameEn:'Trash Bin TB-01',  category:'TB', categoryAr:'حاويات نفايات', categoryEn:'Trash Bins', dimensions:'—',                                               image:'/products/TB-01.png' },
  { code:'TB-02',  nameAr:'حاوية نفايات TB-02',  nameEn:'Trash Bin TB-02',  category:'TB', categoryAr:'حاويات نفايات', categoryEn:'Trash Bins', dimensions:'L 50 W 50 H 100 H 80 OUTER D 50 INNER D 35',     image:'/products/TB-02.png' },
  { code:'TB-03',  nameAr:'حاوية نفايات TB-03',  nameEn:'Trash Bin TB-03',  category:'TB', categoryAr:'حاويات نفايات', categoryEn:'Trash Bins', dimensions:'H 90 OUTER D 40 INNER D 30 L 103 W 45 H 90',     image:'/products/TB-03.png' },
  { code:'TB-04',  nameAr:'حاوية نفايات TB-04',  nameEn:'Trash Bin TB-04',  category:'TB', categoryAr:'حاويات نفايات', categoryEn:'Trash Bins', dimensions:'—',                                               image:'/products/TB-04.png' },
  { code:'TB-05',  nameAr:'حاوية نفايات TB-05',  nameEn:'Trash Bin TB-05',  category:'TB', categoryAr:'حاويات نفايات', categoryEn:'Trash Bins', dimensions:'L 50 W 50 H 80',                                  image:'/products/TB-05.png' },
  { code:'TB-06',  nameAr:'حاوية نفايات TB-06',  nameEn:'Trash Bin TB-06',  category:'TB', categoryAr:'حاويات نفايات', categoryEn:'Trash Bins', dimensions:'L 40 W 40 H 90',                                  image:'/products/TB-06.png' },
  { code:'TB-07',  nameAr:'حاوية نفايات TB-07',  nameEn:'Trash Bin TB-07',  category:'TB', categoryAr:'حاويات نفايات', categoryEn:'Trash Bins', dimensions:'L 75 W 40 H 90 H 90 OUTER D 50',                 image:'/products/TB-07.png' },
  { code:'TB-08',  nameAr:'حاوية نفايات TB-08',  nameEn:'Trash Bin TB-08',  category:'TB', categoryAr:'حاويات نفايات', categoryEn:'Trash Bins', dimensions:'—',                                               image:'/products/TB-08.png' },
  { code:'TB-09',  nameAr:'حاوية نفايات TB-09',  nameEn:'Trash Bin TB-09',  category:'TB', categoryAr:'حاويات نفايات', categoryEn:'Trash Bins', dimensions:'L 40 W 40 H 85',                                  image:'/products/TB-09.png' },
  { code:'TB-010', nameAr:'حاوية نفايات TB-010', nameEn:'Trash Bin TB-010', category:'TB', categoryAr:'حاويات نفايات', categoryEn:'Trash Bins', dimensions:'L 40 W 40 H 85',                                  image:'/products/TB-010.png' },
  { code:'TB-011', nameAr:'حاوية نفايات TB-011', nameEn:'Trash Bin TB-011', category:'TB', categoryAr:'حاويات نفايات', categoryEn:'Trash Bins', dimensions:'L 75 W 40 H 85 H 90',                             image:'/products/TB-011.png' },
  { code:'TB-012', nameAr:'حاوية نفايات TB-012', nameEn:'Trash Bin TB-012', category:'TB', categoryAr:'حاويات نفايات', categoryEn:'Trash Bins', dimensions:'L 50 W 50',                                       image:'/products/TB-012.png' },
  { code:'TB-013', nameAr:'حاوية نفايات TB-013', nameEn:'Trash Bin TB-013', category:'TB', categoryAr:'حاويات نفايات', categoryEn:'Trash Bins', dimensions:'—',                                               image:'/products/TB-013.png' },
  { code:'TB-014', nameAr:'حاوية نفايات TB-014', nameEn:'Trash Bin TB-014', category:'TB', categoryAr:'حاويات نفايات', categoryEn:'Trash Bins', dimensions:'L 50 W 50 H 90 H 90 OUTER D 45 OUTER D 60',      image:'/products/TB-014.png' },
  { code:'TB-015', nameAr:'حاوية نفايات TB-015', nameEn:'Trash Bin TB-015', category:'TB', categoryAr:'حاويات نفايات', categoryEn:'Trash Bins', dimensions:'H 90 L 60 W 60 H 90',                             image:'/products/TB-015.png' },
  { code:'TB-016', nameAr:'حاوية نفايات TB-016', nameEn:'Trash Bin TB-016', category:'TB', categoryAr:'حاويات نفايات', categoryEn:'Trash Bins', dimensions:'—',                                               image:'/products/TB-016.png' },

  // ── Wheel Stoppers (WS) ────────────────────────────────────────
  { code:'WS-01', nameAr:'مصد سيارات WS-01', nameEn:'Wheel Stopper WS-01', category:'WS', categoryAr:'مصدات سيارات', categoryEn:'Wheel Stoppers', dimensions:'L 100 W 25 H 15', image:'/products/WS-01.png' },
  { code:'WS-02', nameAr:'مصد سيارات WS-02', nameEn:'Wheel Stopper WS-02', category:'WS', categoryAr:'مصدات سيارات', categoryEn:'Wheel Stoppers', dimensions:'L 180 W 20 H 15', image:'/products/WS-02.png' },
  { code:'WS-03', nameAr:'مصد سيارات WS-03', nameEn:'Wheel Stopper WS-03', category:'WS', categoryAr:'مصدات سيارات', categoryEn:'Wheel Stoppers', dimensions:'L 180 W 20 H 15', image:'/products/WS-03.png' },
  { code:'WS-04', nameAr:'مصد سيارات WS-04', nameEn:'Wheel Stopper WS-04', category:'WS', categoryAr:'مصدات سيارات', categoryEn:'Wheel Stoppers', dimensions:'L 180 W 30 H 20', image:'/products/WS-04.png' },
  { code:'WS-05', nameAr:'مصد سيارات WS-05', nameEn:'Wheel Stopper WS-05', category:'WS', categoryAr:'مصدات سيارات', categoryEn:'Wheel Stoppers', dimensions:'L 180 W 24 H 15', image:'/products/WS-05.png' },
  { code:'WS-06', nameAr:'مصد سيارات WS-06', nameEn:'Wheel Stopper WS-06', category:'WS', categoryAr:'مصدات سيارات', categoryEn:'Wheel Stoppers', dimensions:'L 200 W 20 H 15', image:'/products/WS-06.png' },
  { code:'WS-07', nameAr:'مصد سيارات WS-07', nameEn:'Wheel Stopper WS-07', category:'WS', categoryAr:'مصدات سيارات', categoryEn:'Wheel Stoppers', dimensions:'L 200 W 20 H 20', image:'/products/WS-07.png' },
  { code:'WS-08', nameAr:'مصد سيارات WS-08', nameEn:'Wheel Stopper WS-08', category:'WS', categoryAr:'مصدات سيارات', categoryEn:'Wheel Stoppers', dimensions:'L 200 W 20 H 20', image:'/products/WS-08.png' },
  { code:'WS-09', nameAr:'مصد سيارات WS-09', nameEn:'Wheel Stopper WS-09', category:'WS', categoryAr:'مصدات سيارات', categoryEn:'Wheel Stoppers', dimensions:'L 180 W 20 H 15', image:'/products/WS-09.png' },
]

async function seedProducts() {
  try {
    console.log(`Seeding ${products.length} products to Firestore...`)

    // Delete existing products in batches of 400
    const existing = await db.collection('products').get()
    if (existing.size > 0) {
      console.log(`Deleting ${existing.size} existing products...`)
      const chunks = []
      for (let i = 0; i < existing.docs.length; i += 400) {
        chunks.push(existing.docs.slice(i, i + 400))
      }
      for (const chunk of chunks) {
        const batch = db.batch()
        chunk.forEach(doc => batch.delete(doc.ref))
        await batch.commit()
      }
    }

    // Add all products in batches of 400
    const chunks = []
    for (let i = 0; i < products.length; i += 400) {
      chunks.push(products.slice(i, i + 400))
    }
    for (const chunk of chunks) {
      const batch = db.batch()
      chunk.forEach(product => {
        const ref = db.collection('products').doc()
        batch.set(ref, {
          ...product,
          createdAt: new Date().toISOString(),
          active: true,
        })
      })
      await batch.commit()
    }

    console.log(`✅ ${products.length} products seeded successfully`)
    process.exit(0)
  } catch (err) {
    console.error('❌ Error:', err.message)
    process.exit(1)
  }
}

seedProducts()
