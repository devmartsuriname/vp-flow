import { useEffect } from 'react'
import Logo from '@/assets/images/vpflow-logo-light.png'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { Link } from 'react-router-dom'
import AuthFooter from '../../components/AuthFooter'
import AuthVisualPanel from '../../components/AuthVisualPanel'

const LockScreen = () => {
  useEffect(() => {
    document.body.classList.add('authentication-bg')
    return () => {
      document.body.classList.remove('authentication-bg')
    }
  }, [])

  const messageSchema = yup.object({
    name: yup.string().required('Please enter Name'),
    email: yup.string().email().required('Please enter Email'),
    password: yup.string().required('Please enter password'),
  })

  const { handleSubmit, control } = useForm({
    resolver: yupResolver(messageSchema),
  })

  return (
    <div className="auth-split">
      <div className="auth-split-form">
        <div className="auth-split-form-inner">
          <div className="mb-4 auth-logo">
            <Link to="/">
              <img src={Logo} height={40} alt="VP-Flow" />
            </Link>
          </div>
          <h4 className="fw-bold mb-2">Session Locked</h4>
          <p className="text-muted mb-4">Enter your password to access VP-Flow.</p>

          <form onSubmit={handleSubmit(() => {})}>
            <div className="mb-3">
              <label className="form-label" htmlFor="lock-password">Password</label>
              <Controller
                name="password"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <input
                      {...field}
                      id="lock-password"
                      type="password"
                      placeholder="Enter your password"
                      className={`form-control ${error ? 'is-invalid' : ''}`}
                    />
                    {error && (
                      <div className="invalid-feedback">{error.message}</div>
                    )}
                  </>
                )}
              />
            </div>

            <div className="form-check mb-4">
              <input type="checkbox" className="form-check-input" id="checkbox-signin" />
              <label className="form-check-label" htmlFor="checkbox-signin">
                I accept Terms and Condition
              </label>
            </div>

            <div className="d-grid">
              <button className="btn btn-primary btn-lg fw-medium" type="submit">
                Sign In
              </button>
            </div>
          </form>

          <p className="text-muted text-center mt-4 mb-0">
            Not you? return&nbsp;
            <Link to="/auth/sign-in" className="text-decoration-none fw-bold">
              Sign In
            </Link>
          </p>

          <AuthFooter />
        </div>
      </div>

      <AuthVisualPanel />
    </div>
  )
}

export default LockScreen
