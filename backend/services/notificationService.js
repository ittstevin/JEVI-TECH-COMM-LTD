import prisma from '../config/database.js'
import { sendEmail } from './emailService.js'

// Placeholder for SMS service - in production, integrate with Twilio
export const sendSMS = async (phone, message) => {
  console.log(`SMS to ${phone}: ${message}`)
  // In production: integrate with Twilio
  return { success: true }
}

export const createNotification = async (userId, type, title, message) => {
  return prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message
    }
  })
}

export const sendNotification = async (userId, type, title, message) => {
  const notification = await createNotification(userId, type, title, message)

  if (type === 'email') {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (user) {
      await sendEmail(user.email, title, message)
    }
  } else if (type === 'sms') {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (user?.phone) {
      await sendSMS(user.phone, message)
    }
  }

  return notification
}