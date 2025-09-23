import { Box } from "@chakra-ui/react";
import { getSelfAuditSectionRanking } from "@/services/Score";
import { getQuestionnaireById } from "@/services/Questionnaires";
import AssessmentReport from "@/components/AssessmentReport";
import { SelfAuditSectionRanking } from "@/components/OrganizationScores/type";
import { QuestionnaireWithRelations } from "@/components/Questionnaires/type";
import GenericPage from "@/components/Generic/Page";
import { PartialTranslation } from "@/types";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@/app/auth";

async function getReportDetails(questionnaireId: string, organizationId: string) {
  try {
    const [questionnaire, ranking] = await Promise.all([
      getQuestionnaireById(questionnaireId, true),
      getSelfAuditSectionRanking({"s.organization_id": organizationId}),
    ]);
    return { questionnaire, ranking: ranking };
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
  let organizationId = "";
  if (session?.user.role !== "admin") {
    organizationId = session?.user.organizationId || "";
  }
  const data = await getReportDetails(id, organizationId);
  if (typeof data === "string") {
    return <Box>{data}</Box>;
  }
  const { questionnaire, ranking } = data;
  return (
    <GenericPage title={questionnaire?.title as PartialTranslation[]}>
      <AssessmentReport
        questionnaire={questionnaire as QuestionnaireWithRelations}
        ranking={ranking as SelfAuditSectionRanking[]}
        currentSection="overview"
      />
    </GenericPage>
  );
};
