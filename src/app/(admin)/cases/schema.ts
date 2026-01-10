import * as yup from 'yup'

export const caseSchema = yup.object({
  title: yup
    .string()
    .max(200, 'Title must be 200 characters or less')
    .required('Title is required'),
  description: yup
    .string()
    .max(4000, 'Description must be 4000 characters or less'),
  priority: yup
    .string()
    .oneOf(['high', 'medium', 'low'], 'Invalid priority option')
    .required('Priority is required'),
  deadline: yup
    .string()
    .nullable(),
  appointment_id: yup
    .string()
    .nullable(),
  vp_notes: yup
    .string()
    .max(4000, 'VP Notes must be 4000 characters or less'),
})

export type CaseSchemaType = yup.InferType<typeof caseSchema>
