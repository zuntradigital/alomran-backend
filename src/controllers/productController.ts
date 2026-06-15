import { Request, Response } from 'express'
import Product from '../models/Product'

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, featured, search } = req.query
    const filter: any = { active: true }
    if (category && category !== 'all') filter.category = category
    if (featured === 'true') filter.featured = true
    if (search) filter.$or = [
      { nameAr: { $regex: search, $options: 'i' } },
      { nameEn: { $regex: search, $options: 'i' } },
      { code:   { $regex: search, $options: 'i' } },
    ]
    const products = await Product.find(filter).sort({ createdAt: -1 })
    res.json({ success: true, count: products.length, data: products })
  } catch {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

export const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findOne({ code: req.params.code, active: true })
    if (!product) return res.status(404).json({ success: false, message: 'المنتج غير موجود' })
    res.json({ success: true, data: product })
  } catch {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.create(req.body)
    res.status(201).json({ success: true, data: product })
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message })
  }
}

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!product) return res.status(404).json({ success: false, message: 'المنتج غير موجود' })
    res.json({ success: true, data: product })
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message })
  }
}

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { active: false })
    res.json({ success: true, message: 'تم الحذف بنجاح' })
  } catch {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}
