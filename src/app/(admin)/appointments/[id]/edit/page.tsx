import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardBody, Spinner, Button } from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useAppointment, useUpdateAppointment } from '../../hooks'
import { AppointmentForm } from '../../components'
import { useUserRole, isVP, isSecretary, isProtocol } from '@/hooks/useUserRole'
import { supabase } from '@/integrations/supabase/client'
import { canEditAppointment, type AppointmentFormData } from '../../types'

const EditAppointmentPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { role, isLoading: isRoleLoading } = useUserRole()
  const { data: appointment, isLoading, error } = useAppointment(id)
  const updateAppointment = useUpdateAppointment()
  const [currentUserId, setCurrentUserId] = useState<string>()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setCurrentUserId(data.user?.id))
  }, [])

  useEffect(() => {
    if (!isRoleLoading && !isLoading && appointment) {
      const isCreator = appointment.created_by === currentUserId
      const canEdit = (isVP(role) && canEditAppointment(appointment.status)) || (isSecretary(role) && appointment.status === 'draft' && isCreator)
      if (isProtocol(role) || !canEdit) {
        navigate(`/appointments/${id}`, { replace: true })
      }
    }
  }, [role, isRoleLoading, isLoading, appointment, currentUserId, id, navigate])

  if (isLoading || isRoleLoading) {
    return (<><PageTitle subName="Appointments" title="Edit Appointment" /><Card><CardBody className="text-center py-5"><Spinner animation="border" variant="primary" /><p className="mt-2 text-muted">Loading...</p></CardBody></Card></>)
  }

  if (error || !appointment) {
    return (<><PageTitle subName="Appointments" title="Not Found" /><Card><CardBody className="text-center py-5"><IconifyIcon icon="bx:error-circle" className="text-danger fs-1 mb-3" /><h5>Appointment Not Found</h5><Button variant="primary" onClick={() => navigate('/appointments')}>Back</Button></CardBody></Card></>)
  }

  const handleSubmit = (formData: AppointmentFormData) => {
    if (!id) return
    updateAppointment.mutate({ id, formData }, { onSuccess: () => navigate(`/appointments/${id}`) })
  }

  return (
    <>
      <PageTitle subName="Appointments" title="Edit Appointment" />
      <Card><CardBody><AppointmentForm initialData={appointment} userRole={role} isSubmitting={updateAppointment.isPending} onSubmit={handleSubmit} onCancel={() => navigate(`/appointments/${id}`)} /></CardBody></Card>
    </>
  )
}

export default EditAppointmentPage
