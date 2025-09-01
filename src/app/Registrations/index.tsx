'use client'

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  SimpleGrid,
  VStack,
  Heading,
  useToast,
  FormErrorMessage,
  Card,
  CardBody,
  InputGroup,
  InputLeftAddon,
} from '@chakra-ui/react'
import { Formik, Form, Field } from 'formik'
import { registrationSchema } from '@/lib/validationSchemas'
import { useState } from 'react'

const TITLES = ['Mr', 'Mrs', 'Ms', 'Dr', 'Prof', 'Rev', 'Other']

const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria',
  'Bangladesh', 'Belgium', 'Brazil', 'Canada', 'China', 'Denmark',
  'Egypt', 'France', 'Germany', 'India', 'Indonesia', 'Italy',
  'Japan', 'Kenya', 'Malaysia', 'Netherlands', 'Nigeria', 'Norway',
  'Pakistan', 'Philippines', 'Singapore', 'South Africa', 'Spain',
  'Sweden', 'Switzerland', 'Thailand', 'Turkey', 'UAE', 'UK', 'USA'
]

interface RegistrationFormProps {
  events: Array<{
    id: string
    title: string
    date: Date
    capacity: number
    _count: { registrations: number }
  }>
}

export function RegistrationForm({ events }: RegistrationFormProps) {
  const toast = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const initialValues = {
    title: '',
    firstName: '',
    lastName: '',
    email: '',
    affiliation: '',
    position: '',
    country: '',
    phoneNo: '',
    passportNumber: '',
    passportExpiryDate: '',
    departureCity: '',
    dietaryRequirements: '',
    eventId: '',
  }

  const handleSubmit = async (values: any, { resetForm }: any) => {
    setIsSubmitting(true)
    try {
      const formData = {
        ...values,
        passportExpiryDate: new Date(values.passportExpiryDate),
      }

      const response =  await createRegistration(data)

      toast({
        title: 'Registration Successful',
        description: 'Your registration has been submitted successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      resetForm()
    } catch (error: any) {
      toast({
        title: 'Registration Failed',
        description: error.message || 'An error occurred during registration',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const availableEvents = events.filter(
    event => event._count.registrations < event.capacity
  )

  return (
    <Card>
      <CardBody>
        <Heading mb={6} size="lg" color="brand.600">
          Event Registration
        </Heading>

        <Formik
          initialValues={initialValues}
          validationSchema={registrationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, values, setFieldValue }) => (
            <Form>
              <VStack spacing={6} align="stretch">
                {/* Event Selection */}
                <Field name="eventId">
                  {({ field, meta }: any) => (
                    <FormControl isInvalid={meta.error && meta.touched}>
                      <FormLabel>Select Event *</FormLabel>
                      <Select {...field} placeholder="Choose an event...">
                        {availableEvents.map((event) => (
                          <option key={event.id} value={event.id}>
                            {event.title} - {new Date(event.date).toLocaleDateString()} 
                            ({event.capacity - event._count.registrations} spots left)
                          </option>
                        ))}
                      </Select>
                      <FormErrorMessage>{meta.error}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                {/* Personal Information */}
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  <Field name="title">
                    {({ field, meta }: any) => (
                      <FormControl isInvalid={meta.error && meta.touched}>
                        <FormLabel>Title/Designation *</FormLabel>
                        <Select {...field} placeholder="Select title">
                          {TITLES.map((title) => (
                            <option key={title} value={title}>
                              {title}
                            </option>
                          ))}
                        </Select>
                        <FormErrorMessage>{meta.error}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="firstName">
                    {({ field, meta }: any) => (
                      <FormControl isInvalid={meta.error && meta.touched}>
                        <FormLabel>First Name *</FormLabel>
                        <Input {...field} />
                        <FormErrorMessage>{meta.error}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="lastName">
                    {({ field, meta }: any) => (
                      <FormControl isInvalid={meta.error && meta.touched}>
                        <FormLabel>Last Name *</FormLabel>
                        <Input {...field} />
                        <FormErrorMessage>{meta.error}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </SimpleGrid>

                {/* Contact Information */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <Field name="email">
                    {({ field, meta }: any) => (
                      <FormControl isInvalid={meta.error && meta.touched}>
                        <FormLabel>Email Address *</FormLabel>
                        <Input {...field} type="email" />
                        <FormErrorMessage>{meta.error}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="phoneNo">
                    {({ field, meta }: any) => (
                      <FormControl isInvalid={meta.error && meta.touched}>
                        <FormLabel>Phone Number *</FormLabel>
                        <InputGroup>
                          <InputLeftAddon>+</InputLeftAddon>
                          <Input {...field} placeholder="1234567890" />
                        </InputGroup>
                        <FormErrorMessage>{meta.error}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </SimpleGrid>

                {/* Professional Information */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <Field name="affiliation">
                    {({ field, meta }: any) => (
                      <FormControl isInvalid={meta.error && meta.touched}>
                        <FormLabel>Affiliation/Organization *</FormLabel>
                        <Input {...field} />
                        <FormErrorMessage>{meta.error}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="position">
                    {({ field, meta }: any) => (
                      <FormControl isInvalid={meta.error && meta.touched}>
                        <FormLabel>Position *</FormLabel>
                        <Input {...field} />
                        <FormErrorMessage>{meta.error}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </SimpleGrid>

                {/* Location Information */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <Field name="country">
                    {({ field, meta }: any) => (
                      <FormControl isInvalid={meta.error && meta.touched}>
                        <FormLabel>Country *</FormLabel>
                        <Select {...field} placeholder="Select country">
                          {COUNTRIES.map((country) => (
                            <option key={country} value={country}>
                              {country}
                            </option>
                          ))}
                        </Select>
                        <FormErrorMessage>{meta.error}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="departureCity">
                    {({ field, meta }: any) => (
                      <FormControl isInvalid={meta.error && meta.touched}>
                        <FormLabel>Departure City/Country *</FormLabel>
                        <Input {...field} />
                        <FormErrorMessage>{meta.error}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </SimpleGrid>

                {/* Passport Information */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <Field name="passportNumber">
                    {({ field, meta }: any) => (
                      <FormControl isInvalid={meta.error && meta.touched}>
                        <FormLabel>Passport Number *</FormLabel>
                        <Input {...field} />
                        <FormErrorMessage>{meta.error}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="passportExpiryDate">
                    {({ field, meta }: any) => (
                      <FormControl isInvalid={meta.error && meta.touched}>
                        <FormLabel>Passport Expiry Date *</FormLabel>
                        <Input {...field} type="date" />
                        <FormErrorMessage>{meta.error}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </SimpleGrid>

                {/* Additional Information */}
                <Field name="dietaryRequirements">
                  {({ field, meta }: any) => (
                    <FormControl isInvalid={meta.error && meta.touched}>
                      <FormLabel>Dietary Requirements</FormLabel>
                      <Textarea {...field} rows={3} placeholder="Any special dietary needs or allergies?" />
                      <FormErrorMessage>{meta.error}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Button
                  type="submit"
                  colorScheme="brand"
                  size="lg"
                  isLoading={isSubmitting}
                  loadingText="Submitting Registration..."
                >
                  Submit Registration
                </Button>
              </VStack>
            </Form>
          )}
        </Formik>
      </CardBody>
    </Card>
  )
}