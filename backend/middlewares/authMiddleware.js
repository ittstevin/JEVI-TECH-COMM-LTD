import { verifyToken } from '../config/jwt.js'
import prisma from '../config/database.js'

export const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token.' })
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true, verified: true }
    })

    if (!user) {
      return res.status(401).json({ error: 'User not found.' })
    }

    req.user = user
    next()
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed.' })
  }
}

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied. Insufficient permissions.' })
    }

    next()
  }
}

export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (token) {
      const decoded = verifyToken(token)
      if (decoded) {
        const user = await prisma.user.findUnique({
          where: { id: decoded.id },
          select: { id: true, name: true, email: true, role: true, verified: true }
        })
        if (user) {
          req.user = user
        }
      }
    }

    next()
  } catch (error) {
    next()
  }
}