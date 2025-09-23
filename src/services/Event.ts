/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import prisma from "@/db";

export const getEvents = async (
  whereClause?: Record<string, any>,
  includeRegistrations = false
) => {
  const where = whereClause ? whereClause : {};
  const include = includeRegistrations
    ? { registrations: true }
    : {
        _count: {
          select: {
            registrations: true,
          },
        },
      };
  try {
    return await prisma.event.findMany({
      where: { deletedAt: null, ...where },
      include,
      orderBy: {
        title: "asc",
      },
    });
  } catch (error) {
    console.error("Error getting event:", error);
    throw error;
  }
};

export const getEventById = async (
  id: string,
  includeRegistrations = false
) => {
  try {
    const include = includeRegistrations ? { registrations: true } : {};
    return prisma.event.findUnique({
      include,
      where: { id, deletedAt: null },
    });
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

export const createEvent = async (data: any) => {
  try {
    return await prisma.event.create({
      data,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

export const updateEvent = async (id: string, data: any) => {
  try {
    return prisma.event.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

export const deleteEvent = async (id: string) => {
  try {
    return prisma.event.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

export const restoreEvent = async (id: string) => {
  try {
    return prisma.event.update({
      where: { id },
      data: {
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};
