import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Controller } from 'react-hook-form'
import AuthFooter from '../../components/AuthFooter'
import AuthVisualPanel from '../../components/AuthVisualPanel'
import useSignIn from '../useSignIn'

const SignIn = () => {
  useEffect(() => {
    document.body.classList.add('authentication-bg')
    return () => {
      document.body.classList.remove('authentication-bg')
    }
  }, [])

  const { loading, login, control } = useSignIn()

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
          <h4 className="fw-bold mb-2">Welcome Back</h4>
          <p className="text-muted mb-4">Sign in to your VP-Flow account</p>

          <form onSubmit={login}>
            <div className="mb-3">
              <label className="form-label" htmlFor="signin-email">Email Address</label>
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <input
                      {...field}
                      id="signin-email"
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

            <div className="mb-3">
              <Link to="/auth/reset-password" className="float-end text-muted ms-1">
                Forgot password?
              </Link>
              <label className="form-label" htmlFor="signin-password">Password</label>
              <Controller
                name="password"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <input
                      {...field}
                      id="signin-password"
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
              <input type="checkbox" className="form-check-input" id="remember-me" />
              <label className="form-check-label" htmlFor="remember-me">
                Remember me
              </label>
            </div>

            <div className="d-grid">
              <button disabled={loading} className="btn btn-primary btn-lg fw-medium" type="submit">
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>
          </form>

          <AuthFooter />
        </div>
      </div>

      <AuthVisualPanel />
    </div>
  )
}

export default SignIn
