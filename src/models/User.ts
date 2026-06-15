import mongoose, { Schema, Document } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUserDoc extends Document {
  email: string
  password: string
  name: string
  role: string
  comparePassword(candidate: string): Promise<boolean>
}

const UserSchema = new Schema<IUserDoc>({
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  name:     { type: String, required: true },
  role:     { type: String, enum: ['admin','editor'], default: 'editor' },
}, { timestamps: true })

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

UserSchema.methods.comparePassword = async function(candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password)
}

export default mongoose.model<IUserDoc>('User', UserSchema)
