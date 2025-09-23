import { Box } from "@chakra-ui/react";
import { getRating } from "@/services/Score";
import OrganizationScores from "@/components/OrganizationScores";
import GenericPage from "@/components/Generic/Page";
import { Rating } from "@/components/OrganizationScores/type";
import { dictionary } from "@/components/Assessment/dictionary";

async function getAssessmentDetails(questionnaireId: string) {
  try {
    const [rating] = await Promise.all([
      getRating({
        "agg.questionnaire_id": questionnaireId,
      }),
    ]);
    return { rating };
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
  const data = await getAssessmentDetails(id);
  if (typeof data === "string") {
    return (
      <GenericPage title={dictionary.assessments}>
        <Box>{data}</Box>
      </GenericPage>
    );
  }
  const { rating } = data;
  return (
    <GenericPage title={dictionary.assessments}>
      <OrganizationScores rating={rating as Rating[]} />
    </GenericPage>
  );
}
