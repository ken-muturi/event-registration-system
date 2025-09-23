'use client';

import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import FullPageLoader from "@/components/Generic/FullPageLoader";
import {
  Text,
  Accordion,
  Box,
  Button,
  VStack,
  IconButton,
  HStack,
  createToaster,
  Toaster,
} from "@chakra-ui/react";
import { FaEdit, FaPlus, FaTimes, FaChevronDown } from "react-icons/fa";
import { SectionWithRelations } from "../type";
import Modal from "@/components/Generic/Modal";
import Form from "../Form";
import { useUX } from "@/context/UXContext";
import { dictionary } from "../dictionary";
import { deleteSection, getSections } from "@/services/Sections";
import Units from "@/components/Builder/Units"; // TODO: Add missing Units component
import { Questionnaire } from "@prisma/client";
import { range } from "lodash";
import { ucwords } from "@/utils/util";
import { handleReturnError } from "@/db/error-handling";

const toaster = createToaster({
  placement: "top",
});

const Details = ({
  questionnaire,
  sections,
}: {
  questionnaire: Questionnaire;
  sections: SectionWithRelations[];
}) => {
  const queryClient = useQueryClient();
  const { translate } = useUX();
  // Note: useToast is not available in Chakra UI v3 - consider using alternative notification system

  const { data, isLoading } = useQuery({
    queryKey: ["sections"],
    queryFn: async () => {
      return (await getSections(
        { questionnaireId: questionnaire.id },
        true
      )) as SectionWithRelations[];
    },
    placeholderData: sections,
  });

  const handleDeleteSection = async (sectionId: string) => {
    try {
      await deleteSection(sectionId);
      await queryClient.refetchQueries({ queryKey: ["sections"] });
      toaster.create({
        title: translate(dictionary.success),
        type: "success",
        duration: 5000,
      });
    } catch (error) {
      const message = handleReturnError(error);
      toaster.create({
        title: translate(dictionary.error),
        description: message,
        type: "error", 
        duration: 5000,
      });
    }
  };

  return (
    <>
      {isLoading && <FullPageLoader />}
      {!isLoading && (
        <VStack gap={2} alignItems="left">
          <Text fontSize="3xl" fontWeight="bold" color="orange.50">
            {ucwords(
              translate(questionnaire.title as PrismaJson.PartialTranslation[])
            )}
          </Text>
          <Text fontSize="md" borderBottomWidth="thin" pb={1}>
            {translate(
              questionnaire.description as PrismaJson.PartialTranslation[]
            )}
          </Text>

          <Accordion.Root
            multiple
            defaultValue={range(0, sections.length + 1).map(i => i.toString())}
          >
            {(data || []).map((section, index) => (
              <Accordion.Item key={section.id} value={section.id} mb={2}>
                <HStack
                  bg="gray.100"
                  _expanded={{
                    bg: "warchild.sand.default",
                    borderRadius: "lg",
                  }}
                  px={2}
                >
                  <Accordion.ItemTrigger p={1}>
                    <Box flex="1" textAlign="left">
                      {translate(dictionary.section)} {index + 1}:{" "}
                      {translate(
                        section.title as PrismaJson.PartialTranslation[]
                      )}
                    </Box>
                  </Accordion.ItemTrigger>
                  <Modal
                    title={translate(dictionary.editSection)}
                    size="lg"
                    vh="60vh"
                    mainContent={<Form section={section} />}
                  >
                    <IconButton
                      variant="ghost"
                      size="xs"
                      aria-label={translate(dictionary.editSection)}
                    >
                      <FaEdit />
                    </IconButton>
                  </Modal>
                  <IconButton
                    variant="ghost"
                    disabled={section.units && section.units.length > 0}
                    size="xs"
                    aria-label={translate(dictionary.deleteSection)}
                    onClick={async () => {
                      await handleDeleteSection(section.id);
                    }}
                  >
                    <FaTimes />
                  </IconButton>
                  <Accordion.ItemIndicator>
                    <FaChevronDown />
                  </Accordion.ItemIndicator>
                </HStack>
                <Accordion.ItemContent pb={4}>
                  <Box fontStyle="italic" fontWeight="300" mb={2} fontSize="xs">
                    {translate(
                      section.description as PrismaJson.PartialTranslation[]
                    )}
                  </Box>
                  <Units units={section.units || []} sectionId={section.id} />
                  <Text fontSize="sm" color="gray.500">Units component not available</Text>
                </Accordion.ItemContent>
              </Accordion.Item>
            ))}
          </Accordion.Root>

          <Modal
            title={translate(dictionary.addSection)}
            size="lg"
            vh="60vh"
            mainContent={<Form />}
          >
            <Button
              variant="outline"
              size="xs"
              color="orange.50"
            >
              <FaPlus />
              {translate(dictionary.addSection)}
            </Button>
          </Modal>
        </VStack>
      )}
      <Toaster toaster={toaster}>
        {(toast) => (
          <Box
            key={toast.id}
            p={4}
            bg={toast.type === "success" ? "green.500" : "red.500"}
            color="white"
            borderRadius="md"
            boxShadow="lg"
          >
            <Text fontWeight="bold">{toast.title}</Text>
            {toast.description && <Text>{toast.description}</Text>}
          </Box>
        )}
      </Toaster>
    </>
  );
};

export default Details;