import { body, validationResult } from 'express-validator'
import prisma from '../config/database.js'

export const getSubscriptions = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, userId } = req.query

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const where = {}
    if (status) where.status = status
    if (userId) where.userId = userId

    const [subscriptions, total] = await Promise.all([
      prisma.subscription.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true }
          },
          plan: true
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.subscription.count({ where })
    ])

    res.json({
      subscriptions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (error) {
    console.error('Get subscriptions error:', error)
    res.status(500).json({ error: 'Failed to get subscriptions' })
  }
}

export const getSubscription = async (req, res) => {
  try {
    const { id } = req.params

    const subscription = await prisma.subscription.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true }
        },
        plan: true
      }
    })

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' })
    }

    res.json({ subscription })
  } catch (error) {
    console.error('Get subscription error:', error)
    res.status(500).json({ error: 'Failed to get subscription' })
  }
}

export const createSubscription = [
  body('userId').isUUID().withMessage('Valid user ID required'),
  body('planId').isUUID().withMessage('Valid plan ID required'),

  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { userId, planId } = req.body

      // Check if user exists
      const user = await prisma.user.findUnique({ where: { id: userId } })
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      // Check if plan exists
      const plan = await prisma.plan.findUnique({ where: { id: planId } })
      if (!plan) {
        return res.status(404).json({ error: 'Plan not found' })
      }

      // Check if user already has an active subscription
      const existingSubscription = await prisma.subscription.findFirst({
        where: {
          userId,
          status: 'ACTIVE'
        }
      })

      if (existingSubscription) {
        return res.status(409).json({ error: 'User already has an active subscription' })
      }

      const subscription = await prisma.subscription.create({
        data: {
          userId,
          planId
        },
        include: {
          user: {
            select: { id: true, name: true, email: true }
          },
          plan: true
        }
      })

      res.status(201).json({
        message: 'Subscription created successfully',
        subscription
      })
    } catch (error) {
      console.error('Create subscription error:', error)
      res.status(500).json({ error: 'Failed to create subscription' })
    }
  }
]

export const updateSubscription = async (req, res) => {
  try {
    const { id } = req.params
    const { status, renewalDate } = req.body

    const subscription = await prisma.subscription.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(renewalDate && { renewalDate: new Date(renewalDate) })
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        plan: true
      }
    })

    res.json({
      message: 'Subscription updated successfully',
      subscription
    })
  } catch (error) {
    console.error('Update subscription error:', error)
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Subscription not found' })
    }
    res.status(500).json({ error: 'Failed to update subscription' })
  }
}

export const deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params

    await prisma.subscription.delete({
      where: { id }
    })

    res.json({ message: 'Subscription deleted successfully' })
  } catch (error) {
    console.error('Delete subscription error:', error)
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Subscription not found' })
    }
    res.status(500).json({ error: 'Failed to delete subscription' })
  }
}