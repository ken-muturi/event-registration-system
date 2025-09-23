import { getEvents } from "@/services/Event";
import {
  Container,
  Tabs,
  Heading,
  Text,
  VStack,
  Box,
  Button,
  HStack,
  Card,
  Badge,
  Flex,
  Icon,
} from "@chakra-ui/react";
import {
  LuFolder,
  LuUser,
  LuCalendar,
  LuClock,
  LuMapPin,
  LuUsers,
  LuDollarSign,
  LuTag,
} from "react-icons/lu";
import { RegistrationForm } from "../components/Registrations";

async function getDetails() {
  try {
    const [events] = await Promise.all([getEvents()]);
    return { events };
  } catch (error) {
    if (error instanceof Error) {
      return `Error: ${error.message}`;
    }
    return "An unknown error occurred";
  }
}

export default async function HomePage() {
  const data = await getDetails();
  if (typeof data === "string") {
    return <Box>{data}</Box>;
  }
  console.log({ data });

  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-br, purple.600, purple.400, blue.500)"
      py={8}
    >
      <Container maxW="container.xl">
        <VStack gap={8} align="stretch">
          {/* Header Section */}
          <VStack gap={4} textAlign="center" color="white">
            <Heading as="h1" size="2xl" fontWeight="bold">
              Event Registration System
            </Heading>
            <Text fontSize="lg" opacity={0.9}>
              Manage events and registrations with ease
            </Text>
          </VStack>

          {/* Navigation Buttons */}
          <HStack justify="center" gap={4} flexWrap="wrap">
            <Button
              bg="whiteAlpha.200"
              color="white"
              _hover={{ bg: "whiteAlpha.300" }}
              borderRadius="full"
              px={6}
            >
              Browse Events
            </Button>
            <Button
              bg="whiteAlpha.200"
              color="white"
              _hover={{ bg: "whiteAlpha.300" }}
              borderRadius="full"
              px={6}
            >
              Register
            </Button>
            <Button
              bg="whiteAlpha.200"
              color="white"
              _hover={{ bg: "whiteAlpha.300" }}
              borderRadius="full"
              px={6}
            >
              Create Event
            </Button>
            <Button
              bg="whiteAlpha.200"
              color="white"
              _hover={{ bg: "whiteAlpha.300" }}
              borderRadius="full"
              px={6}
            >
              Admin Panel
            </Button>
          </HStack>

          {/* Tabs for Registration Form */}
          <Tabs.Root key="line" defaultValue="events" variant="line">
            <Tabs.List bg="whiteAlpha.200" borderRadius="lg" p={1}>
              <Tabs.Trigger
                value="register"
                color="black"
                _selected={{ bg: "whiteAlpha.300" }}
              >
                <LuUser />
                Register for Event
              </Tabs.Trigger>
              <Tabs.Trigger
                value="events"
                color="black"
                _selected={{ bg: "whiteAlpha.300" }}
              >
                <LuFolder />
                Browse Events
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="register">
              <Box
                bg="whiteAlpha.100"
                borderRadius="xl"
                p={6}
                backdropFilter="blur(10px)"
              >
                {/* <RegistrationForm events={data.events} /> */}
              </Box>
            </Tabs.Content>

            <Tabs.Content value="events">
              <Box
                bg="whiteAlpha.100"
                borderRadius="xl"
                p={6}
                backdropFilter="blur(10px)"
              >
                <Heading as="h2" size="lg" color="white" mb={6}>
                  Available Events
                </Heading>

                <VStack gap={4} align="stretch">
                  {data.events.map((event) => (
                    <Card.Root
                      key={event.id}
                      bg="white"
                      borderRadius="lg"
                      overflow="hidden"
                      _hover={{
                        transform: "translateY(-2px)",
                        transition: "all 0.2s",
                      }}
                    >
                      <Card.Body p={6}>
                        <VStack align="stretch" gap={4}>
                          {/* Event Title */}
                          <Heading as="h3" size="md" color="blue.600">
                            {event.title}
                          </Heading>

                          {/* Event Details */}
                          <HStack
                            gap={6}
                            flexWrap="wrap"
                            fontSize="sm"
                            color="gray.600"
                          >
                            <HStack gap={1}>
                              <Icon color="red.500">
                                <LuCalendar />
                              </Icon>
                              <Text>
                                {new Date(event.date).toLocaleDateString()}
                              </Text>
                            </HStack>

                            <HStack gap={1}>
                              <Icon color="blue.500">
                                <LuClock />
                              </Icon>
                              <Text>09:00</Text>
                            </HStack>

                            <HStack gap={1}>
                              <Icon color="orange.500">
                                <LuMapPin />
                              </Icon>
                              <Text>{event.location}</Text>
                            </HStack>

                            <HStack gap={1}>
                              <Icon color="green.500">
                                <LuUsers />
                              </Icon>
                              <Text>
                                {event._count?.registrations || 0}/
                                {event.capacity} spots available
                              </Text>
                            </HStack>

                            <HStack gap={1}>
                              <Icon color="yellow.500">
                                <LuDollarSign />
                              </Icon>
                              <Text>${event.price}</Text>
                            </HStack>

                            <Badge colorScheme="purple" borderRadius="md">
                              <HStack gap={1}>
                                <LuTag size={12} />
                                <Text>{event.category}</Text>
                              </HStack>
                            </Badge>
                          </HStack>

                          {/* Event Description */}
                          <Text color="gray.700" fontSize="sm">
                            {event.description}
                          </Text>

                          {/* Register Button */}
                          <Flex justify="flex-start">
                            <Button
                              colorScheme="purple"
                              size="sm"
                              borderRadius="md"
                            >
                              Register Now
                            </Button>
                          </Flex>
                        </VStack>
                      </Card.Body>
                    </Card.Root>
                  ))}
                </VStack>
              </Box>
            </Tabs.Content>
          </Tabs.Root>
        </VStack>
      </Container>
    </Box>
  );
}
