import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardBody, Spinner, Button } from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useAppointment, useSubmitAppointment, useApproveAppointment, useRejectAppointment, useCancelAppointment, useCompleteAppointment } from '../hooks'
import { AppointmentDetail, AppointmentActions, ApproveRejectModal } from '../components'
import { useUserRole, isVP, isSecretary, isProtocol } from '@/hooks/useUserRole'
import { supabase } from '@/integrations/supabase/client'

const AppointmentDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { role, isLoading: isRoleLoading } = useUserRole()
  const { data: appointment, isLoading, error } = useAppointment(id)
  const [currentUserId, setCurrentUserId] = useState<string>()
  const [modalMode, setModalMode] = useState<'approve' | 'reject' | null>(null)

  const submitAppointment = useSubmitAppointment()
  const approveAppointment = useApproveAppointment()
  const rejectAppointment = useRejectAppointment()
  const cancelAppointment = useCancelAppointment()
  const completeAppointment = useCompleteAppointment()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setCurrentUserId(data.user?.id))
  }, [])

  useEffect(() => {
    if (!isRoleLoading && !isLoading && appointment) {
      if (isProtocol(role) && appointment.status !== 'approved') {
        navigate('/appointments', { replace: true })
      } else if (isSecretary(role) && appointment.visibility === 'vp_only') {
        navigate('/appointments', { replace: true })
      }
    }
  }, [role, isRoleLoading, isLoading, appointment, navigate])

  if (isLoading || isRoleLoading) {
    return (<><PageTitle subName="Appointments" title="Appointment Details" /><Card><CardBody className="text-center py-5"><Spinner animation="border" variant="primary" /><p className="mt-2 text-muted">Loading...</p></CardBody></Card></>)
  }

  if (error || !appointment) {
    return (<><PageTitle subName="Appointments" title="Not Found" /><Card><CardBody className="text-center py-5"><IconifyIcon icon="bx:error-circle" className="text-danger fs-1 mb-3" /><h5>Appointment Not Found</h5><Button variant="primary" onClick={() => navigate('/appointments')}>Back to Appointments</Button></CardBody></Card></>)
  }

  const handleApproveConfirm = () => {
    approveAppointment.mutate(appointment.id, { onSuccess: () => setModalMode(null) })
  }

  const handleRejectConfirm = (reason?: string) => {
    if (reason) rejectAppointment.mutate({ id: appointment.id, reason }, { onSuccess: () => setModalMode(null) })
  }

  return (
    <>
      <PageTitle subName="Appointments" title="Appointment Details" />
      <div className="mb-3">
        <Button variant="outline-secondary" onClick={() => navigate('/appointments')}><IconifyIcon icon="bx:arrow-back" className="me-1" />Back to Appointments</Button>
      </div>
      <AppointmentDetail appointment={appointment} userRole={role} />
      <Card className="mt-3"><CardBody>
        <AppointmentActions
          appointment={appointment}
          userRole={role}
          currentUserId={currentUserId}
          onSubmit={() => submitAppointment.mutate(appointment.id)}
          onApprove={() => setModalMode('approve')}
          onReject={() => setModalMode('reject')}
          onCancel={() => cancelAppointment.mutate(appointment.id)}
          onComplete={() => completeAppointment.mutate(appointment.id)}
          isSubmitting={submitAppointment.isPending}
          isApproving={approveAppointment.isPending}
          isRejecting={rejectAppointment.isPending}
          isCancelling={cancelAppointment.isPending}
          isCompleting={completeAppointment.isPending}
        />
      </CardBody></Card>
      <ApproveRejectModal show={!!modalMode} mode={modalMode || 'approve'} isLoading={approveAppointment.isPending || rejectAppointment.isPending} onConfirm={modalMode === 'approve' ? handleApproveConfirm : handleRejectConfirm} onCancel={() => setModalMode(null)} />
    </>
  )
}

export default AppointmentDetailPage
