import mongoose, { Schema, Document } from 'mongoose'

export interface IProjectDoc extends Document {
  titleAr: string; titleEn: string
  locationAr: string; locationEn: string
  year: number; image: string
  categoryAr: string; categoryEn: string; active: boolean
}

const ProjectSchema = new Schema<IProjectDoc>({
  titleAr:    { type: String, required: true },
  titleEn:    { type: String, required: true },
  locationAr: { type: String, required: true },
  locationEn: { type: String, required: true },
  year:       { type: Number, required: true },
  image:      { type: String, default: '' },
  categoryAr: { type: String, default: '' },
  categoryEn: { type: String, default: '' },
  active:     { type: Boolean, default: true },
}, { timestamps: true })

export default mongoose.model<IProjectDoc>('Project', ProjectSchema)
