import { Box } from "@chakra-ui/react";
import { getSections } from "@/services/Sections";
import { getQuestionnaireById } from "@/services/Questionnaires";
import { Questionnaire } from "@prisma/client";
import { SectionWithRelations } from "@/components/Builder/Sections/type";
import Sections from "@/components/Builder/Sections/Details";

async function getQuestionnaireSections(questionnaireId: string) {
  try {
    const [sections, questionnaire] = await Promise.all([
      getSections({ questionnaireId }, true),
      getQuestionnaireById(questionnaireId, false),
    ]);
    return { sections, questionnaire };
  } catch (error) {
    if (error instanceof Error) {
      return `Error: ${error.message}`;
    }
    return "An unknown error occurred";
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getQuestionnaireSections(id);
  if (typeof data === "string") {
    return <Box>{data}</Box>;
  }
  const { sections, questionnaire } = data;
  return (
    <Sections
      sections={sections as SectionWithRelations[]}
      questionnaire={questionnaire as Questionnaire}
    />
  );
};
