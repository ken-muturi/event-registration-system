/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { AssementAnswer } from "@/components/Assessment/type"
import prisma from "@/db"
import { handleReturnError } from "@/db/error-handling"

export const getAnswers = async (whereClause?: Record<string, any>, hasChildren = false) => {
    const where = whereClause ? whereClause : {}
    const include = hasChildren ? { question: true } : {}
    try {
        return await prisma.answer.findMany({
            where,
            include
        });
    } catch (error) {
    const message = handleReturnError(error);
    console.error("Error getting model:", message);
    throw new Error(message);
    }
}

export const saveAnswers = async (data: AssementAnswer[]) => {
    try {
        await prisma.$transaction(async (tx) => {
            await tx.answer.createMany({
                data,
                skipDuplicates: true
            })
        })
    } catch (error) {
    const message = handleReturnError(error);
    console.error("Error getting model:", message);
    throw new Error(message);
    }
}