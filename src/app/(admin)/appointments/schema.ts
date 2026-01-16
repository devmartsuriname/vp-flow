import * as yup from 'yup'

export const appointmentSchema = yup.object({
  client_id: yup
    .string()
    .required('Guest is required'),
  subject: yup
    .string()
    .max(200, 'Subject must be 200 characters or less')
    .required('Subject is required'),
  scheduled_date: yup
    .string()
    .required('Date is required'),
  scheduled_time: yup
    .string()
    .required('Time is required'),
  duration_minutes: yup
    .number()
    .min(15, 'Minimum duration is 15 minutes')
    .max(240, 'Maximum duration is 4 hours')
    .required('Duration is required'),
  location: yup
    .string()
    .max(200, 'Location must be 200 characters or less'),
  description: yup
    .string()
    .max(2000, 'Description must be 2000 characters or less'),
  visibility: yup
    .string()
    .oneOf(['vp_secretary', 'vp_only'], 'Invalid visibility option')
    .required('Visibility is required'),
  vp_notes: yup
    .string()
    .max(2000, 'VP Notes must be 2000 characters or less'),
})

export type AppointmentSchemaType = yup.InferType<typeof appointmentSchema>
