import { Prisma } from "@prisma/client";

export type SectionWithRelations = Prisma.SectionGetPayload<{
  include: { units: { include: { questions: true } } };
}>;

export type AssementAnswer = {
  answer: string;
  organizationId: string;
  type: AnswerScoreType;
  // sectionId: string
  // unitId: string
  questionId: string;
  createdBy: string;
  type: string;
};