import { useState, useEffect } from 'react'
import { Form, Row, Col, Button, Spinner } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { supabase } from '@/integrations/supabase/client'
import type { NoteEntityType } from '../types'
import { ENTITY_TYPE_LABELS } from '../types'

type EntityLinkSelectorProps = {
  entityType: NoteEntityType | null
  entityId: string | null
  onChange: (type: NoteEntityType | null, id: string | null) => void
  disabled?: boolean
}

type EntityOption = {
  id: string
  label: string
}

export default function EntityLinkSelector({
  entityType,
  entityId,
  onChange,
  disabled = false,
}: EntityLinkSelectorProps) {
  const [entities, setEntities] = useState<EntityOption[]>([])
  const [loadingEntities, setLoadingEntities] = useState(false)

  // Fetch entities when type changes
  useEffect(() => {
    if (!entityType) {
      setEntities([])
      return
    }

    const fetchEntities = async () => {
      setLoadingEntities(true)
      try {
        if (entityType === 'guest') {
          const { data } = await supabase
            .from('clients')
            .select('id, first_name, last_name, organization_name, client_type')
            .order('created_at', { ascending: false })
            .limit(100)

          if (data) {
            setEntities(
              data.map((c) => ({
                id: c.id,
                label:
                  c.client_type === 'organization'
                    ? c.organization_name || 'Unnamed Organization'
                    : `${c.first_name || ''} ${c.last_name || ''}`.trim() || 'Unnamed Guest',
              }))
            )
          }
        } else if (entityType === 'appointment') {
          const { data } = await supabase
            .from('appointments')
            .select('id, subject, scheduled_date')
            .order('scheduled_date', { ascending: false })
            .limit(100)

          if (data) {
            setEntities(
              data.map((a) => ({
                id: a.id,
                label: `${a.subject} (${a.scheduled_date})`,
              }))
            )
          }
        } else if (entityType === 'case') {
          const { data } = await supabase
            .from('cases')
            .select('id, title, case_number')
            .order('created_at', { ascending: false })
            .limit(100)

          if (data) {
            setEntities(
              data.map((c) => ({
                id: c.id,
                label: `${c.case_number}: ${c.title}`,
              }))
            )
          }
        }
      } finally {
        setLoadingEntities(false)
      }
    }

    fetchEntities()
  }, [entityType])

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as NoteEntityType | ''
    if (newType === '') {
      onChange(null, null)
    } else {
      onChange(newType, null)
    }
  }

  const handleEntityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value || null
    onChange(entityType, newId)
  }

  const handleClear = () => {
    onChange(null, null)
  }

  return (
    <Row className="g-3 align-items-end">
      <Col md={4}>
        <Form.Group>
          <Form.Label>Entity Type</Form.Label>
          <Form.Select
            value={entityType || ''}
            onChange={handleTypeChange}
            disabled={disabled}
          >
            <option value="">No link</option>
            {(Object.keys(ENTITY_TYPE_LABELS) as NoteEntityType[]).map((type) => (
              <option key={type} value={type}>
                {ENTITY_TYPE_LABELS[type]}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Col>
      <Col md={6}>
        <Form.Group>
          <Form.Label>Select {entityType ? ENTITY_TYPE_LABELS[entityType] : 'Entity'}</Form.Label>
          <Form.Select
            value={entityId || ''}
            onChange={handleEntityChange}
            disabled={disabled || !entityType || loadingEntities}
          >
            <option value="">
              {loadingEntities ? 'Loading...' : `Select a ${entityType ? ENTITY_TYPE_LABELS[entityType].toLowerCase() : 'entity'}...`}
            </option>
            {entities.map((entity) => (
              <option key={entity.id} value={entity.id}>
                {entity.label}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Col>
      <Col md={2}>
        {(entityType || entityId) && (
          <Button
            variant="outline-secondary"
            onClick={handleClear}
            disabled={disabled}
            className="w-100"
          >
            <IconifyIcon icon="bx:x" />
            Clear
          </Button>
        )}
      </Col>
    </Row>
  )
}
