import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardBody, Spinner, Button } from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useCase, useUpdateCaseStatus, useCloseCase } from '../hooks'
import { CaseDetail, CaseActions, CloseModal } from '../components'
import { useUserRole, isVP, isSecretary, isProtocol } from '@/hooks/useUserRole'
import { supabase } from '@/integrations/supabase/client'

const CaseDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { role, isLoading: isRoleLoading } = useUserRole()
  const { data: caseItem, isLoading, error } = useCase(id)
  const [currentUserId, setCurrentUserId] = useState<string>()
  const [showCloseModal, setShowCloseModal] = useState(false)

  const updateCaseStatus = useUpdateCaseStatus()
  const closeCase = useCloseCase()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setCurrentUserId(data.user?.id))
  }, [])

  useEffect(() => {
    if (!isRoleLoading && isProtocol(role)) {
      navigate('/dashboards', { replace: true })
    }
  }, [role, isRoleLoading, navigate])

  if (isLoading || isRoleLoading) {
    return (
      <>
        <PageTitle subName="Cases" title="Case Details" />
        <Card>
          <CardBody className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Loading...</p>
          </CardBody>
        </Card>
      </>
    )
  }

  if (isProtocol(role)) return null

  if (error || !caseItem) {
    return (
      <>
        <PageTitle subName="Cases" title="Not Found" />
        <Card>
          <CardBody className="text-center py-5">
            <IconifyIcon icon="bx:error-circle" className="text-danger fs-1 mb-3" />
            <h5>Case Not Found</h5>
            <Button variant="primary" onClick={() => navigate('/cases')}>Back to Cases</Button>
          </CardBody>
        </Card>
      </>
    )
  }

  const handleOpen = () => updateCaseStatus.mutate({ id: caseItem.id, status: 'open' })
  const handleStartWork = () => updateCaseStatus.mutate({ id: caseItem.id, status: 'in_progress' })
  const handlePark = () => updateCaseStatus.mutate({ id: caseItem.id, status: 'parked' })
  const handleResume = () => updateCaseStatus.mutate({ id: caseItem.id, status: 'in_progress' })
  const handleCloseConfirm = (resolutionSummary: string) => {
    closeCase.mutate({ id: caseItem.id, resolutionSummary }, { onSuccess: () => setShowCloseModal(false) })
  }

  return (
    <>
      <PageTitle subName="Cases" title="Case Details" />
      <div className="mb-3">
        <Button variant="outline-secondary" onClick={() => navigate('/cases')}>
          <IconifyIcon icon="bx:arrow-back" className="me-1" />
          Back to Cases
        </Button>
      </div>
      <CaseDetail caseItem={caseItem} userRole={role} />
      <Card className="mt-3">
        <CardBody>
          <CaseActions
            caseItem={caseItem}
            userRole={role}
            onOpen={handleOpen}
            onStartWork={handleStartWork}
            onPark={handlePark}
            onResume={handleResume}
            onClose={() => setShowCloseModal(true)}
            isUpdating={updateCaseStatus.isPending || closeCase.isPending}
          />
        </CardBody>
      </Card>
      <CloseModal
        show={showCloseModal}
        onHide={() => setShowCloseModal(false)}
        onConfirm={handleCloseConfirm}
        isLoading={closeCase.isPending}
        caseTitle={caseItem.title}
      />
    </>
  )
}

export default CaseDetailPage
