import { currentYear, developedBy, developedByLink } from '@/context/constants'
import { Col, Row } from 'react-bootstrap'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container-fluid">
        <Row>
          <Col xs={12} className=" text-center">
            © {currentYear} VP-Flow. All rights reserved. Developed by{' '}
            <a href={developedByLink} target="_blank" rel="noopener noreferrer">
              {developedBy}
            </a>
          </Col>
        </Row>
      </div>
    </footer>
  )
}

export default Footer
