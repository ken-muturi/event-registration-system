'use client';

import {  useUX } from '@/context/UXContext';
import { Text as TextTranslation, PartialTranslation } from '@/types';
import { Box, Container, Text } from "@chakra-ui/react";
import React from "react";
import Footer from "../Footer";
import Navigation from "@/components/Menus/Horizontal/Menu";
type PageProps = {
  title:
    | string
    | TextTranslation
    | PartialTranslation
    | PartialTranslation[]
    | undefined;
  children: React.ReactNode;
};

const Page = ({ children, title }: PageProps) => {
  const { translate } = useUX();
  return (
    <>
      <Box bg="green.600" minH={300}>
        <Container maxW={{ base: "container.lg", xl: "container.xl" }} px={0}>
          <Navigation />
          {title && (
            <Text
              fontWeight="bold"
              fontSize={{ base: "xl", md: "3xl" }}
              // bg="warchild.blue.500"
              color="white"
              display="inline-block"
              px={3}
              py={1}
              mt={3}
              maxW={{ base: "90%", lg: "full" }}
            >
              {typeof title === "string" ? title : translate(title)}
            </Text>
          )}
        </Container>
      </Box>
      <Container
        mt="-100px"
        // h="full"
        minH="calc(100vh - 250px)"
        bg="white"
        maxW={{ base: "container.lg", xl: "container.xl" }}
        px={3}
        py={4}
        pb={8}
        borderRadius="sm"
      >
        {children}
      </Container>
      <Footer />
    </>
  );
};

export default Page