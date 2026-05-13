import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import AuthFooter from '../../components/AuthFooter'
import AuthVisualPanel from '../../components/AuthVisualPanel'

const ResetPassword = () => {
  useEffect(() => {
    document.body.classList.add('authentication-bg')
    return () => {
      document.body.classList.remove('authentication-bg')
    }
  }, [])

  const messageSchema = yup.object({
    email: yup.string().email().required('Please enter Email'),
  })

  const { handleSubmit, control } = useForm({
    resolver: yupResolver(messageSchema),
  })

  return (
    <div className="auth-split">
      <div className="auth-split-form">
        <div className="auth-split-form-inner">
          <div className="mb-4 auth-logo">
            <Link to="/" className="logo-dark">
              <img src="/vp-flow-logo-light.svg" height={40} alt="VP-Flow" />
            </Link>
            <Link to="/" className="logo-light">
              <img src="/vp-flow-logo-dark.svg" height={40} alt="VP-Flow" />
            </Link>
          </div>
          <h4 className="fw-bold mb-2">Reset Password</h4>
          <p className="text-muted mb-4">
            Enter your email address and we&apos;ll send you an email with instructions to reset your password.
          </p>

          <form onSubmit={handleSubmit(() => {})}>
            <div className="mb-4">
              <label className="form-label" htmlFor="reset-email">Email</label>
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <input
                      {...field}
                      id="reset-email"
                      type="email"
                      placeholder="Enter your email"
                      className={`form-control ${error ? 'is-invalid' : ''}`}
                    />
                    {error && (
                      <div className="invalid-feedback">{error.message}</div>
                    )}
                  </>
                )}
              />
            </div>

            <div className="d-grid">
              <button className="btn btn-primary btn-lg fw-medium" type="submit">
                Reset Password
              </button>
            </div>
          </form>

          <p className="text-muted text-center mt-4 mb-0">
            Back to&nbsp;
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

export default ResetPassword
