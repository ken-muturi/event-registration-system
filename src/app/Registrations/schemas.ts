import * as Yup from 'yup'

export const registrationSchema = Yup.object({
  title: Yup.string().required('Title/Designation is required'),
  firstName: Yup.string().required('First name is required').min(2, 'First name must be at least 2 characters'),
  lastName: Yup.string().required('Last name is required').min(2, 'Last name must be at least 2 characters'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  affiliation: Yup.string().required('Affiliation/Organization is required'),
  position: Yup.string().required('Position is required'),
  country: Yup.string().required('Country is required'),
  phoneNo: Yup.string().required('Phone number is required').matches(/^\+?[\d\s-()]+$/, 'Invalid phone number format'),
  passportNumber: Yup.string().required('Passport number is required').min(6, 'Passport number must be at least 6 characters'),
  passportExpiryDate: Yup.date().required('Passport expiry date is required').min(new Date(), 'Passport must not be expired'),
  departureCity: Yup.string().required('Departure city/country is required'),
  dietaryRequirements: Yup.string(),
  eventId: Yup.string().required('Event selection is required')
})
