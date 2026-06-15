import mongoose, { Schema, Document } from 'mongoose'

export interface IProductDoc extends Document {
  code: string; nameAr: string; nameEn: string
  category: string; categoryAr: string; categoryEn: string
  dimensions: string; material: string; image: string
  featured: boolean; active: boolean
}

const ProductSchema = new Schema<IProductDoc>({
  code:        { type: String, required: true, unique: true },
  nameAr:      { type: String, required: true },
  nameEn:      { type: String, required: true },
  category:    { type: String, required: true },
  categoryAr:  { type: String, required: true },
  categoryEn:  { type: String, required: true },
  dimensions:  { type: String, required: true },
  material:    { type: String, default: 'High-Performance Precast Concrete' },
  image:       { type: String, default: '' },
  featured:    { type: Boolean, default: false },
  active:      { type: Boolean, default: true },
}, { timestamps: true })

export default mongoose.model<IProductDoc>('Product', ProductSchema)
