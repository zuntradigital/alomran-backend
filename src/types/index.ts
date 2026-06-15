export interface IUser {
  _id?: string
  email: string
  password: string
  name: string
  role: 'admin' | 'editor'
  createdAt?: Date
}

export interface IProduct {
  _id?: string
  code: string
  nameAr: string
  nameEn: string
  category: string
  categoryAr: string
  categoryEn: string
  dimensions: string
  material?: string
  image?: string
  featured?: boolean
  active: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface IInquiry {
  _id?: string
  name: string
  email: string
  phone?: string
  productType?: string
  message: string
  status: 'new' | 'pending' | 'completed'
  createdAt?: Date
}

export interface IProject {
  _id?: string
  titleAr: string
  titleEn: string
  locationAr: string
  locationEn: string
  year: number
  image?: string
  categoryAr: string
  categoryEn: string
  active: boolean
}

export interface AuthRequest extends Request {
  user?: { id: string; role: string }
}
