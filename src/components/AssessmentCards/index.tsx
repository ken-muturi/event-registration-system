"use client";
import { useUX } from "@/context/UXContext";
import {
  Box,
  Button,
  HStack,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Questionnaire } from "@prisma/client";
import React from "react";
import { dictionary } from "./dictionary";
import { useSession } from "next-auth/react";
import { ucwords } from "@/utils/util";
type QuestionAssessed = {
  id: string;
  isAssessed: boolean;
};
type AssessmentProps = {
  assessments: Questionnaire[];
  selfAssessmentStatus?: QuestionAssessed[];
  auditorAssessmentStatus?: QuestionAssessed[];
};
const Assessments = ({
  assessments,
  selfAssessmentStatus = [],
  auditorAssessmentStatus = [],
}: AssessmentProps) => {
  const { translate } = useUX();
  const { data: session } = useSession();
  const user = session ? session?.user : undefined;
  return (
    <VStack gap={4} p={4} alignItems="left" w="full">
      <SimpleGrid gap={4} columns={{ base: 1, md: 2, lg: 3 }}>
        {assessments.map((questionnaire) => {
          const isSelfAssessed = selfAssessmentStatus.find(
            (q) => q.id === questionnaire.id
          )?.isAssessed;

          const isAudited = auditorAssessmentStatus.find(
            (q) => q.id === questionnaire.id
          )?.isAssessed;

          return (
            <VStack
              alignContent="stretch"
              gap={2}
              alignItems="left"
              minH="150px"
              key={questionnaire.id}
              borderRadius="lg"
              borderWidth="1px"
              borderColor="gray.200"
              p={4}
            >
              <Text fontWeight="bold">
                {ucwords(
                  translate(
                    questionnaire.title as PrismaJson.PartialTranslation[]
                  )
                )}
              </Text>
              <Text color="gray.400" fontSize="sm">
                {questionnaire.description
                  ? translate(
                      questionnaire.description as PrismaJson.PartialTranslation[]
                    )
                  : "No description provided"}
              </Text>
              <HStack w="full" fontSize="xs">
                <Box>{translate(dictionary.completed)}:</Box>
                <Box flex="1" h="5px" bg="gray.400">
                  <Box
                    bg="orange.50"
                    h="5px"
                    w={`${Math.floor(Math.random() * (100 - 10 + 1)) + 10}px`}
                  />
                </Box>
              </HStack>
              <HStack
                w="full"
                fontSize="xs"
                bg="warchild.black.900"
                p={4}
                borderRadius="md"
              >
                {user && ["admin"].includes(user.role) && (
                  <>
                    <Button
                      size="xs"
                      bg="gray.700"
                      color="warchild.sand.default"
                      _hover={{ bg: "gray.600" }}
                      as="a"
                      // href={`/assessments/${questionnaire.id}/quiz`}
                    >
                      {translate(dictionary.preview)}
                    </Button>
                    <Button
                      size="xs"
                      bg="gray.700"
                      color="warchild.sand.default"
                      _hover={{ bg: "gray.600" }}
                      as="a"
                      // href={`/assessment-ratings/${questionnaire.id}`}
                    >
                      {translate(dictionary.reports)}
                    </Button>
                  </>
                )}

                {user && ["auditor"].includes(user.role) && !isAudited && (
                  <Button
                    size="xs"
                    bg="gray.700"
                    color="warchild.sand.default"
                    _hover={{ bg: "gray.600" }}
                    as="a"
                    // href={`/assessments/${questionnaire.id}/audit`}
                  >
                    Audit
                  </Button>
                )}

                {user && ["user", "ngo"].includes(user.role) && (
                  <>
                    {!isSelfAssessed && (
                      <Button
                        size="xs"
                        bg="gray.700"
                        color="warchild.sand.default"
                        _hover={{ bg: "gray.600" }}
                        as="a"
                        // href={`/assessments/${questionnaire.id}/quiz`}
                      >
                        {translate(dictionary.assessment)}
                      </Button>
                    )}
                    <Button
                      size="xs"
                      bg="gray.700"
                      color="warchild.sand.default"
                      _hover={{ bg: "gray.600" }}
                      as="a"
                      // href={`/assessments/${questionnaire.id}/report`}
                    >
                      Report
                    </Button>
                  </>
                )}
              </HStack>
            </VStack>
          );
        })}
      </SimpleGrid>
    </VStack>
  );
};

export default Assessments;
