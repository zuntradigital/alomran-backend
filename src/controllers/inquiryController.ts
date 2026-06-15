import { Request, Response } from 'express'
import Inquiry from '../models/Inquiry'

export const createInquiry = async (req: Request, res: Response) => {
  try {
    const inquiry = await Inquiry.create(req.body)
    res.status(201).json({ success: true, data: inquiry, message: 'تم إرسال استفسارك بنجاح!' })
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message })
  }
}

export const getInquiries = async (req: Request, res: Response) => {
  try {
    const { status } = req.query
    const filter: any = {}
    if (status) filter.status = status
    const inquiries = await Inquiry.find(filter).sort({ createdAt: -1 })
    res.json({ success: true, count: inquiries.length, data: inquiries })
  } catch {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

export const updateInquiryStatus = async (req: Request, res: Response) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id, { status: req.body.status }, { new: true }
    )
    if (!inquiry) return res.status(404).json({ success: false, message: 'الاستفسار غير موجود' })
    res.json({ success: true, data: inquiry })
  } catch {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

export const getStats = async (_req: Request, res: Response) => {
  try {
    const total     = await Inquiry.countDocuments()
    const newCount  = await Inquiry.countDocuments({ status: 'new' })
    const pending   = await Inquiry.countDocuments({ status: 'pending' })
    const completed = await Inquiry.countDocuments({ status: 'completed' })
    res.json({ success: true, data: { total, new: newCount, pending, completed } })
  } catch {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}
