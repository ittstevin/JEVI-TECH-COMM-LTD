import { body, validationResult } from 'express-validator'
import prisma from '../config/database.js'

export const getTickets = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, userId } = req.query

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const where = {}
    if (status) where.status = status
    if (userId) where.userId = userId

    const [tickets, total] = await Promise.all([
      prisma.supportTicket.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true }
          }
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.supportTicket.count({ where })
    ])

    res.json({
      tickets,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (error) {
    console.error('Get tickets error:', error)
    res.status(500).json({ error: 'Failed to get tickets' })
  }
}

export const getTicket = async (req, res) => {
  try {
    const { id } = req.params

    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true }
        }
      }
    })

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' })
    }

    res.json({ ticket })
  } catch (error) {
    console.error('Get ticket error:', error)
    res.status(500).json({ error: 'Failed to get ticket' })
  }
}

export const createTicket = [
  body('subject').trim().isLength({ min: 5 }).withMessage('Subject must be at least 5 characters'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),

  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { subject, message, priority = 'normal' } = req.body
      const userId = req.user.id

      const ticket = await prisma.supportTicket.create({
        data: {
          userId,
          subject,
          message,
          priority
        },
        include: {
          user: {
            select: { id: true, name: true, email: true }
          }
        }
      })

      res.status(201).json({
        message: 'Support ticket created successfully',
        ticket
      })
    } catch (error) {
      console.error('Create ticket error:', error)
      res.status(500).json({ error: 'Failed to create ticket' })
    }
  }
]

export const updateTicket = async (req, res) => {
  try {
    const { id } = req.params
    const { status, priority } = req.body

    const ticket = await prisma.supportTicket.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(priority && { priority })
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    res.json({
      message: 'Ticket updated successfully',
      ticket
    })
  } catch (error) {
    console.error('Update ticket error:', error)
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Ticket not found' })
    }
    res.status(500).json({ error: 'Failed to update ticket' })
  }
}

export const getTicketStats = async (req, res) => {
  try {
    const [totalTickets, openTickets, resolvedTickets] = await Promise.all([
      prisma.supportTicket.count(),
      prisma.supportTicket.count({ where: { status: 'OPEN' } }),
      prisma.supportTicket.count({ where: { status: 'RESOLVED' } })
    ])

    res.json({
      stats: {
        totalTickets,
        openTickets,
        resolvedTickets,
        resolutionRate: totalTickets > 0 ? (resolvedTickets / totalTickets * 100).toFixed(1) : 0
      }
    })
  } catch (error) {
    console.error('Get ticket stats error:', error)
    res.status(500).json({ error: 'Failed to get ticket stats' })
  }
}