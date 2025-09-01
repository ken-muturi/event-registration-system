import { prisma } from '@/db'
import { Prisma, RegistrationStatus } from '@prisma/client'

export interface CreateRegistrationData {
  title: string
  firstName: string
  lastName: string
  email: string
  affiliation: string
  position: string
  country: string
  phoneNo: string
  passportNumber: string
  passportExpiryDate: Date
  departureCity: string
  passportPhotoUrl?: string
  dietaryRequirements?: string
  eventId: string
}

export class RegistrationService {
  static async createRegistration(data: CreateRegistrationData) {
    // Check if event has capacity
    const event = await prisma.event.findUnique({
      where: { id: data.eventId },
      include: {
        _count: {
          select: {
            registrations: true
          }
        }
      }
    })

    if (!event) {
      throw new Error('Event not found')
    }

    if (event._count.registrations >= event.capacity) {
      throw new Error('Event is full')
    }

    // Check for duplicate email or passport
    const existingRegistration = await prisma.registration.findFirst({
      where: {
        OR: [
          { email: data.email },
          { passportNumber: data.passportNumber }
        ],
        eventId: data.eventId
      }
    })

    if (existingRegistration) {
      throw new Error('Registration already exists with this email or passport number')
    }

    return prisma.registration.create({
      data: {
        ...data,
        status: 'CONFIRMED'
      },
      include: {
        event: true
      }
    })
  }

  static async getRegistrationsByEvent(eventId: string) {
    return prisma.registration.findMany({
      where: { eventId },
      include: {
        event: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  static async getRegistrationById(id: string) {
    return prisma.registration.findUnique({
      where: { id },
      include: {
        event: true
      }
    })
  }

  static async updateRegistrationStatus(id: string, status: RegistrationStatus) {
    return prisma.registration.update({
      where: { id },
      data: { status },
      include: {
        event: true
      }
    })
  }

  static async deleteRegistration(id: string) {
    return prisma.registration.delete({
      where: { id }
    })
  }

  static async getAllRegistrations() {
    return prisma.registration.findMany({
      include: {
        event: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }
}
