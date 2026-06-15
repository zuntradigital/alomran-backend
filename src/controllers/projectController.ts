import { Request, Response } from 'express'
import Project from '../models/Project'

export const getProjects = async (_req: Request, res: Response) => {
  try {
    const projects = await Project.find({ active: true }).sort({ year: -1 })
    res.json({ success: true, count: projects.length, data: projects })
  } catch {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

export const createProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.create(req.body)
    res.status(201).json({ success: true, data: project })
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message })
  }
}

export const updateProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!project) return res.status(404).json({ success: false, message: 'المشروع غير موجود' })
    res.json({ success: true, data: project })
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message })
  }
}

export const deleteProject = async (req: Request, res: Response) => {
  try {
    await Project.findByIdAndUpdate(req.params.id, { active: false })
    res.json({ success: true, message: 'تم الحذف بنجاح' })
  } catch {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}
