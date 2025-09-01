import * as Yup from 'yup'

export const eventSchema = Yup.object({
  title: Yup.string().required('Event title is required'),
  description: Yup.string(),
  date: Yup.date().required('Event date is required').min(new Date(), 'Event date must be in the future'),
  location: Yup.string().required('Location is required'),
  capacity: Yup.number().required('Capacity is required').min(1, 'Capacity must be at least 1'),
  price: Yup.number().min(0, 'Price cannot be negative').default(0),
  category: Yup.string().required('Category is required')
})