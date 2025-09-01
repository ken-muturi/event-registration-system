import { prisma } from '@/db'
import { Prisma } from '@prisma/client'

export class EventService {
  static async getAllEvents() {
    return prisma.event.findMany({
      include: {
        registrations: true,
        _count: {
          select: {
            registrations: true
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    })
  }

  static async getEventById(id: string) {
    return prisma.event.findUnique({
      where: { id },
      include: {
        registrations: true,
        _count: {
          select: {
            registrations: true
          }
        }
      }
    })
  }

  static async createEvent(data: Prisma.EventCreateInput) {
    return prisma.event.create({
      data,
      include: {
        registrations: true
      }
    })
  }

  static async updateEvent(id: string, data: Prisma.EventUpdateInput) {
    return prisma.event.update({
      where: { id },
      data,
      include: {
        registrations: true
      }
    })
  }

  static async deleteEvent(id: string) {
    return prisma.event.delete({
      where: { id }
    })
  }

  static async getAvailableEvents() {
    const events = await prisma.event.findMany({
      include: {
        _count: {
          select: {
            registrations: true
          }
        }
      },
      where: {
        date: {
          gte: new Date()
        }
      },
      orderBy: {
        date: 'asc'
      }
    })

    return events.filter(event => event._count.registrations < event.capacity)
  }
}