import { Box } from "@chakra-ui/react";
import { getSections } from "@/services/Sections";
import { SectionWithRelations } from "@/components/Builder/Sections/type";
import { getQuestionnaireById } from "@/services/Questionnaires";
import {  Questionnaire } from "@prisma/client";
import Assessment from "@/components/Assessment";
import GenericPage from "@/components/Generic/Page";
import { PartialTranslation } from "@/types";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@/app/auth";
import { AssementAnswer } from "@/components/Assessment/type";

async function getQuestionnaireSections(
  questionnaireId: string,
  userId: string
) {
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
  const session = await getServerSession(AuthOptions);

  const data = await getQuestionnaireSections(
    id,
    session?.user.id || ""
  );
  if (typeof data === "string") {
    return <Box>{data}</Box>;
  }
  const { sections, questionnaire } = data;
  return (
    <GenericPage title={questionnaire?.title as PartialTranslation[]}>
      <Assessment
        sections={sections as SectionWithRelations[]}
        questionnaire={questionnaire as Questionnaire}
        answers={[] as AssementAnswer[]}
        readOnly={
          session?.user.role === "superadmin" || session?.user.role === "admin"
        }
      />
    </GenericPage>
  );
};
