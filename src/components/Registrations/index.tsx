'use client'

import {
  Box,
  Button,
  Input,
  Textarea,
  SimpleGrid,
  VStack,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { toaster } from "@/components/ui/toaster";
import { createRegistration } from "@/services/Registration";
import { Event } from "@prisma/client";

const TITLES = ["Mr", "Mrs", "Ms", "Dr", "Prof", "Rev", "Other"];

const COUNTRIES = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Argentina",
  "Australia",
  "Austria",
  "Bangladesh",
  "Belgium",
  "Brazil",
  "Canada",
  "China",
  "Denmark",
  "Egypt",
  "France",
  "Germany",
  "India",
  "Indonesia",
  "Italy",
  "Japan",
  "Kenya",
  "Malaysia",
  "Netherlands",
  "Nigeria",
  "Norway",
  "Pakistan",
  "Philippines",
  "Singapore",
  "South Africa",
  "Spain",
  "Sweden",
  "Switzerland",
  "Thailand",
  "Turkey",
  "UAE",
  "UK",
  "USA",
];

interface RegistrationFormData {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  affiliation: string;
  position: string;
  country: string;
  phoneNo: string;
  passportNumber: string;
  passportExpiryDate: string;
  departureCity: string;
  dietaryRequirements: string;
  eventId: string;
}

interface RegistrationFormProps {
  events: Array<{ _count: { registrations: number } } & Event>;
}

export function RegistrationForm({ events }: RegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<RegistrationFormData>>({});
  const [formData, setFormData] = useState<RegistrationFormData>({
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    affiliation: "",
    position: "",
    country: "",
    phoneNo: "",
    passportNumber: "",
    passportExpiryDate: "",
    departureCity: "",
    dietaryRequirements: "",
    eventId: "",
  });

  const handleInputChange =
    (field: keyof RegistrationFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const validateForm = (): boolean => {
    const newErrors: Partial<RegistrationFormData> = {};

    if (!formData.eventId) newErrors.eventId = "Event selection is required";
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.affiliation)
      newErrors.affiliation = "Affiliation is required";
    if (!formData.position) newErrors.position = "Position is required";
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.phoneNo) newErrors.phoneNo = "Phone number is required";
    if (!formData.passportNumber)
      newErrors.passportNumber = "Passport number is required";
    if (!formData.passportExpiryDate)
      newErrors.passportExpiryDate = "Passport expiry date is required";
    if (!formData.departureCity)
      newErrors.departureCity = "Departure city is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submissionData = {
        ...formData,
        passportExpiryDate: new Date(formData.passportExpiryDate),
      };

      await createRegistration(submissionData);

      toaster.create({
        title: "Registration Successful",
        description: "Your registration has been submitted successfully!",
        type: "success",
        duration: 3000,
        closable: true,
      });

      // Reset form
      setFormData({
        title: "",
        firstName: "",
        lastName: "",
        email: "",
        affiliation: "",
        position: "",
        country: "",
        phoneNo: "",
        passportNumber: "",
        passportExpiryDate: "",
        departureCity: "",
        dietaryRequirements: "",
        eventId: "",
      });
      setErrors({});
    } catch (error) {
      toaster.create({
        title: "Registration Failed",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred during registration",
        type: "error",
        duration: 5000,
        closable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableEvents = events.filter(
    (event) => event._count.registrations < event.capacity
  );

  const FormField = ({
    label,
    error,
    children,
    required = false,
  }: {
    label: string;
    error?: string;
    children: React.ReactNode;
    required?: boolean;
  }) => (
    <Box>
      <Text
        fontSize="sm"
        fontWeight="medium"
        mb={2}
        color={error ? "red.500" : "gray.700"}
      >
        {label}{" "}
        {required && (
          <Text as="span" color="red.500">
            *
          </Text>
        )}
      </Text>
      {children}
      {error && (
        <Text fontSize="sm" color="red.500" mt={1}>
          {error}
        </Text>
      )}
    </Box>
  );

  return (
    <Box bg="white" shadow="md" rounded="lg" p={6}>
      <Heading mb={6} size="lg" color="blue.600">
        Event Registration
      </Heading>

      <form onSubmit={handleSubmit}>
        <VStack gap={6} align="stretch">
          {/* Event Selection */}
          <FormField label="Select Event" error={errors.eventId} required>
            <Box position="relative">
              <select
                style={{
                  width: "100%",
                  padding: "12px",
                  border: `1px solid ${errors.eventId ? "#F56565" : "#CBD5E0"}`,
                  borderRadius: "6px",
                  backgroundColor: "white",
                  fontSize: "14px",
                }}
                value={formData.eventId}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, eventId: e.target.value }));
                  if (errors.eventId) {
                    setErrors((prev) => ({ ...prev, eventId: undefined }));
                  }
                }}
              >
                <option value="">Choose an event...</option>
                {availableEvents.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title} - {new Date(event.date).toLocaleDateString()}(
                    {event.capacity - event._count.registrations} spots left)
                  </option>
                ))}
              </select>
            </Box>
          </FormField>

          {/* Personal Information */}
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
            <FormField label="Title/Designation" error={errors.title} required>
              <Box position="relative">
                <select
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: `1px solid ${errors.title ? "#F56565" : "#CBD5E0"}`,
                    borderRadius: "6px",
                    backgroundColor: "white",
                    fontSize: "14px",
                  }}
                  value={formData.title}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, title: e.target.value }));
                    if (errors.title) {
                      setErrors((prev) => ({ ...prev, title: undefined }));
                    }
                  }}
                >
                  <option value="">Select title</option>
                  {TITLES.map((title) => (
                    <option key={title} value={title}>
                      {title}
                    </option>
                  ))}
                </select>
              </Box>
            </FormField>

            <FormField label="First Name" error={errors.firstName} required>
              <Input
                borderColor={errors.firstName ? "red.300" : "gray.300"}
                value={formData.firstName}
                onChange={handleInputChange("firstName")}
              />
            </FormField>

            <FormField label="Last Name" error={errors.lastName} required>
              <Input
                borderColor={errors.lastName ? "red.300" : "gray.300"}
                value={formData.lastName}
                onChange={handleInputChange("lastName")}
              />
            </FormField>
          </SimpleGrid>

          {/* Contact Information */}
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <FormField label="Email Address" error={errors.email} required>
              <Input
                type="email"
                borderColor={errors.email ? "red.300" : "gray.300"}
                value={formData.email}
                onChange={handleInputChange("email")}
              />
            </FormField>

            <FormField label="Phone Number" error={errors.phoneNo} required>
              <Input
                borderColor={errors.phoneNo ? "red.300" : "gray.300"}
                value={formData.phoneNo}
                onChange={handleInputChange("phoneNo")}
                placeholder="+1234567890"
              />
            </FormField>
          </SimpleGrid>

          {/* Professional Information */}
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <FormField
              label="Affiliation/Organization"
              error={errors.affiliation}
              required
            >
              <Input
                borderColor={errors.affiliation ? "red.300" : "gray.300"}
                value={formData.affiliation}
                onChange={handleInputChange("affiliation")}
              />
            </FormField>

            <FormField label="Position" error={errors.position} required>
              <Input
                borderColor={errors.position ? "red.300" : "gray.300"}
                value={formData.position}
                onChange={handleInputChange("position")}
              />
            </FormField>
          </SimpleGrid>

          {/* Location Information */}
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <FormField label="Country" error={errors.country} required>
              <Box position="relative">
                <select
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: `1px solid ${
                      errors.country ? "#F56565" : "#CBD5E0"
                    }`,
                    borderRadius: "6px",
                    backgroundColor: "white",
                    fontSize: "14px",
                  }}
                  value={formData.country}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      country: e.target.value,
                    }));
                    if (errors.country) {
                      setErrors((prev) => ({ ...prev, country: undefined }));
                    }
                  }}
                >
                  <option value="">Select country</option>
                  {COUNTRIES.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </Box>
            </FormField>

            <FormField
              label="Departure City/Country"
              error={errors.departureCity}
              required
            >
              <Input
                borderColor={errors.departureCity ? "red.300" : "gray.300"}
                value={formData.departureCity}
                onChange={handleInputChange("departureCity")}
              />
            </FormField>
          </SimpleGrid>

          {/* Passport Information */}
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <FormField
              label="Passport Number"
              error={errors.passportNumber}
              required
            >
              <Input
                borderColor={errors.passportNumber ? "red.300" : "gray.300"}
                value={formData.passportNumber}
                onChange={handleInputChange("passportNumber")}
              />
            </FormField>

            <FormField
              label="Passport Expiry Date"
              error={errors.passportExpiryDate}
              required
            >
              <Input
                type="date"
                borderColor={errors.passportExpiryDate ? "red.300" : "gray.300"}
                value={formData.passportExpiryDate}
                onChange={handleInputChange("passportExpiryDate")}
              />
            </FormField>
          </SimpleGrid>

          {/* Additional Information */}
          <FormField label="Dietary Requirements">
            <Textarea
              value={formData.dietaryRequirements}
              onChange={handleInputChange("dietaryRequirements")}
              rows={3}
              placeholder="Any special dietary needs or allergies?"
            />
          </FormField>

          <Button
            type="submit"
            colorScheme="blue"
            size="lg"
            loading={isSubmitting}
            loadingText="Submitting Registration..."
          >
            Submit Registration
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
