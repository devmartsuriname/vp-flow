import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardBody } from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import { AppointmentForm } from '../components'
import { useCreateAppointment } from '../hooks'
import { useAuthContext } from '@/context/useAuthContext'
import { isVPOrSecretary, isProtocol } from '@/hooks/useUserRole'
import type { AppointmentFormData } from '../types'

const CreateAppointmentPage = () => {
  const navigate = useNavigate()
  const { role, isLoading: authLoading } = useAuthContext()
  const createAppointment = useCreateAppointment()

  useEffect(() => {
    if (!authLoading && (isProtocol(role) || !isVPOrSecretary(role))) {
      navigate('/dashboards', { replace: true })
    }
  }, [role, authLoading, navigate])

  if (!authLoading && (isProtocol(role) || !isVPOrSecretary(role))) return null

  const handleSubmit = (formData: AppointmentFormData) => {
    createAppointment.mutate(formData, { onSuccess: (data) => navigate(`/appointments/${data.id}`) })
  }

  return (
    <>
      <PageTitle subName="Appointments" title="Create Appointment" />
      <Card><CardBody><AppointmentForm userRole={role} isSubmitting={createAppointment.isPending} onSubmit={handleSubmit} onCancel={() => navigate('/appointments')} /></CardBody></Card>
    </>
  )
}

export default CreateAppointmentPage
