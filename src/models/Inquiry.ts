import mongoose, { Schema, Document } from 'mongoose'

export interface IInquiryDoc extends Document {
  name: string; email: string; phone: string
  productType: string; message: string
  status: 'new' | 'pending' | 'completed'
}

const InquirySchema = new Schema<IInquiryDoc>({
  name:        { type: String, required: true },
  email:       { type: String, required: true },
  phone:       { type: String, default: '' },
  productType: { type: String, default: '' },
  message:     { type: String, required: true },
  status:      { type: String, enum: ['new','pending','completed'], default: 'new' },
}, { timestamps: true })

export default mongoose.model<IInquiryDoc>('Inquiry', InquirySchema)
