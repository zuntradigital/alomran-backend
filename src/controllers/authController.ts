import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User'

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '7d' }
  )

  res.json({ token, user })
}

export const getMe = async (req: Request, res: Response) => {
  const user = await User.findById((req as any).user.id)
  res.json(user)
}
