// prisma/seed.ts
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
      title: 'Mr',
      firstName: 'James',
      lastName: 'Chen',
      email: 'j.chen@innovatetech.com',
      affiliation: 'InnovateTech Solutions',
      position: 'Senior Software Engineer',
      country: 'Canada',
      phoneNo: '+1-416-555-0234',
      passportNumber: 'CA987654321',
      passportExpiryDate: new Date('2027-08-20'),
      departureCity: 'Toronto, Canada',
      dietaryRequirements: '',
      status: RegistrationStatus.CONFIRMED,
      eventId: createdEvents[0].id
    },
    {
      title: 'Ms',
      firstName: 'Priya',
      lastName: 'Sharma',
      email: 'priya.sharma@globaltech.in',
      affiliation: 'Global Tech India',
      position: 'Product Manager',
      country: 'India',
      phoneNo: '+91-98765-43210',
      passportNumber: 'IN456789123',
      passportExpiryDate: new Date('2026-12-10'),
      departureCity: 'Mumbai, India',
      dietaryRequirements: 'Vegan, No nuts',
      status: RegistrationStatus.PENDING,
      eventId: createdEvents[0].id
    },

    // Health Summit registrations
    {
      title: 'Prof',
      firstName: 'Michael',
      lastName: 'Anderson',
      email: 'm.anderson@medschool.edu',
      affiliation: 'Harvard Medical School',
      position: 'Professor of Medicine',
      country: 'USA',
      phoneNo: '+1-617-555-0345',
      passportNumber: 'US234567890',
      passportExpiryDate: new Date('2029-01-25'),
      departureCity: 'Boston, USA',
      dietaryRequirements: 'Gluten-free',
      status: RegistrationStatus.CONFIRMED,
      eventId: createdEvents[1].id
    },
    {
      title: 'Dr',
      firstName: 'Emma',
      lastName: 'Thompson',
      email: 'e.thompson@nhs.uk',
      affiliation: 'National Health Service',
      position: 'Chief Medical Officer',
      country: 'UK',
      phoneNo: '+44-20-7946-0958',
      passportNumber: 'GB345678901',
      passportExpiryDate: new Date('2027-06-30'),
      departureCity: 'London, UK',
      dietaryRequirements: '',
      status: RegistrationStatus.CONFIRMED,
      eventId: createdEvents[1].id
    },
    {
      title: 'Dr',
      firstName: 'Hans',
      lastName: 'Mueller',
      email: 'h.mueller@charite.de',
      affiliation: 'Charité University Hospital',
      position: 'Head of Cardiology',
      country: 'Germany',
      phoneNo: '+49-30-450-560-000',
      passportNumber: 'DE456789012',
      passportExpiryDate: new Date('2028-09-15'),
      departureCity: 'Berlin, Germany',
      dietaryRequirements: 'Lactose intolerant',
      status: RegistrationStatus.CONFIRMED,
      eventId: createdEvents[1].id
    },

    // Energy Symposium registrations
    {
      title: 'Ms',
      firstName: 'Anna',
      lastName: 'Nielsen',
      email: 'a.nielsen@greentech.dk',
      affiliation: 'GreenTech Denmark',
      position: 'Sustainability Director',
      country: 'Denmark',
      phoneNo: '+45-33-12-34-56',
      passportNumber: 'DK567890123',
      passportExpiryDate: new Date('2027-11-20'),
      departureCity: 'Copenhagen, Denmark',
      dietaryRequirements: 'Organic food preferred',
      status: RegistrationStatus.CONFIRMED,
      eventId: createdEvents[2].id
    },
    {
      title: 'Mr',
      firstName: 'Erik',
      lastName: 'Larsson',
      email: 'e.larsson@renewableenergy.se',
      affiliation: 'Swedish Renewable Energy',
      position: 'Wind Energy Specialist',
      country: 'Sweden',
      phoneNo: '+46-8-123-456-78',
      passportNumber: 'SE678901234',
      passportExpiryDate: new Date('2026-04-18'),
      departureCity: 'Stockholm, Sweden',
      dietaryRequirements: '',
      status: RegistrationStatus.PENDING,
      eventId: createdEvents[2].id
    },

    // Finance Forum registrations
    {
      title: 'Mr',
      firstName: 'Robert',
      lastName: 'Williams',
      email: 'r.williams@cryptobank.com',
      affiliation: 'CryptoBank International',
      position: 'Head of Digital Assets',
      country: 'UK',
      phoneNo: '+44-20-7123-4567',
      passportNumber: 'GB789012345',
      passportExpiryDate: new Date('2028-07-12'),
      departureCity: 'London, UK',
      dietaryRequirements: '',
      status: RegistrationStatus.CONFIRMED,
      eventId: createdEvents[3].id
    },
    {
      title: 'Ms',
      firstName: 'Lisa',
      lastName: 'Zhang',
      email: 'l.zhang@fintech.sg',
      affiliation: 'Singapore FinTech Association',
      position: 'Blockchain Developer',
      country: 'Singapore',
      phoneNo: '+65-6123-4567',
      passportNumber: 'SG890123456',
      passportExpiryDate: new Date('2027-02-28'),
      departureCity: 'Singapore',
      dietaryRequirements: 'Halal',
      status: RegistrationStatus.CONFIRMED,
      eventId: createdEvents[3].id
    },

    // AI Workshop registrations
    {
      title: 'Dr',
      firstName: 'David',
      lastName: 'Kim',
      email: 'd.kim@airesearch.kr',
      affiliation: 'Korea Advanced Institute of Technology',
      position: 'AI Research Scientist',
      country: 'South Korea',
      phoneNo: '+82-2-123-4567',
      passportNumber: 'KR901234567',
      passportExpiryDate: new Date('2026-10-05'),
      departureCity: 'Seoul, South Korea',
      dietaryRequirements: '',
      status: RegistrationStatus.CONFIRMED,
      eventId: createdEvents[4].id
    },
    {
      title: 'Ms',
      firstName: 'Maria',
      lastName: 'Rodriguez',
      email: 'm.rodriguez@mltech.es',
      affiliation: 'Barcelona Machine Learning Lab',
      position: 'Data Scientist',
      country: 'Spain',
      phoneNo: '+34-93-123-4567',
      passportNumber: 'ES012345678',
      passportExpiryDate: new Date('2028-05-22'),
      departureCity: 'Barcelona, Spain',
      dietaryRequirements: 'Vegetarian, no seafood',
      status: RegistrationStatus.PENDING,
      eventId: createdEvents[4].id
    },

    // Education Conference registrations
    {
      title: 'Prof',
      firstName: 'Catherine',
      lastName: 'Dubois',
      email: 'c.dubois@sorbonne.fr',
      affiliation: 'Sorbonne University',
      position: 'Dean of Education',
      country: 'France',
      phoneNo: '+33-1-40-46-28-00',
      passportNumber: 'FR123456789',
      passportExpiryDate: new Date('2027-12-31'),
      departureCity: 'Paris, France',
      dietaryRequirements: '',
      status: RegistrationStatus.CONFIRMED,
      eventId: createdEvents[5].id
    },
    {
      title: 'Mr',
      firstName: 'Ahmed',
      lastName: 'Hassan',
      email: 'a.hassan@auc.edu.eg',
      affiliation: 'American University in Cairo',
      position: 'Education Technology Director',
      country: 'Egypt',
      phoneNo: '+20-2-2615-1000',
      passportNumber: 'EG234567890',
      passportExpiryDate: new Date('2026-08-14'),
      departureCity: 'Cairo, Egypt',
      dietaryRequirements: 'Halal, no alcohol',
      status: RegistrationStatus.CONFIRMED,
      eventId: createdEvents[5].id
    },
    {
      title: 'Mrs',
      firstName: 'Jennifer',
      lastName: 'Brown',
      email: 'j.brown@education.gov.au',
      affiliation: 'Australian Department of Education',
      position: 'Senior Policy Advisor',
      country: 'Australia',
      phoneNo: '+61-2-6240-8111',
      passportNumber: 'AU345678901',
      passportExpiryDate: new Date('2028-11-08'),
      departureCity: 'Sydney, Australia',
      dietaryRequirements: 'Gluten-free',
      status: RegistrationStatus.PENDING,
      eventId: createdEvents[5].id
    }
  ]

  // Create registrations
  let registrationCount = 0
  for (const regData of sampleRegistrations) {
    try {
      const registration = await prisma.registration.create({
        data: regData
      })
      registrationCount++
      console.log(`✅ Created registration: ${registration.firstName} ${registration.lastName} for ${createdEvents.find(e => e.id === registration.eventId)?.title}`)
    } catch (error) {
      console.error(`❌ Failed to create registration for ${regData.firstName} ${regData.lastName}:`, error)
    }
  }

  // Display summary
  console.log('\n📊 SEEDING SUMMARY')
  console.log('==================')
  console.log(`✅ Events created: ${createdEvents.length}`)
  console.log(`✅ Registrations created: ${registrationCount}`)
  
  console.log('\n📅 EVENTS OVERVIEW')
  console.log('==================')
  for (const event of createdEvents) {
    const regCount = sampleRegistrations.filter(r => r.eventId === event.id).length
    const availableSpots = event.capacity - regCount
    console.log(`📍 ${event.title}`)
    console.log(`   📅 ${event.date.toLocaleDateString()}`)
    console.log(`   📍 ${event.location}`)
    console.log(`   👥 ${regCount}/${event.capacity} registered (${availableSpots} spots available)`)
    console.log(`   💰 ${event.price}`)
    console.log('')
  }

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })