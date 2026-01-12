import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardBody } from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import { CaseForm } from '../components'
import { useCreateCase } from '../hooks'
import { useAuthContext } from '@/context/useAuthContext'
import { isVP } from '@/hooks/useUserRole'
import type { CaseFormData } from '../types'

const CreateCasePage = () => {
  const navigate = useNavigate()
  const { role, isLoading: authLoading } = useAuthContext()
  const createCase = useCreateCase()

  useEffect(() => {
    if (!authLoading && !isVP(role)) {
      navigate('/dashboards', { replace: true })
    }
  }, [role, authLoading, navigate])

  if (!authLoading && !isVP(role)) return null

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
