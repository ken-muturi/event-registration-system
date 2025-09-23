import { Box } from "@chakra-ui/react";

import GenericPage from "@/components/Generic/Page";
import { getQuestionnaires } from "@/services/Questionnaires";
import Assessments from "@/components/AssessmentCards";
import { Questionnaire } from "@prisma/client";
import { dictionary } from "@/components/AssessmentCards/dictionary";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@/app/auth";
import { getQuestionnairePermissions } from "@/services/QuestionnairePermissions";
import { getScores } from "@/services/Score";
import { getUnits } from "@/services/Units";
import { uniq } from "lodash";
type QuestionAssessed = {
  id: string;
  isAssessed: boolean;
};

async function getReportDetails(
  isAdmin: boolean = false,
  userId: string = "",
  organizationId: string = ""
) {
  try {
    if (userId === "") {
      return "You must be logged in to view assessments.";
    }
    let where = {};
    let questionnairesSelfAssessed: QuestionAssessed[] = [];
    const questionnairesAuditorAssessed: QuestionAssessed[] = [];
    if (!isAdmin) {
      const permissions = await getQuestionnairePermissions({ userId });
      if (permissions.length === 0) {
        return "You do not have access to any assessments.";
      }
      const questionnaireIds = permissions.map((p) => p.questionnaireId);
      where = {
        id: {
          in: questionnaireIds,
        },
      };
      const [scores, units] = await Promise.all([
        getScores({
          organizationId: organizationId,
          type: "SELF",
          unit: {
            section: {
              questionnaireId: {
                in: questionnaireIds,
              },
            },
          },
        }),
        getUnits(
          { section: { questionnaireId: { in: questionnaireIds } } },
          true
        ),
      ]);
      // console.log({ questionnaireIds, scores, units });

      const unitIds = units.map((u) => u.id);
      const scoreUnitSelfIds = scores
        .filter((sc) => sc.type === "SELF")
        .map((sc) => sc.unitId);
      // const scoreUnitAuditIds = scores
      //   .filter((sc) => sc.type === "AUDITOR")
      //   .map((sc) => sc.unitId);

      const missingSelfUnits = unitIds.filter(
        (unitId) => !scoreUnitSelfIds.includes(unitId)
      );
      // const missingAuditUnits = unitIds.filter(
      //   (unitId) => !scoreUnitAuditIds.includes(unitId)
      // );
      if (scoreUnitSelfIds.length > 0) {
        const notFinishedQuestionnaires = uniq(
          units
            .filter((u) => missingSelfUnits.includes(u.id))
            .map((u) => u.section.questionnaireId)
        );

        questionnairesSelfAssessed = questionnaireIds.map((q) => ({
          id: q,
          isAssessed: !notFinishedQuestionnaires.includes(q),
        }));
      } else {
        questionnairesSelfAssessed = questionnaireIds.map((q) => ({
          id: q,
          isAssessed: false,
        }));
      }

      // if (missingAuditUnits.length > 0) {
      //   questionnairesAuditorAssessed = uniq(
      //     units.map((u) => ({
      //       id: u.section.questionnaireId,
      //       isAssessed: missingAuditUnits.includes(u.id),
      //     }))
      //   );
      // } else {
      //   questionnairesAuditorAssessed = questionnaireIds.map((q) => ({
      //     id: q,
      //     isAssessed: true,
      //   }));
      // }
    }
    const [questionnaires] = await Promise.all([getQuestionnaires(where)]);

    return {
      questionnaires,
      questionnairesSelfAssessed,
      questionnairesAuditorAssessed,
    };
  } catch (error) {
    if (error instanceof Error) {
      return `Error: ${error.message}`;
    }
    return "An unknown error occurred";
  }
}

export default async function Page() {
  const session = await getServerSession(AuthOptions);
  const userId = session?.user.id || "";
  const isAdmin =
    session?.user && ["admin", "superadmin"].includes(session?.user.role);
  const data = await getReportDetails(isAdmin, userId);
  if (typeof data === "string") {
    return (
      <GenericPage title={dictionary.error}>
        <Box>{data}</Box>
      </GenericPage>
    );
  }
  const {
    questionnaires,
    questionnairesSelfAssessed,
    questionnairesAuditorAssessed,
  } = data;
  console.log({ questionnairesSelfAssessed });
  return (
    <GenericPage title={dictionary.assessments}>
      <Assessments
        assessments={questionnaires as Questionnaire[]}
        selfAssessmentStatus={questionnairesSelfAssessed}
        auditorAssessmentStatus={questionnairesAuditorAssessed}
      />
    </GenericPage>
  );
};
