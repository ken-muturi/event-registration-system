import { Box } from "@chakra-ui/react";
import { getSections } from "@/services/Sections";
import { SectionWithRelations } from "@/components/Builder/Sections/type";
import { getQuestionnaireById } from "@/services/Questionnaires";
import {  Questionnaire } from "@prisma/client";
import Assessment from "@/components/Assessment";
import GenericPage from "@/components/Generic/Page";
import { PartialTranslation } from "@/types";
import { AssementAnswer } from "@/components/Assessment/type";
import { getAnswers } from "@/services/Answers";
import { getMAC } from "@ctrl/mac-address";

async function getQuestionnaireDetails(
  questionnaireId: string,
  dataEntryNumber: string,
) {
  try {
    const [sections, questionnaire, answers] = await Promise.all([
      getSections({ questionnaireId }, true),
      getQuestionnaireById(questionnaireId, false),
      getAnswers({ 
        dataEntryNumber,
        question: {
            unit: { section: { questionnaireId: questionnaireId } },
          }},
          false),
    ]);
    return { sections, questionnaire, answers };
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
    const macAddress = getMAC()
    const dataEntryNumber = `${id}-${macAddress}`;
    const data = await getQuestionnaireDetails(
      id,
      dataEntryNumber,
    );
  if (typeof data === "string") {
    return <Box>{data}</Box>;
  }
  const { sections, questionnaire, answers } = data;
  return (
    <GenericPage title={questionnaire?.title as PartialTranslation[]}>
      <Assessment
        sections={sections as SectionWithRelations[]}
        questionnaire={questionnaire as Questionnaire}
        answers={answers as AssementAnswer[]}
        dataEntryNumber={dataEntryNumber}
      />
    </GenericPage>
  );
};
