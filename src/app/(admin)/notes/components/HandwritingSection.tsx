import { useState } from 'react'
import { Card, Button, Spinner } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useHandwriting } from '../hooks/useHandwriting'
import { useSaveHandwriting, useDeleteHandwriting } from '../hooks/useHandwritingMutations'
import HandwritingCanvas from './HandwritingCanvas'
import HandwritingViewer from './HandwritingViewer'
import type { HandwritingCanvasData } from '../types'

type HandwritingSectionProps = {
  noteId: string
  userId: string
  readOnly?: boolean
}

export default function HandwritingSection({
  noteId,
  userId,
  readOnly = false,
}: HandwritingSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  
  const { data: handwritingResult, isLoading, error } = useHandwriting(noteId)
  const saveMutation = useSaveHandwriting()
  const deleteMutation = useDeleteHandwriting()

  const hasHandwriting = handwritingResult?.record && handwritingResult?.data

  const handleSave = (canvasData: HandwritingCanvasData) => {
    saveMutation.mutate(
      {
        noteId,
        userId,
        canvasData,
        existingRecordId: handwritingResult?.record?.id,
      },
      {
        onSuccess: () => {
          setIsEditing(false)
        },
      }
    )
  }

  const handleDelete = () => {
    if (!handwritingResult?.record) return
    
    deleteMutation.mutate(
      {
        recordId: handwritingResult.record.id,
        noteId,
      },
      {
        onSuccess: () => {
          setIsEditing(false)
        },
      }
    )
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleStartEditing = () => {
    setIsEditing(true)
  }

  const handleAddHandwriting = () => {
    setIsEditing(true)
  }

  // Loading state
  if (isLoading) {
    return (
      <Card className="mb-3">
        <Card.Body className="text-center py-4">
          <Spinner animation="border" size="sm" className="me-2" />
          Loading handwriting...
        </Card.Body>
      </Card>
    )
  }

  // Error state
  if (error) {
    return (
      <Card className="mb-3 border-danger">
        <Card.Body className="text-danger">
          <IconifyIcon icon="bx:error-circle" className="me-2" />
          Failed to load handwriting
        </Card.Body>
      </Card>
    )
  }

  // Editing mode (new or edit existing)
  if (isEditing) {
    return (
      <HandwritingCanvas
        noteId={noteId}
        existingData={handwritingResult?.data}
        onSave={handleSave}
        onCancel={handleCancel}
        isSaving={saveMutation.isPending}
      />
    )
  }

  // View existing handwriting
  if (hasHandwriting && handwritingResult.data) {
    return (
      <HandwritingViewer
        canvasData={handwritingResult.data}
        onEdit={readOnly ? undefined : handleStartEditing}
        onDelete={readOnly ? undefined : handleDelete}
        isDeleting={deleteMutation.isPending}
        readOnly={readOnly}
      />
    )
  }

  // No handwriting - show add button
  if (readOnly) {
    return null // Don't show anything in read-only mode if no handwriting
  }

  return (
    <Card className="mb-3">
      <Card.Body className="text-center py-4">
        <p className="text-muted mb-3">No handwriting attached to this note</p>
        <Button variant="outline-primary" onClick={handleAddHandwriting}>
          <IconifyIcon icon="bx:pen" className="me-2" />
          Add Handwriting
        </Button>
      </Card.Body>
    </Card>
  )
}
