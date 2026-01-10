import * as yup from 'yup'

export const clientSchema = yup.object({
  client_type: yup
    .string()
    .oneOf(['person', 'organization'], 'Please select a valid client type')
    .required('Client type is required'),
  first_name: yup.string().when('client_type', {
    is: 'person',
    then: (schema) => schema.required('First name is required for persons'),
    otherwise: (schema) => schema.notRequired(),
  }),
  last_name: yup.string().when('client_type', {
    is: 'person',
    then: (schema) => schema.required('Last name is required for persons'),
    otherwise: (schema) => schema.notRequired(),
  }),
  organization_name: yup.string().when('client_type', {
    is: 'organization',
    then: (schema) => schema.required('Organization name is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  contact_person: yup.string().notRequired(),
  email: yup.string().email('Please enter a valid email address').notRequired(),
  phone: yup.string().notRequired(),
  address_line1: yup.string().notRequired(),
  address_line2: yup.string().notRequired(),
  city: yup.string().notRequired(),
  district: yup.string().notRequired(),
  notes: yup.string().notRequired(),
})

export type ClientSchemaType = yup.InferType<typeof clientSchema>
