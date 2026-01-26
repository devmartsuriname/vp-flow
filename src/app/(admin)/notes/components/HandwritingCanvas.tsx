import { useRef, useState, useEffect, useCallback } from 'react'
import { Card } from 'react-bootstrap'
import getStroke from 'perfect-freehand'
import HandwritingToolbar from './HandwritingToolbar'
import {
  PEN_SIZES,
  type PenSize,
  type StrokePoint,
  type StrokeData,
  type HandwritingCanvasData,
} from '../types'

type HandwritingCanvasProps = {
  noteId: string
  existingData?: HandwritingCanvasData | null
  onSave: (data: HandwritingCanvasData) => void
  onCancel: () => void
  isSaving?: boolean
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

// Default canvas dimensions
const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 400

export default function HandwritingCanvas({
  noteId,
  existingData,
  onSave,
  onCancel,
  isSaving = false,
}: HandwritingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Current drawing state
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentPoints, setCurrentPoints] = useState<StrokePoint[]>([])
  const [strokes, setStrokes] = useState<StrokeData[]>(existingData?.strokes || [])
  const [penSize, setPenSize] = useState<PenSize>('medium')
  
  // Canvas scaling for responsive display
  const [scale, setScale] = useState(1)

  // Initialize strokes from existing data
  useEffect(() => {
    if (existingData?.strokes) {
      setStrokes(existingData.strokes)
    }
  }, [existingData])

  // Handle canvas resize
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth
        const newScale = Math.min(1, containerWidth / CANVAS_WIDTH)
        setScale(newScale)
      }
    }

    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [])

  // Render all strokes to canvas
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Draw all completed strokes
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

    // Draw current stroke in progress
    if (currentPoints.length > 0) {
      const points = currentPoints.map((p) => [p.x, p.y, p.pressure ?? 0.5])
      const outlinePoints = getStroke(points, {
        size: PEN_SIZES[penSize],
        thinning: 0.5,
        smoothing: 0.5,
        streamline: 0.5,
      })
      
      const pathData = getSvgPathFromStroke(outlinePoints)
      const path = new Path2D(pathData)
      ctx.fillStyle = '#000000'
      ctx.fill(path)
    }
  }, [strokes, currentPoints, penSize])

  // Re-render on stroke changes
  useEffect(() => {
    renderCanvas()
  }, [renderCanvas])

  // Get point from pointer event
  const getPointFromEvent = (e: React.PointerEvent): StrokePoint => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0, pressure: 0.5 }

    const rect = canvas.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left) / scale,
      y: (e.clientY - rect.top) / scale,
      pressure: e.pressure || 0.5,
    }
  }

  // Pointer event handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isSaving) return
    
    e.preventDefault()
    const canvas = canvasRef.current
    if (canvas) {
      canvas.setPointerCapture(e.pointerId)
    }
    
    setIsDrawing(true)
    const point = getPointFromEvent(e)
    setCurrentPoints([point])
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing || isSaving) return
    
    e.preventDefault()
    const point = getPointFromEvent(e)
    setCurrentPoints((prev) => [...prev, point])
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDrawing) return
    
    e.preventDefault()
    const canvas = canvasRef.current
    if (canvas) {
      canvas.releasePointerCapture(e.pointerId)
    }
    
    setIsDrawing(false)

    // Complete the stroke
    if (currentPoints.length > 0) {
      const newStroke: StrokeData = {
        points: currentPoints,
        size: PEN_SIZES[penSize],
        color: '#000000',
        timestamp: Date.now(),
      }
      setStrokes((prev) => [...prev, newStroke])
      setCurrentPoints([])
    }
  }

  // Clear canvas
  const handleClear = () => {
    setStrokes([])
    setCurrentPoints([])
  }

  // Save handwriting
  const handleSave = () => {
    const now = new Date().toISOString()
    const canvasData: HandwritingCanvasData = {
      version: 1,
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT,
      strokes,
      createdAt: existingData?.createdAt || now,
      updatedAt: now,
    }
    onSave(canvasData)
  }

  return (
    <Card className="mb-3">
      <Card.Header>
        <h5 className="mb-0">Handwriting Input</h5>
      </Card.Header>
      <Card.Body>
        <HandwritingToolbar
          currentSize={penSize}
          onSizeChange={setPenSize}
          onClear={handleClear}
          onSave={handleSave}
          onCancel={onCancel}
          isSaving={isSaving}
          disabled={isSaving}
        />
        
        <div 
          ref={containerRef}
          className="border rounded"
          style={{ 
            overflow: 'hidden',
            touchAction: 'none',
            backgroundColor: '#ffffff',
          }}
        >
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            style={{
              width: CANVAS_WIDTH * scale,
              height: CANVAS_HEIGHT * scale,
              cursor: isSaving ? 'not-allowed' : 'crosshair',
              display: 'block',
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          />
        </div>
        
        <div className="mt-2 text-muted small">
          <span>Strokes: {strokes.length}</span>
          {strokes.length === 0 && (
            <span className="ms-2">• Draw with mouse, stylus, or touch</span>
          )}
        </div>
      </Card.Body>
    </Card>
  )
}
