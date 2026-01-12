import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardBody, Spinner, Button } from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useCase, useUpdateCase } from '../../hooks'
import { CaseForm } from '../../components'
import { useAuthContext } from '@/context/useAuthContext'
import { isVP, isProtocol } from '@/hooks/useUserRole'
import { supabase } from '@/integrations/supabase/client'
import { canEditCase, type CaseFormData } from '../../types'

const EditCasePage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { role, isLoading: authLoading } = useAuthContext()
  const { data: caseItem, isLoading, error } = useCase(id)
  const updateCase = useUpdateCase()
  const [currentUserId, setCurrentUserId] = useState<string>()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setCurrentUserId(data.user?.id))
  }, [])

  useEffect(() => {
    if (!authLoading && !isLoading && caseItem) {
      // Only VP can edit, and only non-closed cases
      if (!isVP(role) || !canEditCase(caseItem.status)) {
        navigate(`/cases/${id}`, { replace: true })
      }
    }
  }, [role, authLoading, isLoading, caseItem, id, navigate])

  useEffect(() => {
    if (!authLoading && isProtocol(role)) {
      navigate('/dashboards', { replace: true })
    }
  }, [role, authLoading, navigate])

  if (isLoading) {
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

  if (!authLoading && isProtocol(role)) return null

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
