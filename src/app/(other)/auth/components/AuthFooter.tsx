import { currentYear, developedBy, developedByLink } from '@/context/constants'

const AuthFooter = () => {
  return (
    <p className="text-muted text-center small mt-4 mb-0">
      © {currentYear} VP-Flow. All rights reserved. Developed by{' '}
      <a
        href={developedByLink}
        target="_blank"
        rel="noopener noreferrer"
        className="text-decoration-none fw-medium"
      >
        {developedBy}
      </a>
    </p>
  )
}

export default AuthFooter
