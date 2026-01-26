import { useRef, useEffect, useCallback, useState } from 'react'
import { Card, Button, Spinner } from 'react-bootstrap'
import getStroke from 'perfect-freehand'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import type { HandwritingCanvasData } from '../types'

type HandwritingViewerProps = {
  canvasData: HandwritingCanvasData
  onEdit?: () => void
  onDelete?: () => void
  isDeleting?: boolean
  readOnly?: boolean
}

// Convert perfect-freehand points to SVG path
function getSvgPathFromStroke(stroke: number[][]): string {
  if (!stroke.length) return ''

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length]
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2)
      return acc
    },
    ['M', ...stroke[0], 'Q']
  )

  d.push('Z')
  return d.join(' ')
}

export default function HandwritingViewer({
  canvasData,
  onEdit,
  onDelete,
  isDeleting = false,
  readOnly = false,
}: HandwritingViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const { canvasWidth, canvasHeight, strokes } = canvasData

  // Handle responsive scaling
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth
        const newScale = Math.min(1, containerWidth / canvasWidth)
        setScale(newScale)
      }
    }

    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [canvasWidth])

  // Render strokes to canvas
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear and fill background
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    // Draw all strokes
    strokes.forEach((stroke) => {
      const points = stroke.points.map((p) => [p.x, p.y, p.pressure ?? 0.5])
      const outlinePoints = getStroke(points, {
        size: stroke.size,
        thinning: 0.5,
        smoothing: 0.5,
        streamline: 0.5,
      })
      
      const pathData = getSvgPathFromStroke(outlinePoints)
      const path = new Path2D(pathData)
      ctx.fillStyle = stroke.color
      ctx.fill(path)
    })
  }, [strokes, canvasWidth, canvasHeight])

  // Render on mount and when data changes
  useEffect(() => {
    renderCanvas()
  }, [renderCanvas])

  const handleDeleteClick = () => {
    if (showDeleteConfirm) {
      onDelete?.()
      setShowDeleteConfirm(false)
    } else {
      setShowDeleteConfirm(true)
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false)
  }

  return (
    <Card className="mb-3">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <IconifyIcon icon="bx:pen" className="me-2" />
          Handwriting
        </h5>
        {!readOnly && (
          <div className="d-flex gap-2">
            {onEdit && (
              <Button
                variant="outline-primary"
                size="sm"
                onClick={onEdit}
                disabled={isDeleting}
              >
                <IconifyIcon icon="bx:edit" className="me-1" />
                Edit
              </Button>
            )}
            {onDelete && (
              <>
                {showDeleteConfirm ? (
                  <>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={handleCancelDelete}
                      disabled={isDeleting}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={handleDeleteClick}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        'Confirm Delete'
                      )}
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={handleDeleteClick}
                    disabled={isDeleting}
                  >
                    <IconifyIcon icon="bx:trash" className="me-1" />
                    Delete
                  </Button>
                )}
              </>
            )}
          </div>
        )}
      </Card.Header>
      <Card.Body>
        <div
          ref={containerRef}
          className="border rounded"
          style={{
            overflow: 'hidden',
            backgroundColor: '#ffffff',
          }}
        >
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            style={{
              width: canvasWidth * scale,
              height: canvasHeight * scale,
              display: 'block',
            }}
          />
        </div>
        <div className="mt-2 text-muted small">
          <span>Strokes: {strokes.length}</span>
          <span className="ms-3">
            Last updated: {new Date(canvasData.updatedAt).toLocaleString()}
          </span>
        </div>
      </Card.Body>
    </Card>
  )
}
