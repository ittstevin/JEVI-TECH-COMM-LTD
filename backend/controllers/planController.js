import { body, validationResult } from 'express-validator'
import prisma from '../config/database.js'

export const getPlans = async (req, res) => {
  try {
    const plans = await prisma.plan.findMany({
      where: { enabled: true },
      orderBy: { createdAt: 'desc' }
    })

    // Parse features JSON
    const plansWithFeatures = plans.map(plan => ({
      ...plan,
      features: JSON.parse(plan.features || '[]')
    }))

    res.json({ plans: plansWithFeatures })
  } catch (error) {
    console.error('Get plans error:', error)
    res.status(500).json({ error: 'Failed to get plans' })
  }
}

export const getPlan = async (req, res) => {
  try {
    const { id } = req.params

    const plan = await prisma.plan.findUnique({
      where: { id }
    })

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' })
    }

    res.json({
      plan: {
        ...plan,
        features: JSON.parse(plan.features || '[]')
      }
    })
  } catch (error) {
    console.error('Get plan error:', error)
    res.status(500).json({ error: 'Failed to get plan' })
  }
}

export const createPlan = [
  body('name').trim().isLength({ min: 1 }).withMessage('Name is required'),
  body('speed').isInt({ min: 1 }).withMessage('Speed must be a positive integer'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('features').isArray().withMessage('Features must be an array'),

  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { name, speed, price, description, features } = req.body

      const plan = await prisma.plan.create({
        data: {
          name,
          speed: parseInt(speed),
          price: parseFloat(price),
          description,
          features: JSON.stringify(features)
        }
      })

      res.status(201).json({
        message: 'Plan created successfully',
        plan: {
          ...plan,
          features: JSON.parse(plan.features)
        }
      })
    } catch (error) {
      console.error('Create plan error:', error)
      res.status(500).json({ error: 'Failed to create plan' })
    }
  }
]

export const updatePlan = [
  body('name').optional().trim().isLength({ min: 1 }).withMessage('Name is required'),
  body('speed').optional().isInt({ min: 1 }).withMessage('Speed must be a positive integer'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('features').optional().isArray().withMessage('Features must be an array'),

  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { id } = req.params
      const { name, speed, price, description, features, enabled } = req.body

      const updateData = {}
      if (name !== undefined) updateData.name = name
      if (speed !== undefined) updateData.speed = parseInt(speed)
      if (price !== undefined) updateData.price = parseFloat(price)
      if (description !== undefined) updateData.description = description
      if (features !== undefined) updateData.features = JSON.stringify(features)
      if (enabled !== undefined) updateData.enabled = enabled

      const plan = await prisma.plan.update({
        where: { id },
        data: updateData
      })

      res.json({
        message: 'Plan updated successfully',
        plan: {
          ...plan,
          features: JSON.parse(plan.features)
        }
      })
    } catch (error) {
      console.error('Update plan error:', error)
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Plan not found' })
      }
      res.status(500).json({ error: 'Failed to update plan' })
    }
  }
]

export const deletePlan = async (req, res) => {
  try {
    const { id } = req.params

    await prisma.plan.delete({
      where: { id }
    })

    res.json({ message: 'Plan deleted successfully' })
  } catch (error) {
    console.error('Delete plan error:', error)
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Plan not found' })
    }
    res.status(500).json({ error: 'Failed to delete plan' })
  }
}