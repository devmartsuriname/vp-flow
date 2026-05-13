const logoDark = '/vp-flow-logo-light.svg'
const logoLight = '/vp-flow-logo-dark.svg'
const logoSm = '/vp-flow-icon-boxed.svg'
import { Link } from 'react-router-dom'

const LogoBox = () => {
  return (
    <div className="logo-box">
      <Link to="/dashboards" className="logo-dark">
        <img width={36} height={36} src={logoSm} className="logo-sm" alt="VP-Flow logo" />
        <img width={180} height={44} src={logoDark} className="logo-lg" alt="VP-Flow" />
      </Link>
      <Link to="/dashboards" className="logo-light">
        <img width={36} height={36} src={logoSm} className="logo-sm" alt="VP-Flow logo" />
        <img width={180} height={44} src={logoLight} className="logo-lg" alt="VP-Flow" />
      </Link>
    </div>
  )
}

export default LogoBox
