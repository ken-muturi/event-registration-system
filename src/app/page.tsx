import { Box, Flex, VStack } from "@chakra-ui/react";
import React from "react";
import GenericPage from "@/components/Generic/Page";

const page = () => {
  return (
    <Flex
      as="main"
      w="full"
      h="full"
      minH="100vh"
      alignItems="start"
      justifyContent="start"
      flexDirection="column"
    >
      <VStack w="full" h="full" borderRadius="md" alignItems="left">
        <GenericPage title={"Welcome to the Forms"}>
          <Box>
            New forms reports and such will come here .......... (report)
          </Box>
        </GenericPage>
      </VStack>
    </Flex>
  );
};

export default page;
