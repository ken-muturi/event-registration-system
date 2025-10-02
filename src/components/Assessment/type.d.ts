import { Prisma } from "@prisma/client";

export type SectionWithRelations = Prisma.SectionGetPayload<{
  include: { units: { include: { questions: true } } };
}>;

export type AssementAnswer = {
  answer: string;
  dataEntryNumber: string;
  questionId: string;
};