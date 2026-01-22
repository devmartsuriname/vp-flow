import { useState, useCallback } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { useDropzone } from 'react-dropzone'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { isAllowedFileType, isValidFileSize, formatFileSize, ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from '../types'
import type { DocumentEntityType } from '../types'

type UploadModalProps = {
  show: boolean
  onHide: () => void
  onUpload: (file: File, title: string, description: string) => void
  isLoading: boolean
  entityType: DocumentEntityType
  entityName: string
}

export default function UploadModal({
  show,
  onHide,
  onUpload,
  isLoading,
  entityType,
  entityName,
}: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null)
    const selectedFile = acceptedFiles[0]
    
    if (!selectedFile) return

    if (!isAllowedFileType(selectedFile.type)) {
      setError('File type not allowed. Allowed types: PDF, JPEG, PNG, GIF, DOC, DOCX, XLS, XLSX, TXT')
      return
    }

    if (!isValidFileSize(selectedFile.size)) {
      setError(`File too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}`)
      return
    }

    setFile(selectedFile)
    if (!title) {
      setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''))
    }
  }, [title])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ALLOWED_MIME_TYPES.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxFiles: 1,
    disabled: isLoading,
  })

  const handleSubmit = () => {
    if (!file) {
      setError('Please select a file')
      return
    }
    onUpload(file, title || file.name, description)
  }

  const handleClose = () => {
    setFile(null)
    setTitle('')
    setDescription('')
    setError(null)
    onHide()
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <IconifyIcon icon="bx:upload" className="me-2" />
          Upload Document
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <small className="text-muted">
            Linking to: <strong>{entityName}</strong> ({entityType})
          </small>
        </div>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`border border-2 border-dashed rounded p-4 text-center cursor-pointer mb-3 ${
            isDragActive ? 'border-primary bg-primary bg-opacity-10' : 'border-secondary'
          } ${isLoading ? 'opacity-50' : ''}`}
          style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
        >
          <input {...getInputProps()} />
          {file ? (
            <div>
              <IconifyIcon icon="bx:check-circle" className="fs-1 text-success mb-2" />
              <p className="mb-1 fw-medium">{file.name}</p>
              <small className="text-muted">{formatFileSize(file.size)}</small>
            </div>
          ) : isDragActive ? (
            <div>
              <IconifyIcon icon="bx:upload" className="fs-1 text-primary mb-2" />
              <p className="mb-0">Drop the file here...</p>
            </div>
          ) : (
            <div>
              <IconifyIcon icon="bx:cloud-upload" className="fs-1 text-muted mb-2" />
              <p className="mb-1">Drag & drop a file here, or click to select</p>
              <small className="text-muted">Max size: 50MB</small>
            </div>
          )}
        </div>

        {error && (
          <div className="alert alert-danger py-2 mb-3">
            <small>{error}</small>
          </div>
        )}

        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Document title"
            disabled={isLoading}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description (optional)</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description..."
            disabled={isLoading}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={isLoading || !file}>
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-1" />
              Uploading...
            </>
          ) : (
            <>
              <IconifyIcon icon="bx:upload" className="me-1" />
              Upload
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
