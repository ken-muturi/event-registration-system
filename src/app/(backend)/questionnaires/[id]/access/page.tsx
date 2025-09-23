import { Box } from "@chakra-ui/react";
import { getQuestionnaireById } from "@/services/Questionnaires";
import { Questionnaire } from "@prisma/client";
import QuestionnairePermissions from "@/components/QuestionnairePermissions";
import { getQuestionnairePermissions } from "@/services/QuestionnairePermissions";
import { QuestionnairePermissionWithRelation } from "@/components/QuestionnairePermissions/type";

async function getQuestionnaireDetails(questionnaireId: string) {
  try {
    const [permissions, questionnaire] = await Promise.all([
      getQuestionnairePermissions({ questionnaireId }, true),
      getQuestionnaireById(questionnaireId, false),
    ]);
    return {
      questionnaire: questionnaire as Questionnaire,
      permissions: permissions as QuestionnairePermissionWithRelation[],
    };
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
  const data = await getQuestionnaireDetails(id);
  if (typeof data === "string") {
    return <Box>{data}</Box>;
  }
  const { questionnaire, permissions } = data;
  return (
    <QuestionnairePermissions
      questionnaire={questionnaire}
      permissions={permissions}
    />
  );
}
