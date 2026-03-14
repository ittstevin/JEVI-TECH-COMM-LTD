import prisma from '../config/database.js'

export const getNetworkStatus = async (req, res) => {
  try {
    const statuses = await prisma.networkStatus.findMany({
      orderBy: { updatedAt: 'desc' }
    })

    res.json({ statuses })
  } catch (error) {
    console.error('Get network status error:', error)
    res.status(500).json({ error: 'Failed to get network status' })
  }
}

export const updateNetworkStatus = async (req, res) => {
  try {
    const { area, status, message } = req.body

    const networkStatus = await prisma.networkStatus.upsert({
      where: { area },
      update: {
        status,
        message,
        updatedAt: new Date()
      },
      create: {
        area,
        status,
        message
      }
    })

    res.json({
      message: 'Network status updated successfully',
      status: networkStatus
    })
  } catch (error) {
    console.error('Update network status error:', error)
    res.status(500).json({ error: 'Failed to update network status' })
  }
}

export const getOverallStatus = async (req, res) => {
  try {
    const statuses = await prisma.networkStatus.findMany()

    // Determine overall status
    const hasOutage = statuses.some(s => s.status === 'OUTAGE')
    const hasDegraded = statuses.some(s => s.status === 'DEGRADED')
    const hasMaintenance = statuses.some(s => s.status === 'MAINTENANCE')

    let overallStatus = 'OPERATIONAL'
    if (hasOutage) overallStatus = 'OUTAGE'
    else if (hasDegraded) overallStatus = 'DEGRADED'
    else if (hasMaintenance) overallStatus = 'MAINTENANCE'

    res.json({
      overallStatus,
      statuses,
      lastUpdated: statuses.length > 0 ? Math.max(...statuses.map(s => s.updatedAt.getTime())) : null
    })
  } catch (error) {
    console.error('Get overall status error:', error)
    res.status(500).json({ error: 'Failed to get overall status' })
  }
}