import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Form, Button, Row, Col, Card, Spinner } from 'react-bootstrap'
import Feedback from 'react-bootstrap/esm/Feedback'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/themes/light.css'
import { caseSchema, CaseSchemaType } from '../schema'
import { PRIORITY_OPTIONS } from '../constants'
import type { CaseWithAppointment, CaseFormData } from '../types'
import AppointmentSelector from './AppointmentSelector'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { isVP } from '@/hooks/useUserRole'
import type { VPFlowRole } from '@/types/auth'

type CaseFormProps = {
  initialData?: CaseWithAppointment | null
  userRole: VPFlowRole | null
  isSubmitting: boolean
  onSubmit: (data: CaseFormData) => void
  onCancel: () => void
}

export default function CaseForm({
  initialData,
  userRole,
  isSubmitting,
  onSubmit,
  onCancel,
}: CaseFormProps) {
  const isEditMode = !!initialData

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CaseSchemaType>({
    resolver: yupResolver(caseSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      priority: initialData?.priority || 'medium',
      deadline: initialData?.deadline || '',
      appointment_id: initialData?.appointment_id || '',
      vp_notes: initialData?.vp_notes || '',
    },
  })

  const handleFormSubmit = (data: CaseSchemaType) => {
    onSubmit({
      title: data.title,
      description: data.description || '',
      priority: data.priority as CaseFormData['priority'],
      deadline: data.deadline || null,
      appointment_id: data.appointment_id || null,
      vp_notes: data.vp_notes || '',
    })
  }

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)}>
      {/* Case Details */}
      <Card className="mb-3">
        <Card.Header>
          <h5 className="mb-0">Case Details</h5>
        </Card.Header>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Label>Title <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter case title"
              isInvalid={!!errors.title}
              {...register('title')}
            />
            <Feedback type="invalid">
              {errors.title?.message}
            </Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Describe the case details..."
              isInvalid={!!errors.description}
              {...register('description')}
            />
            <Feedback type="invalid">
              {errors.description?.message}
            </Feedback>
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Priority <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  isInvalid={!!errors.priority}
                  {...register('priority')}
                >
                  {PRIORITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
                <Feedback type="invalid">
                  {errors.priority?.message}
                </Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Deadline</Form.Label>
                <Controller
                  name="deadline"
                  control={control}
                  render={({ field }) => (
                    <Flatpickr
                      className={`form-control ${errors.deadline ? 'is-invalid' : ''}`}
                      value={field.value ? new Date(field.value) : undefined}
                      options={{
                        dateFormat: 'Y-m-d',
                        minDate: 'today',
                      }}
                      onChange={(dates) => {
                        if (dates[0]) {
                          const year = dates[0].getFullYear()
                          const month = String(dates[0].getMonth() + 1).padStart(2, '0')
                          const day = String(dates[0].getDate()).padStart(2, '0')
                          field.onChange(`${year}-${month}-${day}`)
                        } else {
                          field.onChange(null)
                        }
                      }}
                      placeholder="Select deadline (optional)"
                    />
                  )}
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Linked Appointment (only on create) */}
      {!isEditMode && (
        <Card className="mb-3">
          <Card.Header>
            <h5 className="mb-0">Linked Appointment</h5>
          </Card.Header>
          <Card.Body>
            <Form.Group>
              <Form.Label>Link to Appointment (Optional)</Form.Label>
              <Controller
                name="appointment_id"
                control={control}
                render={({ field }) => (
                  <AppointmentSelector
                    value={field.value || null}
                    onChange={field.onChange}
                    isInvalid={!!errors.appointment_id}
                  />
                )}
              />
              <Form.Text className="text-muted">
                Only completed appointments can be linked to cases.
              </Form.Text>
            </Form.Group>
          </Card.Body>
        </Card>
      )}

      {/* Show linked appointment (read-only on edit) */}
      {isEditMode && initialData?.appointments && (
        <Card className="mb-3">
          <Card.Header>
            <h5 className="mb-0">Linked Appointment</h5>
          </Card.Header>
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{initialData.appointments.subject}</strong>
                <div className="text-muted small">
                  {initialData.appointments.scheduled_date}
                </div>
              </div>
              <a
                href={`/appointments/${initialData.appointments.id}`}
                className="btn btn-sm btn-outline-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Appointment
              </a>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* VP Notes (VP only) */}
      {isVP(userRole) && (
        <Card className="mb-3">
          <Card.Header>
            <h5 className="mb-0">VP Notes</h5>
          </Card.Header>
          <Card.Body>
            <Form.Group>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Private notes visible only to VP..."
                {...register('vp_notes')}
              />
              <Form.Text className="text-muted">
                These notes are only visible to the VP.
              </Form.Text>
            </Form.Group>
          </Card.Body>
        </Card>
      )}

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
              {isEditMode ? 'Update Case' : 'Create Case'}
            </>
          )}
        </Button>
      </div>
    </Form>
  )
}
