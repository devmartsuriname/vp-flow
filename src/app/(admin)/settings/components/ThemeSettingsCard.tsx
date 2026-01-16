/**
 * ThemeSettingsCard - Functional theme preferences using existing context
 * Module 9 - Settings & System Configuration
 */

import { Card, CardBody, CardHeader, Form, Button, Row, Col } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useLayoutContext } from '@/context/useLayoutContext'

export function ThemeSettingsCard() {
  const { 
    themeMode, 
    topbarTheme, 
    menu, 
    changeTheme, 
    changeTopbarTheme, 
    changeMenu,
    resetSettings 
  } = useLayoutContext()

  return (
    <Card className="h-100">
      <CardHeader className="border-bottom d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">
          <IconifyIcon icon="bx:palette" className="me-2" />
          Theme Preferences
        </h5>
        <Button variant="soft-secondary" size="sm" onClick={resetSettings}>
          <IconifyIcon icon="bx:reset" className="me-1" />
          Reset
        </Button>
      </CardHeader>
      <CardBody>
        <Row className="g-3">
          {/* Color Scheme */}
          <Col xs={12}>
            <Form.Label className="fw-medium mb-2">Color Scheme</Form.Label>
            <div className="d-flex gap-3">
              <Form.Check
                type="radio"
                id="theme-light"
                name="theme"
                label="Light"
                checked={themeMode === 'light'}
                onChange={() => changeTheme('light')}
              />
              <Form.Check
                type="radio"
                id="theme-dark"
                name="theme"
                label="Dark"
                checked={themeMode === 'dark'}
                onChange={() => changeTheme('dark')}
              />
            </div>
          </Col>

          {/* Topbar Theme */}
          <Col xs={12}>
            <Form.Label className="fw-medium mb-2">Topbar Theme</Form.Label>
            <div className="d-flex gap-3">
              <Form.Check
                type="radio"
                id="topbar-light"
                name="topbar"
                label="Light"
                checked={topbarTheme === 'light'}
                onChange={() => changeTopbarTheme('light')}
              />
              <Form.Check
                type="radio"
                id="topbar-dark"
                name="topbar"
                label="Dark"
                checked={topbarTheme === 'dark'}
                onChange={() => changeTopbarTheme('dark')}
              />
            </div>
          </Col>

          {/* Menu Theme */}
          <Col xs={12}>
            <Form.Label className="fw-medium mb-2">Menu Theme</Form.Label>
            <div className="d-flex gap-3">
              <Form.Check
                type="radio"
                id="menu-light"
                name="menu-theme"
                label="Light"
                checked={menu.theme === 'light'}
                onChange={() => changeMenu.theme('light')}
              />
              <Form.Check
                type="radio"
                id="menu-dark"
                name="menu-theme"
                label="Dark"
                checked={menu.theme === 'dark'}
                onChange={() => changeMenu.theme('dark')}
              />
            </div>
          </Col>

          {/* Sidebar Size */}
          <Col xs={12}>
            <Form.Label className="fw-medium mb-2">Sidebar Size</Form.Label>
            <div className="d-flex flex-wrap gap-3">
              <Form.Check
                type="radio"
                id="sidebar-default"
                name="sidebar-size"
                label="Default"
                checked={menu.size === 'default'}
                onChange={() => changeMenu.size('default')}
              />
              <Form.Check
                type="radio"
                id="sidebar-condensed"
                name="sidebar-size"
                label="Condensed"
                checked={menu.size === 'condensed'}
                onChange={() => changeMenu.size('condensed')}
              />
              <Form.Check
                type="radio"
                id="sidebar-hidden"
                name="sidebar-size"
                label="Hidden"
                checked={menu.size === 'hidden'}
                onChange={() => changeMenu.size('hidden')}
              />
              <Form.Check
                type="radio"
                id="sidebar-sm-hover"
                name="sidebar-size"
                label="Small Hover"
                checked={menu.size === 'sm-hover'}
                onChange={() => changeMenu.size('sm-hover')}
              />
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}
