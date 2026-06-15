import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  user?: { id: string; role: string }
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'غير مصرح | Unauthorized' })
  }
  try {
    const token = auth.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { id: string; role: string }
    req.user = decoded
    next()
  } catch {
    res.status(401).json({ success: false, message: 'رمز منتهي الصلاحية | Token expired' })
  }
}

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'للمدراء فقط | Admins only' })
  }
  next()
}
