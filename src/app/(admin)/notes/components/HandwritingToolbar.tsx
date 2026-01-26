import { ButtonGroup, Button } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { PEN_SIZES, type PenSize } from '../types'

type HandwritingToolbarProps = {
  currentSize: PenSize
  onSizeChange: (size: PenSize) => void
  onClear: () => void
  onSave: () => void
  onCancel: () => void
  isSaving?: boolean
  disabled?: boolean
}

export default function HandwritingToolbar({
  currentSize,
  onSizeChange,
  onClear,
  onSave,
  onCancel,
  isSaving = false,
  disabled = false,
}: HandwritingToolbarProps) {
  return (
    <div className="d-flex justify-content-between align-items-center mb-2">
      {/* Pen Size Selector */}
      <div className="d-flex align-items-center gap-2">
        <span className="text-muted small">Pen Size:</span>
        <ButtonGroup size="sm">
          <Button
            variant={currentSize === 'thin' ? 'primary' : 'outline-secondary'}
            onClick={() => onSizeChange('thin')}
            disabled={disabled}
            title="Thin"
          >
            <IconifyIcon icon="bx:minus" />
          </Button>
          <Button
            variant={currentSize === 'medium' ? 'primary' : 'outline-secondary'}
            onClick={() => onSizeChange('medium')}
            disabled={disabled}
            title="Medium"
          >
            <IconifyIcon icon="bx:edit-alt" />
          </Button>
          <Button
            variant={currentSize === 'thick' ? 'primary' : 'outline-secondary'}
            onClick={() => onSizeChange('thick')}
            disabled={disabled}
            title="Thick"
          >
            <IconifyIcon icon="bx:brush" />
          </Button>
        </ButtonGroup>
      </div>

      {/* Action Buttons */}
      <div className="d-flex gap-2">
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={onClear}
          disabled={disabled || isSaving}
        >
          <IconifyIcon icon="bx:eraser" className="me-1" />
          Clear
        </Button>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={onSave}
          disabled={disabled || isSaving}
        >
          {isSaving ? (
            <>
              <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />
              Saving...
            </>
          ) : (
            <>
              <IconifyIcon icon="bx:save" className="me-1" />
              Save
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
