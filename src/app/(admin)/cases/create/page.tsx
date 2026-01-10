import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardBody, Spinner } from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import { CaseForm } from '../components'
import { useCreateCase } from '../hooks'
import { useUserRole, isVP, isProtocol } from '@/hooks/useUserRole'
import type { CaseFormData } from '../types'

const CreateCasePage = () => {
  const navigate = useNavigate()
  const { role, isLoading: isRoleLoading } = useUserRole()
  const createCase = useCreateCase()

  useEffect(() => {
    if (!isRoleLoading && !isVP(role)) {
      navigate('/dashboards', { replace: true })
    }
  }, [role, isRoleLoading, navigate])

  if (isRoleLoading) {
    return (
      <>
        <PageTitle subName="Cases" title="Create Case" />
        <Card>
          <CardBody className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Loading...</p>
          </CardBody>
        </Card>
      </>
    )
  }

  if (!isVP(role)) return null

  const handleSubmit = (formData: CaseFormData) => {
    createCase.mutate(formData, {
      onSuccess: (data) => navigate(`/cases/${data.id}`),
    })
  }

  return (
    <>
      <PageTitle subName="Cases" title="Create Case" />
      <Card>
        <CardBody>
          <CaseForm
            userRole={role}
            isSubmitting={createCase.isPending}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/cases')}
          />
        </CardBody>
      </Card>
    </>
  )
}

export default CreateCasePage
