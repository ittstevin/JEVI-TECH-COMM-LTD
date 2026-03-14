import { body, validationResult } from 'express-validator'
import prisma from '../config/database.js'

export const getInstallations = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, userId } = req.query

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const where = {}
    if (status) where.status = status
    if (userId) where.userId = userId

    const [installations, total] = await Promise.all([
      prisma.installationRequest.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true, phone: true }
          }
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.installationRequest.count({ where })
    ])

    res.json({
      installations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (error) {
    console.error('Get installations error:', error)
    res.status(500).json({ error: 'Failed to get installations' })
  }
}

export const getInstallation = async (req, res) => {
  try {
    const { id } = req.params

    const installation = await prisma.installationRequest.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true, address: true }
        }
      }
    })

    if (!installation) {
      return res.status(404).json({ error: 'Installation request not found' })
    }

    res.json({ installation })
  } catch (error) {
    console.error('Get installation error:', error)
    res.status(500).json({ error: 'Failed to get installation' })
  }
}

export const createInstallation = [
  body('address').trim().isLength({ min: 10 }).withMessage('Address must be at least 10 characters'),
  body('selectedPlan').trim().isLength({ min: 1 }).withMessage('Selected plan is required'),

  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { address, locationCoordinates, selectedPlan, preferredInstallationDate } = req.body
      const userId = req.user.id

      const installation = await prisma.installationRequest.create({
        data: {
          userId,
          address,
          locationCoordinates,
          selectedPlan,
          preferredInstallationDate: preferredInstallationDate ? new Date(preferredInstallationDate) : null
        },
        include: {
          user: {
            select: { id: true, name: true, email: true, phone: true }
          }
        }
      })

      res.status(201).json({
        message: 'Installation request created successfully',
        installation
      })
    } catch (error) {
      console.error('Create installation error:', error)
      res.status(500).json({ error: 'Failed to create installation request' })
    }
  }
]

export const updateInstallation = async (req, res) => {
  try {
    const { id } = req.params
    const { status, technicianNotes, preferredInstallationDate } = req.body

    const installation = await prisma.installationRequest.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(technicianNotes !== undefined && { technicianNotes }),
        ...(preferredInstallationDate && { preferredInstallationDate: new Date(preferredInstallationDate) })
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true }
        }
      }
    })

    res.json({
      message: 'Installation updated successfully',
      installation
    })
  } catch (error) {
    console.error('Update installation error:', error)
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Installation request not found' })
    }
    res.status(500).json({ error: 'Failed to update installation' })
  }
}