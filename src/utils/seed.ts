import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/User'
import Product from '../models/Product'

dotenv.config()

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alomran')
  console.log('Connected to MongoDB')

  // Create admin user
  await User.deleteMany({})
  await User.create({ email:'admin@alomranprecast.com', password:'alomran2024', name:'Admin', role:'admin' })
  console.log('✅ Admin user created')

  // Seed products
  await Product.deleteMany({})
  await Product.insertMany([
    { code:'BE-01',  nameAr:'مقعد كلاسيكي',       nameEn:'Classic Bench',        category:'BE', categoryAr:'مقاعد',         categoryEn:'Benches',          dimensions:'L 200 W 50 H 50', featured:true  },
    { code:'BE-05',  nameAr:'مقعد حديث بخشب',      nameEn:'Modern Wood Bench',    category:'BE', categoryAr:'مقاعد',         categoryEn:'Benches',          dimensions:'L 180 W 50 H 50', featured:true  },
    { code:'BE-015', nameAr:'مقعد محيطي بالشجرة',  nameEn:'Tree Surround Bench',  category:'BE', categoryAr:'مقاعد',         categoryEn:'Benches',          dimensions:'L 175 W 175 H 80', featured:true },
    { code:'BE-019', nameAr:'مقعد بظهر',            nameEn:'Bench with Backrest',  category:'BE', categoryAr:'مقاعد',         categoryEn:'Benches',          dimensions:'L 180 W 50 H 85' },
    { code:'TA-01',  nameAr:'طاولة دائرية',         nameEn:'Round Table',          category:'TA', categoryAr:'طاولات',        categoryEn:'Tables',           dimensions:'Outer D 100 H 80', featured:true },
    { code:'TA-03',  nameAr:'طاولة شطرنج',          nameEn:'Chess Table',          category:'TA', categoryAr:'طاولات',        categoryEn:'Tables',           dimensions:'L 80 W 80 H 70' },
    { code:'TA-07',  nameAr:'طاولة بنج بونج',       nameEn:'Ping Pong Table',      category:'TA', categoryAr:'طاولات',        categoryEn:'Tables',           dimensions:'L 274 W 152 H 76' },
    { code:'TB-01',  nameAr:'حاوية أسطوانية',       nameEn:'Cylindrical Bin',      category:'TB', categoryAr:'حاويات نفايات', categoryEn:'Trash Bins',       dimensions:'Outer D 50 H 80', featured:true },
    { code:'TB-04',  nameAr:'حاوية مربعة',           nameEn:'Square Bin',           category:'TB', categoryAr:'حاويات نفايات', categoryEn:'Trash Bins',       dimensions:'L 50 W 50 H 100' },
    { code:'PL-01',  nameAr:'حوض مربع',              nameEn:'Square Planter',       category:'PL', categoryAr:'أحواض زهور',   categoryEn:'Planters',         dimensions:'L 60 W 60 H 60', featured:true },
    { code:'PL-07',  nameAr:'حوض دائري',             nameEn:'Round Planter',        category:'PL', categoryAr:'أحواض زهور',   categoryEn:'Planters',         dimensions:'Outer D 90 H 70' },
    { code:'BO-01',  nameAr:'بوالرد دائري',          nameEn:'Round Bollard',        category:'BO', categoryAr:'بوالرد',        categoryEn:'Bollards',         dimensions:'Outer D 40 H 60', featured:true },
    { code:'BO-07',  nameAr:'بوالرد مقبة',           nameEn:'Domed Bollard',        category:'BO', categoryAr:'بوالرد',        categoryEn:'Bollards',         dimensions:'Outer D 45 H 70' },
    { code:'CB-01',  nameAr:'حاجز خرساني صغير',     nameEn:'Small Barrier',        category:'CB', categoryAr:'حواجز خرسانية',categoryEn:'Concrete Barriers',dimensions:'L 100 W 50 H 50' },
    { code:'CB-05',  nameAr:'حاجز خرساني كبير',     nameEn:'Large Barrier',        category:'CB', categoryAr:'حواجز خرسانية',categoryEn:'Concrete Barriers',dimensions:'L 150 W 55 H 100', featured:true },
    { code:'WS-01',  nameAr:'مصد سيارات قصير',      nameEn:'Short Wheel Stopper',  category:'WS', categoryAr:'مصدات سيارات', categoryEn:'Wheel Stoppers',   dimensions:'L 100 W 25 H 15' },
    { code:'WS-04',  nameAr:'مصد سيارات طويل',      nameEn:'Long Wheel Stopper',   category:'WS', categoryAr:'مصدات سيارات', categoryEn:'Wheel Stoppers',   dimensions:'L 180 W 30 H 20' },
  ])
  console.log('✅ Products seeded')

  mongoose.disconnect()
  console.log('✅ Seed complete!')
}

seed().catch(console.error)
