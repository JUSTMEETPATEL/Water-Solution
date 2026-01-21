import dotenv from 'dotenv'
import path from 'path'

// Load .env file FIRST
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

async function main() {
  // Use Pool with WebSocket for Node.js environment
  const { Pool, neonConfig } = await import('@neondatabase/serverless')
  const { PrismaNeon } = await import('@prisma/adapter-neon')
  const { PrismaClient } = await import('@prisma/client')
  const bcrypt = await import('bcryptjs')
  const ws = await import('ws')

  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error('DATABASE_URL is not set. Please check your .env file.')
  }

  console.log('🌱 Starting seed...')
  console.log('📦 Connecting to database...')

  // Configure WebSocket for Node.js
  neonConfig.webSocketConstructor = ws.default
  
  // Create Pool with connection string
  const pool = new Pool({ connectionString })
  
  // Pass pool config, not pool instance
  const adapter = new PrismaNeon({ connectionString })
  const prisma = new PrismaClient({ adapter })

  try {
    // Create test user
    console.log('Creating test user...')
    
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@test.com' },
    })

    let testUser
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('12345678', 10)
      
      testUser = await prisma.user.create({
        data: {
          email: 'test@test.com',
          name: 'Test Admin',
          role: 'ADMIN',
          emailVerified: true,
        },
      })

      await prisma.account.create({
        data: {
          userId: testUser.id,
          providerId: 'credential',
          accountId: testUser.id,
          password: hashedPassword,
        },
      })

      console.log('✅ Test user created: test@test.com / 12345678')
    } else {
      testUser = existingUser
      console.log('ℹ️  Test user already exists')
    }

    // Clean existing data
    console.log('Cleaning existing data...')
    await prisma.notification.deleteMany()
    await prisma.complaint.deleteMany()
    await prisma.financeLog.deleteMany()
    await prisma.payment.deleteMany()
    await prisma.aMCContract.deleteMany()
    await prisma.service.deleteMany()
    await prisma.customer.deleteMany()

    // Create customers
    console.log('Creating customers...')
    const customers = await Promise.all([
      prisma.customer.create({
        data: {
          name: 'Rahul Sharma',
          phone: '+919876543210',
          email: 'rahul.sharma@example.com',
          address: 'B-402, Galaxy Heights, Andheri West, Mumbai - 400053',
        },
      }),
      prisma.customer.create({
        data: {
          name: 'Priya Patel',
          phone: '+919898989898',
          email: 'priya.p@example.com',
          address: '12, Ambika Bunglows, Satellite, Ahmedabad - 380015',
        },
      }),
      prisma.customer.create({
        data: {
          name: 'Amit Kumar',
          phone: '+917654321098',
          email: 'amit.k@example.com',
          address: 'Flat 101, Shanti Niketan, Dwarka Sector 7, Delhi - 110077',
        },
      }),
      prisma.customer.create({
        data: {
          name: 'Sneha Gupta',
          phone: '+918765432109',
          email: 'sneha.g@example.com',
          address: 'C-20, Green Park Layout, Koramangala, Bangalore - 560034',
        },
      }),
      prisma.customer.create({
        data: {
          name: 'Vikram Singh',
          phone: '+919123456789',
          email: 'vikram.s@example.com',
          address: '45, Model Town, Ludhiana, Punjab - 141002',
        },
      }),
    ])
    console.log(`✅ Created ${customers.length} customers`)

    // Create services
    console.log('Creating services...')
    const services = await Promise.all([
      prisma.service.create({
        data: {
          customerId: customers[0].id,
          serviceType: 'RO Water Purifier - Aquaguard',
          installationDate: new Date('2024-01-15'),
        },
      }),
      prisma.service.create({
        data: {
          customerId: customers[0].id,
          serviceType: 'UV Water Filter',
          installationDate: new Date('2024-02-20'),
        },
      }),
      prisma.service.create({
        data: {
          customerId: customers[1].id,
          serviceType: 'RO Water Purifier - Kent',
          installationDate: new Date('2023-12-10'),
        },
      }),
      prisma.service.create({
        data: {
          customerId: customers[2].id,
          serviceType: 'Industrial RO Plant',
          installationDate: new Date('2023-11-05'),
        },
      }),
      prisma.service.create({
        data: {
          customerId: customers[3].id,
          serviceType: 'RO Water Purifier - Livpure',
          installationDate: new Date('2024-02-01'),
        },
      }),
    ])
    console.log(`✅ Created ${services.length} services`)

    // Create AMC contracts
    console.log('Creating AMC contracts...')
    const now = new Date()
    const oneYearLater = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())
    const threeMonthsLater = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate())
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())

    const amcs = await Promise.all([
      prisma.aMCContract.create({
        data: {
          customerId: customers[0].id,
          serviceId: services[0].id,
          startDate: new Date('2024-01-15'),
          endDate: oneYearLater,
          renewalDate: new Date(oneYearLater.getTime() - 30 * 24 * 60 * 60 * 1000),
          amount: 4500,
          status: 'ACTIVE',
        },
      }),
      prisma.aMCContract.create({
        data: {
          customerId: customers[1].id,
          serviceId: services[2].id,
          startDate: new Date('2023-12-10'),
          endDate: threeMonthsLater,
          renewalDate: new Date(threeMonthsLater.getTime() - 30 * 24 * 60 * 60 * 1000),
          amount: 3200,
          status: 'ACTIVE',
        },
      }),
      prisma.aMCContract.create({
        data: {
          customerId: customers[2].id,
          serviceId: services[3].id,
          startDate: new Date('2023-11-05'),
          endDate: oneMonthAgo,
          renewalDate: oneMonthAgo,
          amount: 12000,
          status: 'EXPIRED',
        },
      }),
      prisma.aMCContract.create({
        data: {
          customerId: customers[3].id,
          serviceId: services[4].id,
          startDate: new Date('2024-02-01'),
          endDate: oneYearLater,
          renewalDate: new Date(oneYearLater.getTime() - 30 * 24 * 60 * 60 * 1000),
          amount: 2800,
          status: 'ACTIVE',
        },
      }),
    ])
    console.log(`✅ Created ${amcs.length} AMC contracts`)

    // Create payments
    console.log('Creating payments...')
    await Promise.all([
      prisma.payment.create({
        data: {
          customerId: customers[0].id,
          amcId: amcs[0].id,
          amount: 4500,
          paymentMode: 'UPI',
          paymentDate: new Date('2024-01-15'),
          status: 'PAID',
        },
      }),
      prisma.payment.create({
        data: {
          customerId: customers[1].id,
          amcId: amcs[1].id,
          amount: 3200,
          paymentMode: 'CASH',
          paymentDate: null,
          status: 'PENDING',
        },
      }),
      prisma.payment.create({
        data: {
          customerId: customers[2].id,
          amcId: amcs[2].id,
          amount: 12000,
          paymentMode: 'BANK_TRANSFER',
          paymentDate: new Date('2023-11-05'),
          status: 'PAID',
        },
      }),
      prisma.payment.create({
        data: {
          customerId: customers[3].id,
          amcId: amcs[3].id,
          amount: 2800,
          paymentMode: 'CARD',
          paymentDate: new Date('2024-02-01'),
          status: 'PAID',
        },
      }),
      prisma.payment.create({
        data: {
          customerId: customers[4].id,
          amount: 1500,
          paymentMode: 'UPI',
          paymentDate: new Date(),
          status: 'PAID',
        },
      }),
    ])
    console.log('✅ Created 5 payments')

    // Create complaints
    console.log('Creating complaints...')
    await Promise.all([
      prisma.complaint.create({
        data: {
          customerId: customers[0].id,
          serviceId: services[0].id,
          description: 'Water flow is very slow since yesterday morning. Need urgent service.',
          status: 'OPEN',
        },
      }),
      prisma.complaint.create({
        data: {
          customerId: customers[1].id,
          serviceId: services[2].id,
          description: 'Regular filter cleanup and maintenance due.',
          status: 'IN_PROGRESS',
          technicianId: testUser.id,
        },
      }),
      prisma.complaint.create({
        data: {
          customerId: customers[2].id,
          serviceId: services[3].id,
          description: 'Water leaking from the bottom unit. Fixed successfully.',
          status: 'RESOLVED',
          technicianId: testUser.id,
        },
      }),
    ])
    console.log('✅ Created 3 complaints')

    // Create notifications
    console.log('Creating notifications...')
    await prisma.notification.createMany({
      data: [
        {
          customerId: customers[0].id,
          type: 'COMPLAINT_UPDATE',
          message: 'Your complaint has been registered. Our team will contact you soon.',
        },
        {
          customerId: customers[1].id,
          type: 'PAYMENT_DUE',
          message: 'Payment of ₹3,200 is pending for your AMC contract.',
        },
        {
          customerId: customers[2].id,
          type: 'AMC_RENEWAL',
          message: 'Your AMC contract has expired. Renew now to continue services.',
        },
      ],
    })
    console.log('✅ Created notifications')

    console.log('\n🎉 Seed completed successfully!')
    console.log('\n📧 Test Login: test@test.com / 12345678')

    await pool.end()
    await prisma.$disconnect()
  } catch (error) {
    console.error('❌ Seed failed:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

main()
