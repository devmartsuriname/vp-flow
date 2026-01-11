import { useEffect, useState } from 'react'
import Logo from '@/assets/images/vpflow-logo-light.png'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { Card, CardBody, Col, Row } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { useNotificationContext } from '@/context/useNotificationContext'

const SignUp = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { showNotification } = useNotificationContext()

  useEffect(() => {
    document.body.classList.add('authentication-bg')
    return () => {
      document.body.classList.remove('authentication-bg')
    }
  }, [])

  const signUpSchema = yup.object({
    fullName: yup.string().required('Please enter your full name'),
    email: yup.string().email('Please enter a valid email').required('Please enter your email'),
    password: yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Please enter a password'),
    acceptTerms: yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
  })

  type SignUpFormFields = yup.InferType<typeof signUpSchema>

  const { handleSubmit, control, register, formState: { errors } } = useForm<SignUpFormFields>({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      acceptTerms: false,
    },
  })

  const onSubmit = async (values: SignUpFormFields) => {
    setLoading(true)
    try {
      const redirectUrl = `${window.location.origin}/`

      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: values.fullName,
          },
        },
      })

      if (error) {
        if (error.message.includes('User already registered')) {
          showNotification({ message: 'An account with this email already exists', variant: 'danger' })
        } else {
          showNotification({ message: error.message, variant: 'danger' })
        }
        return
      }

      if (data.user) {
        if (data.session) {
          showNotification({ message: 'Account created successfully! Redirecting...', variant: 'success' })
          navigate('/')
        } else {
          showNotification({ 
            message: 'Account created! Please check your email to confirm your account.', 
            variant: 'success' 
          })
          navigate('/auth/sign-in')
        }
      }
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred'
      showNotification({ message: errorMessage, variant: 'danger' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="">
        <div className="account-pages py-5">
          <div className="container">
            <Row className="justify-content-center">
              <Col md={6} lg={5}>
                <Card className="border-0 shadow-lg">
                  <CardBody className="p-5">
                    <div className="text-center">
                      <div className="mx-auto mb-4 text-center auth-logo">
                        <Link to="/">
                          <img src={Logo} height={40} alt="VP-Flow" />
                        </Link>
                      </div>
                      <h4 className="fw-bold text-dark mb-2">Create Account</h4>
                      <p className="text-muted">Sign up for VP-Flow</p>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                      <div className="mb-3">
                        <label className="form-label">Full Name</label>
                        <Controller
                          name="fullName"
                          control={control}
                          render={({ field, fieldState: { error } }) => (
                            <>
                              <input
                                {...field}
                                type="text"
                                placeholder="Enter your full name"
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
                        <label className="form-label">Email Address</label>
                        <Controller
                          name="email"
                          control={control}
                          render={({ field, fieldState: { error } }) => (
                            <>
                              <input
                                {...field}
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
                        <label className="form-label">Password</label>
                        <Controller
                          name="password"
                          control={control}
                          render={({ field, fieldState: { error } }) => (
                            <>
                              <input
                                {...field}
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
                      <div className="mb-3">
                        <div className="form-check">
                          <input 
                            type="checkbox" 
                            className={`form-check-input ${errors.acceptTerms ? 'is-invalid' : ''}`}
                            id="checkbox-terms" 
                            {...register('acceptTerms')}
                          />
                          <label className="form-check-label" htmlFor="checkbox-terms">
                            I accept the Terms and Conditions
                          </label>
                          {errors.acceptTerms && (
                            <div className="invalid-feedback">{String(errors.acceptTerms.message)}</div>
                          )}
                        </div>
                      </div>
                      <div className="mb-1 text-center d-grid">
                        <button 
                          className="btn btn-dark btn-lg fw-medium" 
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                      </div>
                    </form>
                  </CardBody>
                </Card>
                <p className="text-center mt-4 text-white text-opacity-50">
                  Already have an account?{' '}
                  <Link to="/auth/sign-in" className="text-decoration-none text-white fw-bold">
                    Sign In
                  </Link>
                </p>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </>
  )
}

export default SignUp
