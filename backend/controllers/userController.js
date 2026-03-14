import prisma from '../config/database.js'

export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role } = req.query

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const where = role ? { role } : {}

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          verified: true,
          createdAt: true,
          _count: {
            select: {
              subscriptions: true,
              payments: true,
              tickets: true
            }
          }
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ])

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({ error: 'Failed to get users' })
  }
}

export const getUser = async (req, res) => {
  try {
    const { id } = req.params

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        verified: true,
        createdAt: true,
        subscriptions: {
          include: {
            plan: true
          }
        },
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        tickets: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({ user })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ error: 'Failed to get user' })
  }
}

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params
    const { name, phone, address, role, verified } = req.body

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(address && { address }),
        ...(role && { role }),
        ...(verified !== undefined && { verified })
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        verified: true
      }
    })

    res.json({
      message: 'User updated successfully',
      user
    })
  } catch (error) {
    console.error('Update user error:', error)
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' })
    }
    res.status(500).json({ error: 'Failed to update user' })
  }
}

export const suspendUser = async (req, res) => {
  try {
    const { id } = req.params

    // Update all active subscriptions to suspended
    await prisma.subscription.updateMany({
      where: {
        userId: id,
        status: 'ACTIVE'
      },
      data: {
        status: 'SUSPENDED'
      }
    })

    res.json({ message: 'User suspended successfully' })
  } catch (error) {
    console.error('Suspend user error:', error)
    res.status(500).json({ error: 'Failed to suspend user' })
  }
}

export const getUserStats = async (req, res) => {
  try {
    const [totalUsers, activeUsers, totalSubscriptions, totalRevenue] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          subscriptions: {
            some: {
              status: 'ACTIVE'
            }
          }
        }
      }),
      prisma.subscription.count({
        where: { status: 'ACTIVE' }
      }),
      prisma.payment.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true }
      })
    ])

    res.json({
      stats: {
        totalUsers,
        activeUsers,
        totalSubscriptions,
        totalRevenue: totalRevenue._sum.amount || 0
      }
    })
  } catch (error) {
    console.error('Get user stats error:', error)
    res.status(500).json({ error: 'Failed to get user stats' })
  }
}