import { PrismaClient } from './node_modules/@prisma/client/default.js'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@jevitech.co.ke' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@jevitech.co.ke',
      password: adminPassword,
      role: 'ADMIN',
      verified: true
    }
  })

  // Create sample customer
  const customerPassword = await bcrypt.hash('customer123', 12)
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'customer@example.com',
      password: customerPassword,
      phone: '+1234567890',
      address: '123 Main St, Downtown',
      role: 'CUSTOMER',
      verified: true
    }
  })

  // Create internet plans
  const plans = [
    {
      name: 'Basic',
      speed: 10,
      price: 1500,
      description: 'Ideal for browsing and small households',
      features: JSON.stringify(['Unlimited data', 'Standard support', 'Easy setup']),
    },
    {
      name: 'Standard',
      speed: 20,
      price: 2000,
      description: 'Good for streaming and everyday use',
      features: JSON.stringify(['Unlimited data', 'Priority support', 'Reliable performance']),
    },
    {
      name: 'Premium',
      speed: 50,
      price: 3000,
      description: 'Great for gaming, remote work, and families',
      features: JSON.stringify(['Unlimited data', 'High performance', 'Priority support']),
    },
    {
      name: 'Business',
      speed: 100,
      price: 7000,
      description: 'Ultra-fast internet for businesses and heavy users',
      features: JSON.stringify(['Unlimited data', 'Dedicated support', 'Service-level guarantees']),
    }
  ]

  for (const planData of plans) {
    await prisma.plan.upsert({
      where: { name: planData.name },
      update: {},
      create: planData
    })
  }

  // Create sample subscription
  const proPlan = await prisma.plan.findFirst({ where: { name: 'Pro' } })
  if (proPlan) {
    await prisma.subscription.upsert({
      where: { userId: customer.id },
      update: {},
      create: {
        userId: customer.id,
        planId: proPlan.id,
        status: 'ACTIVE'
      }
    })
  }

  // Create sample payment
  await prisma.payment.upsert({
    where: { transactionId: 'SAMPLE-TXN-001' },
    update: {},
    create: {
      userId: customer.id,
      amount: 49.99,
      paymentMethod: 'Credit Card',
      status: 'COMPLETED',
      transactionId: 'SAMPLE-TXN-001'
    }
  })

  // Create sample support ticket
  await prisma.supportTicket.upsert({
    where: { id: 'sample-ticket-001' },
    update: {},
    create: {
      id: 'sample-ticket-001',
      userId: customer.id,
      subject: 'Slow internet connection',
      message: 'My internet has been running slow for the past few days. Speed test shows only 50 Mbps instead of 200 Mbps.',
      status: 'OPEN'
    }
  })

  // Create sample network status
  await prisma.networkStatus.upsert({
    where: { area: 'downtown' },
    update: {},
    create: {
      area: 'downtown',
      status: 'OPERATIONAL',
      message: 'All systems operational'
    }
  })

  console.log('✅ Database seeded successfully!')
  console.log('👤 Admin login: admin@jevitech.co.ke / admin123')
  console.log('👤 Customer login: customer@example.com / customer123')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })