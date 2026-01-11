import logoDark from '@/assets/images/vpflow-logo-dark.png'
import logoLight from '@/assets/images/vpflow-logo-light.png'
import logoSm from '@/assets/images/vpflow-logo-sm.png'
import { Link } from 'react-router-dom'

const LogoBox = () => {
  return (
    <div className="logo-box">
      <Link to="/dashboards" className="logo-dark">
        <img width={24} height={24} src={logoSm} className="logo-sm" alt="VP-Flow logo" />
        <img width={114} height={28} src={logoDark} className="logo-lg" alt="VP-Flow" />
      </Link>
      <Link to="/dashboards" className="logo-light">
        <img width={24} height={24} src={logoSm} className="logo-sm" alt="VP-Flow logo" />
        <img width={114} height={28} src={logoLight} className="logo-lg" alt="VP-Flow" />
      </Link>
    </div>
  )
}

export default LogoBox
