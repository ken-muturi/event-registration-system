import { Box } from "@chakra-ui/react";
import { getSections } from "@/services/Sections";
import { SectionWithRelations } from "@/components/Sections/type";
import { getQuestionnaireById } from "@/services/Questionnaires";
import { AnswerScoreType, Organization, Questionnaire } from "@prisma/client";
import Assessment from "@/components/Assessment";
import { getAnswers } from "@/services/Answers";
import { AssementAnswer } from "@/components/Assessment/type";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@/app/auth";
import { dictionary } from "@/components/Assessment/dictionary";
import GenericPage from "@/components/Generic/Page";
import { getOrganizationById } from "@/services/Organizations";

async function getQuestionnaireSections(
  questionnaireId: string,
  organizationId: string,
  createdBy: string
) {
  try {
    const [organization, sections, questionnaire, answers] = await Promise.all([
      getOrganizationById(organizationId),
      getSections({ questionnaireId }, true),
      getQuestionnaireById(questionnaireId, false),
      getAnswers(
        {
          organizationId,
          type: AnswerScoreType.AUDITOR,
          createdBy: createdBy,
          question: {
            unit: { section: { questionnaireId } },
          },
        },
        true
      ),
    ]);
    return { organization,sections, questionnaire, answers };
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
  params: Promise<{ id: string; organizationId: string }>;
}) {
  const session = await getServerSession(AuthOptions);
  const { id, organizationId } = await params;
  const data = await getQuestionnaireSections(
    id,
    organizationId,
    session?.user?.id || "1"
  );
  if (typeof data === "string") {
    return <GenericPage title={dictionary.error}><Box>{data}</Box>;</GenericPage>
  }
  const { organization,  sections, questionnaire, answers } = data;
  return (
      <GenericPage title={dictionary.auditing}>
        <Assessment
          organization={organization as Organization}
          type={AnswerScoreType.AUDITOR}
          answers={answers as AssementAnswer[]}
          sections={sections as SectionWithRelations[]}
          questionnaire={questionnaire as Questionnaire}
        />
      </GenericPage>
  );
};
