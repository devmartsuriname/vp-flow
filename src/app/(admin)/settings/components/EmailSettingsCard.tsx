/**
 * EmailSettingsCard — VP-only SMTP configuration + Test Connection.
 * TC-006 Phase 1A.2 — Email Notifications.
 *
 * VP-only: caller (settings/page.tsx) guards on role === 'vp'. Card assumes VP.
 */

import { useEffect, useState } from 'react'
import { Card, Form, Row, Col, Button, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { supabase } from '@/integrations/supabase/client'
import { useGetEmailSettings, useUpsertEmailSettings, type EmailSettingsUpdate } from '../hooks/useEmailSettings'

const EMPTY_FORM: EmailSettingsUpdate = {
  smtp_host: '',
  smtp_port: 465,
  smtp_username: '',
  smtp_password: '',
  from_address: '',
  from_name: '',
  enabled: false,
}

const EmailSettingsCard = () => {
  const { data, isLoading, error } = useGetEmailSettings()
  const upsert = useUpsertEmailSettings()

  const [form, setForm] = useState<EmailSettingsUpdate>(EMPTY_FORM)
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    if (data) {
      setForm({
        smtp_host: data.smtp_host,
        smtp_port: data.smtp_port,
        smtp_username: data.smtp_username,
        smtp_password: data.smtp_password,
        from_address: data.from_address,
        from_name: data.from_name,
        enabled: data.enabled,
      })
    }
  }, [data])

  const handleChange = <K extends keyof EmailSettingsUpdate>(key: K, value: EmailSettingsUpdate[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    if (!data) return
    try {
      await upsert.mutateAsync({ id: data.id, values: form })
      toast.success('Email settings saved')
    } catch (e) {
      console.error('Save email settings error:', e)
      toast.error('Failed to save email settings')
    }
  }

  const handleTest = async () => {
    setTesting(true)
    try {
      const { data: result, error: invokeError } = await supabase.functions.invoke(
        'send-email-notification',
        { body: { test: true } },
      )
      if (invokeError) throw invokeError
      if (result?.skipped) {
        toast.warn('Email is disabled — enable it and save first')
      } else if (result?.error) {
        toast.error(`Test failed: ${result.error}`)
      } else {
        toast.success(`Test email sent to ${form.from_address || 'configured address'}`)
      }
    } catch (e) {
      console.error('Test connection error:', e)
      const msg = e instanceof Error ? e.message : 'Test connection failed'
      toast.error(msg)
    } finally {
      setTesting(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <Card.Header><h4 className="header-title mb-0">Email Notifications</h4></Card.Header>
        <Card.Body className="d-flex justify-content-center py-4">
          <Spinner animation="border" variant="primary" />
        </Card.Body>
      </Card>
    )
  }

  if (error || !data) {
    return (
      <Card>
        <Card.Header><h4 className="header-title mb-0">Email Notifications</h4></Card.Header>
        <Card.Body>
          <p className="text-danger mb-0">Failed to load email settings.</p>
        </Card.Body>
      </Card>
    )
  }

  return (
    <Card>
      <Card.Header>
        <h4 className="header-title mb-0">Email Notifications</h4>
      </Card.Header>
      <Card.Body>
        <Row className="g-3">
          <Col md={8}>
            <Form.Label>SMTP Host</Form.Label>
            <Form.Control
              type="text"
              value={form.smtp_host}
              onChange={(e) => handleChange('smtp_host', e.target.value)}
              placeholder="smtp.hostinger.com"
            />
          </Col>
          <Col md={4}>
            <Form.Label>Port</Form.Label>
            <Form.Control
              type="number"
              value={form.smtp_port}
              onChange={(e) => handleChange('smtp_port', Number(e.target.value) || 0)}
            />
          </Col>

          <Col md={6}>
            <Form.Label>SMTP Username</Form.Label>
            <Form.Control
              type="text"
              value={form.smtp_username}
              onChange={(e) => handleChange('smtp_username', e.target.value)}
              autoComplete="off"
            />
          </Col>
          <Col md={6}>
            <Form.Label>SMTP Password</Form.Label>
            <Form.Control
              type="password"
              value={form.smtp_password}
              onChange={(e) => handleChange('smtp_password', e.target.value)}
              autoComplete="new-password"
            />
          </Col>

          <Col md={6}>
            <Form.Label>From Address</Form.Label>
            <Form.Control
              type="email"
              value={form.from_address}
              onChange={(e) => handleChange('from_address', e.target.value)}
              placeholder="noreply@example.com"
            />
          </Col>
          <Col md={6}>
            <Form.Label>From Name</Form.Label>
            <Form.Control
              type="text"
              value={form.from_name}
              onChange={(e) => handleChange('from_name', e.target.value)}
              placeholder="VP-Flow"
            />
          </Col>

          <Col xs={12}>
            <Form.Check
              type="switch"
              id="email-enabled-toggle"
              label="Enable email notifications"
              checked={form.enabled}
              onChange={(e) => handleChange('enabled', e.target.checked)}
            />
          </Col>

          <Col xs={12} className="d-flex gap-2 justify-content-end">
            <Button
              variant="outline-secondary"
              onClick={handleTest}
              disabled={testing || upsert.isPending}
            >
              {testing ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Testing…
                </>
              ) : (
                'Test Verbinding'
              )}
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={upsert.isPending || testing}
            >
              {upsert.isPending ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Saving…
                </>
              ) : (
                'Opslaan'
              )}
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}

export default EmailSettingsCard
