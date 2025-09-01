import {
  Container,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { RegistrationForm } from "@/components/RegistrationForm";
import { EventService } from "@/lib/services/eventService";

export default async function HomePage() {
  const events = await EventService.getAllEvents();

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <VStack spacing={4} textAlign="center">
          <Heading as="h1" size="2xl" color="brand.600">
            Event Registration System
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Register for professional events and conferences
          </Text>
        </VStack>

        <Tabs variant="enclosed" colorScheme="brand">
          <TabList>
            <Tab>Register for Event</Tab>
            <Tab>Browse Events</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <RegistrationForm events={events} />
            </TabPanel>

            <TabPanel>
              <VStack spacing={4} align="stretch">
                {events.map((event) => (
                  <div key={event.id}>
                    <Heading size="md">{event.title}</Heading>
                    <Text>{new Date(event.date).toLocaleDateString()}</Text>
                    <Text>{event.location}</Text>
                  </div>
                ))}
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
}
