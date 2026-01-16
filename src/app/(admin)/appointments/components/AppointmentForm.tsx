import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Form, Button, Row, Col, Card, Spinner } from 'react-bootstrap'
import Feedback from 'react-bootstrap/esm/Feedback'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/themes/light.css'
import { appointmentSchema, AppointmentSchemaType } from '../schema'
import { DURATION_OPTIONS, VISIBILITY_LABELS } from '../constants'
import type { AppointmentWithClient, AppointmentFormData } from '../types'
import ClientSelector from './ClientSelector'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { isVP } from '@/hooks/useUserRole'
import type { VPFlowRole } from '@/types/auth'

type AppointmentFormProps = {
  initialData?: AppointmentWithClient | null
  userRole: VPFlowRole | null
  isSubmitting: boolean
  onSubmit: (data: AppointmentFormData) => void
  onCancel: () => void
}

export default function AppointmentForm({
  initialData,
  userRole,
  isSubmitting,
  onSubmit,
  onCancel,
}: AppointmentFormProps) {
  const isEditMode = !!initialData
  const canSetVPOnly = isVP(userRole)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AppointmentSchemaType>({
    resolver: yupResolver(appointmentSchema),
    defaultValues: {
      client_id: initialData?.client_id || '',
      subject: initialData?.subject || '',
      scheduled_date: initialData?.scheduled_date || '',
      scheduled_time: initialData?.scheduled_time?.slice(0, 5) || '',
      duration_minutes: initialData?.duration_minutes || 30,
      location: initialData?.location || '',
      description: initialData?.description || '',
      visibility: initialData?.visibility || 'vp_secretary',
      vp_notes: initialData?.vp_notes || '',
    },
  })

  const handleFormSubmit = (data: AppointmentSchemaType) => {
    onSubmit(data as AppointmentFormData)
  }

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)}>
      {/* Guest Selection */}
      <Card className="mb-3">
        <Card.Header>
          <h5 className="mb-0">Guest</h5>
        </Card.Header>
        <Card.Body>
          <Form.Group>
            <Form.Label>Select Guest <span className="text-danger">*</span></Form.Label>
            <Controller
              name="client_id"
              control={control}
              render={({ field }) => (
                <ClientSelector
                  value={field.value}
                  onChange={field.onChange}
                  isInvalid={!!errors.client_id}
                />
              )}
            />
            {errors.client_id && (
              <Form.Text className="text-danger">
                {errors.client_id.message}
              </Form.Text>
            )}
          </Form.Group>
        </Card.Body>
      </Card>

      {/* Appointment Details */}
      <Card className="mb-3">
        <Card.Header>
          <h5 className="mb-0">Appointment Details</h5>
        </Card.Header>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Label>Subject <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter appointment subject"
              isInvalid={!!errors.subject}
              {...register('subject')}
            />
            <Feedback type="invalid">
              {errors.subject?.message}
            </Feedback>
          </Form.Group>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Date <span className="text-danger">*</span></Form.Label>
                <Controller
                  name="scheduled_date"
                  control={control}
                  render={({ field }) => (
                    <Flatpickr
                      className={`form-control ${errors.scheduled_date ? 'is-invalid' : ''}`}
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
                        }
                      }}
                      placeholder="Select date"
                    />
                  )}
                />
                {errors.scheduled_date && (
                  <Form.Text className="text-danger">
                    {errors.scheduled_date.message}
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Time <span className="text-danger">*</span></Form.Label>
                <Controller
                  name="scheduled_time"
                  control={control}
                  render={({ field }) => (
                    <Flatpickr
                      className={`form-control ${errors.scheduled_time ? 'is-invalid' : ''}`}
                      value={field.value || undefined}
                      options={{
                        enableTime: true,
                        noCalendar: true,
                        dateFormat: 'H:i',
                        time_24hr: false,
                      }}
                      onChange={(dates) => {
                        if (dates[0]) {
                          const hours = String(dates[0].getHours()).padStart(2, '0')
                          const minutes = String(dates[0].getMinutes()).padStart(2, '0')
                          field.onChange(`${hours}:${minutes}`)
                        }
                      }}
                      placeholder="Select time"
                    />
                  )}
                />
                {errors.scheduled_time && (
                  <Form.Text className="text-danger">
                    {errors.scheduled_time.message}
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Duration <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  isInvalid={!!errors.duration_minutes}
                  {...register('duration_minutes', { valueAsNumber: true })}
                >
                  {DURATION_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
                <Feedback type="invalid">
                  {errors.duration_minutes?.message}
                </Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter meeting location"
              {...register('location')}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Additional details about the appointment..."
              {...register('description')}
            />
          </Form.Group>
        </Card.Body>
      </Card>

      {/* Visibility Settings */}
      <Card className="mb-3">
        <Card.Header>
          <h5 className="mb-0">Visibility</h5>
        </Card.Header>
        <Card.Body>
          <Controller
            name="visibility"
            control={control}
            render={({ field }) => (
              <div className="d-flex gap-4">
                <Form.Check
                  type="radio"
                  id="visibility-vp_secretary"
                  label={VISIBILITY_LABELS.vp_secretary}
                  value="vp_secretary"
                  checked={field.value === 'vp_secretary'}
                  onChange={() => field.onChange('vp_secretary')}
                />
                <Form.Check
                  type="radio"
                  id="visibility-vp_only"
                  label={VISIBILITY_LABELS.vp_only}
                  value="vp_only"
                  checked={field.value === 'vp_only'}
                  onChange={() => field.onChange('vp_only')}
                  disabled={!canSetVPOnly}
                />
              </div>
            )}
          />
          {!canSetVPOnly && (
            <Form.Text className="text-muted">
              Only VP can set appointments as "VP Only"
            </Form.Text>
          )}
        </Card.Body>
      </Card>

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
              {isEditMode ? 'Update Appointment' : 'Create Appointment'}
            </>
          )}
        </Button>
      </div>
    </Form>
  )
}
