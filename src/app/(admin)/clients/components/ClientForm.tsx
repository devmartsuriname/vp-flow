import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Form, Button, Row, Col, Card, Spinner } from 'react-bootstrap'
import Feedback from 'react-bootstrap/esm/Feedback'
import { clientSchema, ClientSchemaType } from '../schema'
import { SURINAME_DISTRICTS, type Client, type ClientFormData } from '../types'
import IconifyIcon from '@/components/wrapper/IconifyIcon'

type ClientFormProps = {
  initialData?: Client | null
  isSubmitting: boolean
  onSubmit: (data: ClientFormData) => void
  onCancel: () => void
}

export default function ClientForm({
  initialData,
  isSubmitting,
  onSubmit,
  onCancel,
}: ClientFormProps) {
  const isEditMode = !!initialData

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<ClientSchemaType>({
    resolver: yupResolver(clientSchema),
    defaultValues: {
      client_type: initialData?.client_type || 'person',
      first_name: initialData?.first_name || '',
      last_name: initialData?.last_name || '',
      organization_name: initialData?.organization_name || '',
      contact_person: initialData?.contact_person || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      address_line1: initialData?.address_line1 || '',
      address_line2: initialData?.address_line2 || '',
      city: initialData?.city || '',
      district: initialData?.district || '',
      notes: initialData?.notes || '',
    },
  })

  const clientType = watch('client_type')

  const handleFormSubmit = (data: ClientSchemaType) => {
    onSubmit(data as ClientFormData)
  }

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)}>
      {/* Guest Type Selection */}
      <Card className="mb-3">
        <Card.Header>
          <h5 className="mb-0">Guest Type</h5>
        </Card.Header>
        <Card.Body>
          <Controller
            name="client_type"
            control={control}
            render={({ field }) => (
              <div className="d-flex gap-4">
                <Form.Check
                  type="radio"
                  id="type-person"
                  label="Person"
                  value="person"
                  checked={field.value === 'person'}
                  onChange={() => field.onChange('person')}
                  isInvalid={!!errors.client_type}
                />
                <Form.Check
                  type="radio"
                  id="type-organization"
                  label="Organization"
                  value="organization"
                  checked={field.value === 'organization'}
                  onChange={() => field.onChange('organization')}
                  isInvalid={!!errors.client_type}
                />
              </div>
            )}
          />
          {errors.client_type && (
            <Form.Text className="text-danger">
              {errors.client_type.message}
            </Form.Text>
          )}
        </Card.Body>
      </Card>

      {/* Name Fields (conditional based on type) */}
      <Card className="mb-3">
        <Card.Header>
          <h5 className="mb-0">
            {clientType === 'person' ? 'Personal Details' : 'Organization Details'}
          </h5>
        </Card.Header>
        <Card.Body>
          {clientType === 'person' ? (
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter first name"
                    isInvalid={!!errors.first_name}
                    {...register('first_name')}
                  />
                  <Feedback type="invalid">
                    {errors.first_name?.message}
                  </Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter last name"
                    isInvalid={!!errors.last_name}
                    {...register('last_name')}
                  />
                  <Feedback type="invalid">
                    {errors.last_name?.message}
                  </Feedback>
                </Form.Group>
              </Col>
            </Row>
          ) : (
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Organization Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter organization name"
                    isInvalid={!!errors.organization_name}
                    {...register('organization_name')}
                  />
                  <Feedback type="invalid">
                    {errors.organization_name?.message}
                  </Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Contact Person</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter contact person name"
                    {...register('contact_person')}
                  />
                </Form.Group>
              </Col>
            </Row>
          )}
        </Card.Body>
      </Card>

      {/* Contact Information */}
      <Card className="mb-3">
        <Card.Header>
          <h5 className="mb-0">Contact Information</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email address"
                  isInvalid={!!errors.email}
                  {...register('email')}
                />
                <Feedback type="invalid">
                  {errors.email?.message}
                </Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter phone number"
                  {...register('phone')}
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Address */}
      <Card className="mb-3">
        <Card.Header>
          <h5 className="mb-0">Address</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Address Line 1</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Street address"
                  {...register('address_line1')}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Address Line 2</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Apartment, suite, etc."
                  {...register('address_line2')}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter city"
                  {...register('city')}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>District</Form.Label>
                <Form.Select {...register('district')}>
                  <option value="">Select a district</option>
                  {SURINAME_DISTRICTS.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Internal Notes */}
      <Card className="mb-3">
        <Card.Header>
          <h5 className="mb-0">Internal Notes</h5>
        </Card.Header>
        <Card.Body>
          <Form.Group>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Add any internal notes about this guest..."
              {...register('notes')}
            />
            <Form.Text className="text-muted">
              These notes are only visible to VP and Secretary staff.
            </Form.Text>
          </Form.Group>
        </Card.Body>
      </Card>

      {/* Form Actions */}
      <div className="d-flex gap-2 justify-content-end">
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Spinner animation="border" size="sm" className="me-1" />
              {isEditMode ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>
              <IconifyIcon icon={isEditMode ? 'bx:check' : 'bx:plus'} className="me-1" />
              {isEditMode ? 'Update Guest' : 'Create Guest'}
            </>
          )}
        </Button>
      </div>
    </Form>
  )
}
