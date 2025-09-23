/* eslint-disable @typescript-eslint/no-explicit-any */

import { PrismaClient, RegistrationStatus } from '@prisma/client'
import { faker } from '@faker-js/faker'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Configuration
const CONFIG = {
  ROLES_COUNT: 4,
  USERS_COUNT: 20,
  EVENTS_COUNT: 10,
  REGISTRATIONS_PER_EVENT: 15,
}

// Predefined roles
const ROLES = [
  {
    title: 'Admin',
    description: 'System Administrator with full access'
  },
  {
    title: 'Event Manager',
    description: 'Can create and manage events'
  },
  {
    title: 'User',
    description: 'Regular user with basic access'
  },
  {
    title: 'Moderator',
    description: 'Can moderate content and users'
  }
]

// Event categories
const EVENT_CATEGORIES = [
  'Technology',
  'Healthcare',
  'Environment',
  'Finance',
  'Education',
  'Business',
  'Science',
  'Arts & Culture',
  'Sports',
  'Entertainment'
]

// Registration titles
const TITLES = ['Mr', 'Mrs', 'Ms', 'Dr', 'Prof', 'Rev']

async function clearDatabase() {
  console.log('🗑️ Clearing existing data...')
  
  // Delete in order of dependencies
  await prisma.registration.deleteMany()
  await prisma.event.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()
  await prisma.role.deleteMany()
  
  console.log('✅ Database cleared')
}

async function seedRoles() {
  console.log('🔑 Seeding roles...')
  
  const roles = await prisma.role.createMany({
    data: ROLES.map(role => ({
      ...role,
      createdAt: new Date(),
    })),
  })
  
  console.log(`✅ Created ${roles.count} roles`)
  return await prisma.role.findMany()
}

async function seedUsers(roles: any[]) {
  console.log('👥 Seeding users...')
  
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  // Create admin user
  const adminRole = roles.find(role => role.title === 'Admin')
  const adminUser = await prisma.user.create({
    data: {
      roleId: adminRole.id,
      email: 'admin@example.com',
      password: hashedPassword,
      firstname: 'Admin',
      othernames: 'User',
      dateOfBirth: '1990-01-01',
      gender: 'Other',
      nationalId: 'ADMIN123456789',
      phone: '+1234567890',
      nextOfKin: 'Emergency Contact',
      nextOfKinContacts: '+0987654321',
      address: faker.location.streetAddress(),
    }
  })
  
  // Create bulk users
  const usersData = []
  for (let i = 0; i < CONFIG.USERS_COUNT - 1; i++) {
    const randomRole = faker.helpers.arrayElement(roles)
    const gender = faker.helpers.arrayElement(['Male', 'Female', 'Other'])
    
    usersData.push({
      roleId: randomRole.id,
      email: faker.internet.email(),
      password: hashedPassword,
      firstname: faker.person.firstName(),
      othernames: faker.person.lastName(),
      dateOfBirth: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }).toISOString().split('T')[0],
      gender,
      nationalId: faker.string.alphanumeric(12).toUpperCase(),
      phone: faker.phone.number(),
      nextOfKin: faker.person.fullName(),
      nextOfKinContacts: faker.phone.number(),
      address: faker.location.streetAddress(),
    })
  }
  
  await prisma.user.createMany({
    data: usersData,
  })
  
  console.log(`✅ Created ${CONFIG.USERS_COUNT} users (including admin)`)
  return await prisma.user.findMany({ include: { role: true } })
}

async function seedEvents(users: any[]) {
  console.log('📅 Seeding events...')
  
  const eventsData = []
  for (let i = 0; i < CONFIG.EVENTS_COUNT; i++) {
    const eventCreator = faker.helpers.arrayElement(users)
    const startDate = faker.date.between({ 
      from: new Date(), 
      to: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // Next year
    })
    
    eventsData.push({
      title: `${faker.company.catchPhrase()} ${faker.date.recent().getFullYear()}`,
      description: faker.lorem.paragraphs(2, '\n\n'),
      date: startDate,
      location: `${faker.location.city()}, ${faker.location.country()}`,
      capacity: faker.number.int({ min: 50, max: 500 }),
      price: parseFloat(faker.commerce.price({ min: 50, max: 500 })),
      category: faker.helpers.arrayElement(EVENT_CATEGORIES),
      createdBy: eventCreator.id,
    })
  }
  
  await prisma.event.createMany({
    data: eventsData,
  })
  
  console.log(`✅ Created ${CONFIG.EVENTS_COUNT} events`)
  return await prisma.event.findMany()
}

async function seedRegistrations(events: any[]) {
  console.log('📝 Seeding registrations...')
  
  let totalRegistrations = 0
  
  for (const event of events) {
    const registrationsData = []
    const registrationCount = faker.number.int({ 
      min: Math.floor(CONFIG.REGISTRATIONS_PER_EVENT * 0.5), 
      max: Math.min(CONFIG.REGISTRATIONS_PER_EVENT, event.capacity)
    })
    
    // Generate unique emails for this event
    const usedEmails = new Set()
    const usedPassports = new Set()
    
    for (let i = 0; i < registrationCount; i++) {
      let email = faker.internet.email()
      let passportNumber = faker.string.alphanumeric(9).toUpperCase()
      
      // Ensure uniqueness within this batch
      while (usedEmails.has(email)) {
        email = faker.internet.email()
      }
      while (usedPassports.has(passportNumber)) {
        passportNumber = faker.string.alphanumeric(9).toUpperCase()
      }
      
      usedEmails.add(email)
      usedPassports.add(passportNumber)
      
      registrationsData.push({
        title: faker.helpers.arrayElement(TITLES),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email,
        affiliation: faker.company.name(),
        position: faker.person.jobTitle(),
        country: faker.location.country(),
        phoneNo: faker.phone.number(),
        passportNumber,
        passportExpiryDate: faker.date.future({ years: 5 }),
        departureCity: `${faker.location.city()}, ${faker.location.country()}`,
        dietaryRequirements: faker.helpers.maybe(() => 
          faker.helpers.arrayElement([
            'Vegetarian', 
            'Vegan', 
            'Gluten-free', 
            'Halal', 
            'Kosher',
            'No nuts',
            'Lactose-free'
          ]), 
          { probability: 0.3 }
        ),
        status: faker.helpers.arrayElement([
          RegistrationStatus.CONFIRMED,
          RegistrationStatus.CONFIRMED,
          RegistrationStatus.CONFIRMED,
          RegistrationStatus.PENDING,
          RegistrationStatus.CANCELLED
        ]), // Weighted towards CONFIRMED
        eventId: event.id,
      })
    }
    
    // Bulk insert registrations for this event
    await prisma.registration.createMany({
      data: registrationsData,
      skipDuplicates: true, // Skip any duplicates
    })
    
    totalRegistrations += registrationCount
    console.log(`  ✅ Created ${registrationCount} registrations for "${event.title}"`)
  }
  
  console.log(`✅ Created ${totalRegistrations} total registrations`)
}

async function displaySummary() {
  console.log('\n📊 SEEDING SUMMARY')
  console.log('==================')
  
  const roleCount = await prisma.role.count()
  const userCount = await prisma.user.count()
  const eventCount = await prisma.event.count()
  const registrationCount = await prisma.registration.count()
  
  console.log(`✅ Roles created: ${roleCount}`)
  console.log(`✅ Users created: ${userCount}`)
  console.log(`✅ Events created: ${eventCount}`)
  console.log(`✅ Registrations created: ${registrationCount}`)
  
  // Show events overview
  console.log('\n📅 EVENTS OVERVIEW')
  console.log('==================')
  
  const eventsWithCounts = await prisma.event.findMany({
    include: {
      _count: {
        select: {
          registrations: true
        }
      },
      creator: {
        select: {
          firstname: true,
          othernames: true,
          email: true
        }
      }
    },
    orderBy: { date: 'asc' }
  })
  
  for (const event of eventsWithCounts) {
    const availableSpots = event.capacity - event._count.registrations
    console.log(`📍 ${event.title}`)
    console.log(`   📅 ${event.date.toLocaleDateString()}`)
    console.log(`   📍 ${event.location}`)
    console.log(`   👤 Created by: ${event.creator.firstname} ${event.creator.othernames}`)
    console.log(`   👥 ${event._count.registrations}/${event.capacity} registered (${availableSpots} spots available)`)
    console.log(`   💰 $${event.price}`)
    console.log(`   🏷️ ${event.category}`)
    console.log('')
  }
  
  // Show admin credentials
  console.log('\n🔐 ADMIN CREDENTIALS')
  console.log('==================')
  console.log('Email: admin@example.com')
  console.log('Password: password123')
  console.log('')
}

async function main() {
  console.log('🌱 Starting database seeding...')
  console.log(`📊 Configuration: ${CONFIG.USERS_COUNT} users, ${CONFIG.EVENTS_COUNT} events, ~${CONFIG.REGISTRATIONS_PER_EVENT} registrations per event`)
  
  try {
    await clearDatabase()
    
    const roles = await seedRoles()
    const users = await seedUsers(roles)
    const events = await seedEvents(users)
    await seedRegistrations(events)
    
    await displaySummary()
    
    console.log('🎉 Database seeding completed successfully!')
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
