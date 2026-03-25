import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardBody } from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import { IncomingPostForm } from '../components'
import { useCreateIncomingPost } from '../hooks'
import { useAuthContext } from '@/context/useAuthContext'
import { isVPOrSecretary } from '@/hooks/useUserRole'
import type { IncomingPostFormData } from '../types'

const CreateIncomingPostPage = () => {
  const navigate = useNavigate()
  const { role, isLoading: authLoading } = useAuthContext()
  const createPost = useCreateIncomingPost()

  useEffect(() => {
    if (!authLoading && !isVPOrSecretary(role)) {
      navigate('/dashboards', { replace: true })
    }
  }, [role, authLoading, navigate])

  if (!authLoading && !isVPOrSecretary(role)) return null

  const handleSubmit = (formData: IncomingPostFormData) => {
    createPost.mutate(formData, {
      onSuccess: (data) => navigate(`/incoming-post/${data.id}`),
    })
  }

  return (
    <>
      <PageTitle subName="Incoming Post" title="Register Post" />
      <Card>
        <CardBody>
          <IncomingPostForm
            isSubmitting={createPost.isPending}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/incoming-post')}
          />
        </CardBody>
      </Card>
    </>
  )
}

export default CreateIncomingPostPage
