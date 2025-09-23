 
'use client';

import React, { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import FullPageLoader from "../Generic/FullPageLoader";
import {
  Text,
  Box,
  VStack,
  Stack,
  createToaster,
} from "@chakra-ui/react";
import { AssementAnswer, SectionWithRelations } from "./type";
import {
  type ActionMeta,
  type GroupBase,
  Select as ReactSelect,
} from "chakra-react-select";

// import { useUX } from '@/context/UXContext';
import { getSections } from "@/services/Sections";
import {  Questionnaire } from "@prisma/client";
import { DynamicForm, FieldConfig } from "@/utils/form-builder";
import { last } from "lodash";
import { handleReturnError } from "@/db/error-handling";
import { dictionary } from "./dictionary";
import { useUX } from "@/context/UXContext";
import { indexBy } from "@/utils/util";
import { useSession } from "next-auth/react";
import Menu from "./Menu";
import { UnitWithRelation } from '../Builder/Units/type';

export type Option = {
  label: string;
  sectionId: string;
  value: string;
};

const activeStyle = {
  color: "warchild.black.default",
  // fontStyle: "italic",
  // fontWeight: "bold",
};

const Assessment = ({
  questionnaire,
  sections,
  answers,
  readOnly = false,
}: {
  questionnaire: Questionnaire;
  sections: SectionWithRelations[];
  answers: AssementAnswer[];
  readOnly?: boolean;
}) => {
  const { translate } = useUX();
  const queryClient = useQueryClient();
  const toaster = createToaster({placement: "top-end"});
  const { data: session } = useSession();
  const userId = session?.user?.id || "1"; // Default to "1" if session is not available

  const [startTime, setStartTime] = useState<Date>(new Date());
  const [isSaving, setIsSaving] = useState(false);
  const [currentSection, setCurrentSection] = useState<
    SectionWithRelations | undefined
  >(undefined);
  const [currentUnit, setCurrentUnit] = useState<UnitWithRelation | undefined>(
    undefined
  );
  // const { translate } = useUX();
  const { data, isLoading } = useQuery({
    queryKey: ["sections"],
    queryFn: async () => {
      return (await getSections(
        { questionnaireId: questionnaire.id },
        true
      )) as SectionWithRelations[];
    },
    initialData: sections,
  });

  useEffect(() => {
    if (data && data.length > 0 && !currentSection) {
      setCurrentSection(data[0]);
      setCurrentUnit(data[0].units?.[0]);
    }
  }, [data, currentSection]);

  useEffect(() => {
    if (currentUnit) {
      setStartTime(new Date());
    }
  }, [currentUnit]);

  const questions =
    data
      ?.find((section) => section.id === currentSection?.id)
      ?.units?.find((unit) => unit.id === currentUnit?.id)?.questions || [];

  //   .slice() // to avoid mutating the original array
  const indexedAnswers = indexBy(answers || [], (d) => d.questionId);
  const fields = questions
    .slice()
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((question) => {
      const questionDetails = (question.details ||
        {}) as PrismaJson.QuestionDetail;
      return {
        name: question.id,
        label: translate(question.title as PrismaJson.PartialTranslation[]),
        note: questionDetails.note,
        description: translate(
          question.description as PrismaJson.PartialTranslation[]
        ),
        type: questionDetails.type,
        required: questionDetails.required,
        options: questionDetails.options,
        conditions: questionDetails.conditions,
        dynamicOptions: questionDetails.dynamicOptions,
        answer: indexedAnswers.get(question.id)?.answer || "", // Use the answer from indexedAnswers or default to empty string
      } as FieldConfig;
    });

  // check if current unit is the last unit
  // we also need to first check if the section is the last section
  const isLastSection = last(data)?.id === currentSection?.id;
  const isLastUnit =
    last(data?.find((section) => section.id === currentSection?.id)?.units)
      ?.id === currentUnit;
  const buttonText = translate(
    dictionary[isLastSection && isLastUnit ? "submit" : "next"]
  );

  const goToNextUnit = () => {
    // Find current section and unit indices
    const sectionIndex = data.findIndex(
      (section) => section.id === currentSection?.id
    );
    const currentSectionObj = data[sectionIndex];
    const currentSectionUnits = currentSectionObj.units.sort(
      (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
    );
    const unitIndex = currentSectionUnits.findIndex(
      (unit) => unit.id === currentUnit?.id
    );

    if (unitIndex < currentSectionUnits.length - 1) {
      setCurrentUnit(currentSectionUnits[unitIndex + 1]);
    } else if (sectionIndex < data.length - 1) {
      // If last unit in section, go to first unit of next section
      setCurrentSection(data[sectionIndex + 1]);
      setCurrentUnit(data[sectionIndex + 1].units[0]);
    } else {
      // Last unit of last section: handle completion (e.g., show a message)
      toaster.success({
        title: translate(dictionary.success),
        description: translate(dictionary.saveSuccess),
      });
    }
  };

  const handleSelectSectionUnit = (option: Option | undefined) => {
    if (!option) {
      setCurrentSection(undefined);
      setCurrentUnit(undefined);
      return;
    }

    const section = data?.find((s) => s.id === option.sectionId);
    const unit = section?.units.find((u) => u.id === option.value);

    if (section && unit) {
      setCurrentSection(section);
      setCurrentUnit(unit);
    }
  };
  // console.log({ currentSection, currentUnit, fields, answers });

  return (
    <>
      {(isLoading || isSaving) && <FullPageLoader />}
      {!isLoading && (
        <VStack gap={2} w="full" alignItems="left">
          <Stack
            gap={4}
            direction={{ base: "column", md: "row" }}
            w="full"
            fontSize="xs"
          >
            <VStack
              gap={2}
              alignItems="left"
              p={2}
              w="350px"
              display={{ base: "none", md: "flex" }}
            >
              {(data || []).map((section) => (
                <Box
                  key={section.id}
                  p={2}
                  borderWidth="thin"
                  borderColor="gray.200"
                  borderRadius="md"
                  bg="gray.50"
                >
                  <Text
                    fontWeight="semibold"
                    fontSize="sm"
                    color="orange.50"
                  >
                    {translate(
                      section.title as PrismaJson.PartialTranslation[]
                    )}
                  </Text>
                  <VStack gap={1} alignItems="left" p={1}>
                    {section.units
                      .slice()
                      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
                      .map((unit) => (
                        <Text
                          key={unit.id}
                          fontSize="xs"
                          fontWeight="500"
                          px={1}
                          {...(unit.id === currentUnit?.id
                            ? activeStyle
                            : { color: "gray.500" })}
                          cursor="pointer"
                          _hover={activeStyle}
                          onClick={() => {
                            setCurrentSection(section);
                            setCurrentUnit(unit);
                          }}
                        >
                          {translate(
                            unit.title as PrismaJson.PartialTranslation[]
                          )}
                        </Text>
                      ))}
                  </VStack>
                </Box>
              ))}
            </VStack>
            <Box display={{ base: "block", md: "none" }}>
              <ReactSelect<Option, true, GroupBase<Option>>
                size="sm"
                id={`select-unit`}
                instanceId={`select-unit`}
                closeMenuOnSelect
                placeholder={`--- ${translate(dictionary.selectUnit)} ---`}
                options={sections.map((s) => {
                  return {
                    label: translate(
                      s.title as PrismaJson.PartialTranslation[]
                    ).toUpperCase(),
                    options: s.units.map(
                      (u) =>
                        ({
                          value: u.id,
                          sectionId: s.id,
                          label: translate(
                            u.title as PrismaJson.PartialTranslation[]
                          ),
                        } as Option)
                    ),
                  };
                })}
                onChange={(
                  option: readonly Option[],
                  actionMeta: ActionMeta<Option>
                ) => {
                  if (
                    actionMeta?.action === "select-option" &&
                    actionMeta?.option
                  ) {
                    console.log("Selected option:", actionMeta.option);
                    handleSelectSectionUnit(actionMeta?.option);
                  }

                  if (
                    actionMeta?.action === "remove-value" &&
                    actionMeta?.removedValue?.value
                  ) {
                    handleSelectSectionUnit(undefined);
                  }
                }}
              />
            </Box>
            <VStack gap={6} w="full" alignItems="left" pr={2}>
              <Text
                fontSize={{ base: "lg", lg: "xl" }}
                textTransform="capitalize"
                fontWeight="bold"
                borderBottomWidth="thin"
                borderBottomColor="gray.200"
              >
                {translate(
                  currentSection?.title as PrismaJson.PartialTranslation[]
                )}
                &nbsp; - &nbsp;
                {translate(
                  currentUnit?.title as PrismaJson.PartialTranslation[]
                )}
              </Text>
              <DynamicForm
                isReadOnly={readOnly}
                onSubmit={()=>{}}
                buttonText={buttonText}
                fields={fields}
                translate={translate}
              />
            </VStack>
          </Stack>
        </VStack>
      )}
    </>
  );
};

export default Assessment
