import { body, validationResult } from 'express-validator'
import prisma from '../config/database.js'
import { sendPaymentConfirmation } from '../services/emailService.js'

export const getPayments = async (req, res) => {
  try {
    const { page = 1, limit = 10, userId, status } = req.query

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const where = {}
    if (userId) where.userId = userId
    if (status) where.status = status

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
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
      prisma.payment.count({ where })
    ])

    res.json({
      payments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (error) {
    console.error('Get payments error:', error)
    res.status(500).json({ error: 'Failed to get payments' })
  }
}

export const getPayment = async (req, res) => {
  try {
    const { id } = req.params

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' })
    }

    res.json({ payment })
  } catch (error) {
    console.error('Get payment error:', error)
    res.status(500).json({ error: 'Failed to get payment' })
  }
}

export const createPayment = [
  body('userId').isUUID().withMessage('Valid user ID required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('paymentMethod').trim().isLength({ min: 1 }).withMessage('Payment method required'),

  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { userId, amount, paymentMethod } = req.body

      // Check if user exists
      const user = await prisma.user.findUnique({ where: { id: userId } })
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      // Generate transaction ID
      const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      const payment = await prisma.payment.create({
        data: {
          userId,
          amount: parseFloat(amount),
          paymentMethod,
          transactionId,
          status: 'COMPLETED' // In production, this would be 'PENDING' until confirmed
        },
        include: {
          user: {
            select: { id: true, name: true, email: true }
          }
        }
      })

      // Send confirmation email
      await sendPaymentConfirmation(user, payment)

      res.status(201).json({
        message: 'Payment processed successfully',
        payment
      })
    } catch (error) {
      console.error('Create payment error:', error)
      res.status(500).json({ error: 'Failed to process payment' })
    }
  }
]

export const updatePayment = async (req, res) => {
  try {
    const { id } = req.params
    const { status, transactionId } = req.body

    const payment = await prisma.payment.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(transactionId && { transactionId })
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    res.json({
      message: 'Payment updated successfully',
      payment
    })
  } catch (error) {
    console.error('Update payment error:', error)
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Payment not found' })
    }
    res.status(500).json({ error: 'Failed to update payment' })
  }
}

export const getPaymentStats = async (req, res) => {
  try {
    const [totalRevenue, monthlyRevenue, pendingPayments] = await Promise.all([
      prisma.payment.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true }
      }),
      prisma.payment.aggregate({
        where: {
          status: 'COMPLETED',
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        },
        _sum: { amount: true }
      }),
      prisma.payment.count({
        where: { status: 'PENDING' }
      })
    ])

    res.json({
      stats: {
        totalRevenue: totalRevenue._sum.amount || 0,
        monthlyRevenue: monthlyRevenue._sum.amount || 0,
        pendingPayments
      }
    })
  } catch (error) {
    console.error('Get payment stats error:', error)
    res.status(500).json({ error: 'Failed to get payment stats' })
  }
}