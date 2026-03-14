import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

export const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL || 'fusedlens@gmail.com',
      to,
      subject,
      html
    })
    console.log('Email sent:', info.messageId)
    return { success: true }
  } catch (error) {
    console.error('Email error:', error)
    return { success: false, error: error.message }
  }
}

export const sendWelcomeEmail = async (user) => {
  const html = `
    <h1>Welcome to JEVI-TECH COMM LTD, ${user.name}!</h1>
    <p>Your account has been created successfully.</p>
    <p>Please verify your email to get started.</p>
  `
  return sendEmail(user.email, 'Welcome to JEVI-TECH COMM LTD', html)
}

export const sendPaymentConfirmation = async (user, payment) => {
  const html = `
    <h1>Payment Confirmed</h1>
    <p>Dear ${user.name},</p>
    <p>Your payment of $${payment.amount} has been processed successfully.</p>
    <p>Transaction ID: ${payment.transactionId}</p>
  `
  return sendEmail(user.email, 'Payment Confirmation', html)
}