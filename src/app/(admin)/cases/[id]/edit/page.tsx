import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardBody, Spinner, Button } from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useCase, useUpdateCase } from '../../hooks'
import { CaseForm } from '../../components'
import { useUserRole, isVP, isProtocol } from '@/hooks/useUserRole'
import { supabase } from '@/integrations/supabase/client'
import { canEditCase, type CaseFormData } from '../../types'

const EditCasePage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { role, isLoading: isRoleLoading } = useUserRole()
  const { data: caseItem, isLoading, error } = useCase(id)
  const updateCase = useUpdateCase()
  const [currentUserId, setCurrentUserId] = useState<string>()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setCurrentUserId(data.user?.id))
  }, [])

  useEffect(() => {
    if (!isRoleLoading && !isLoading && caseItem) {
      // Only VP can edit, and only non-closed cases
      if (!isVP(role) || !canEditCase(caseItem.status)) {
        navigate(`/cases/${id}`, { replace: true })
      }
    }
  }, [role, isRoleLoading, isLoading, caseItem, id, navigate])

  if (isLoading || isRoleLoading) {
    return (
      <>
        <PageTitle subName="Cases" title="Edit Case" />
        <Card>
          <CardBody className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Loading...</p>
          </CardBody>
        </Card>
      </>
    )
  }

  if (isProtocol(role)) {
    navigate('/dashboards', { replace: true })
    return null
  }

  if (error || !caseItem) {
    return (
      <>
        <PageTitle subName="Cases" title="Not Found" />
        <Card>
          <CardBody className="text-center py-5">
            <IconifyIcon icon="bx:error-circle" className="text-danger fs-1 mb-3" />
            <h5>Case Not Found</h5>
            <Button variant="primary" onClick={() => navigate('/cases')}>Back</Button>
          </CardBody>
        </Card>
      </>
    )
  }

  const handleSubmit = (formData: CaseFormData) => {
    if (!id) return
    updateCase.mutate({ id, formData }, { onSuccess: () => navigate(`/cases/${id}`) })
  }

  return (
    <>
      <PageTitle subName="Cases" title="Edit Case" />
      <Card>
        <CardBody>
          <CaseForm
            initialData={caseItem}
            userRole={role}
            isSubmitting={updateCase.isPending}
            onSubmit={handleSubmit}
            onCancel={() => navigate(`/cases/${id}`)}
          />
        </CardBody>
      </Card>
    </>
  )
}

export default EditCasePage
