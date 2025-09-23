import { Box } from "@chakra-ui/react";
import { getSelfAuditSectionRanking } from "@/services/Score";
import { getQuestionnaireById } from "@/services/Questionnaires";
import AssessmentReport from "@/components/AssessmentReport";
import { SelfAuditSectionRanking } from "@/components/OrganizationScores/type";
import { QuestionnaireWithRelations } from "@/components/Questionnaires/type";
import GenericPage from "@/components/Generic/Page";
import { PartialTranslation } from "@/types";
import { AnswerScoreType, Organization } from "@prisma/client";
import { getOrganizationById } from "@/services/Organizations";
// import { getServerSession } from "next-auth";
// import { AuthOptions } from "@/app/auth";

async function getReportDetails(questionnaireId: string, organizationId: string) {
  try {
    const [organization, questionnaire, ranking] = await Promise.all([
      getOrganizationById(organizationId),
      getQuestionnaireById(questionnaireId, true),
      getSelfAuditSectionRanking({ "sc.questionnaire_id": questionnaireId, "s.organization_id": organizationId }),
    ]);
    return { questionnaire, ranking, organization };
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
  const { id, organizationId } = await params;
  // const session = await getServerSession(AuthOptions);
  const data = await getReportDetails(id, organizationId);
  if (typeof data === "string") {
    return <Box>{data}</Box>;
  }
  const { questionnaire, ranking, organization } = data;
  return (
    <GenericPage title={questionnaire?.title as PartialTranslation[]}>
      <AssessmentReport
        organization={organization as Organization}
        type={AnswerScoreType.AUDITOR}
        questionnaire={questionnaire as QuestionnaireWithRelations}
        ranking={ranking as SelfAuditSectionRanking[]}
        currentSection="overview"
      />
    </GenericPage>
  );
};
