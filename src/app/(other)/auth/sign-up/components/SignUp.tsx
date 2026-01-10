import { useEffect, useState } from 'react'
import DarkLogo from '@/assets/images/logo-dark.png'
import LightLogo from '@/assets/images/logo-light.png'
import TextFormInput from '@/components/from/TextFormInput'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
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
        // Handle specific Supabase auth errors
        if (error.message.includes('User already registered')) {
          showNotification({ message: 'An account with this email already exists', variant: 'danger' })
        } else {
          showNotification({ message: error.message, variant: 'danger' })
        }
        return
      }

      if (data.user) {
        if (data.session) {
          // User was created and logged in (email confirmation disabled)
          showNotification({ message: 'Account created successfully! Redirecting...', variant: 'success' })
          navigate('/')
        } else {
          // Email confirmation is enabled
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
                        <Link to="/" className="logo-dark">
                          <img src={DarkLogo} height={32} alt="logo dark" />
                        </Link>
                        <Link to="/" className="logo-light">
                          <img src={LightLogo} height={28} alt="logo light" />
                        </Link>
                      </div>
                      <h4 className="fw-bold text-dark mb-2">Create Account</h4>
                      <p className="text-muted">Sign up for VP-Flow</p>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                      <div className="mb-3">
                        <TextFormInput 
                          control={control} 
                          name="fullName" 
                          placeholder="Enter your full name" 
                          className="form-control" 
                          label="Full Name" 
                        />
                      </div>
                      <div className="mb-3">
                        <TextFormInput 
                          control={control} 
                          name="email" 
                          placeholder="Enter your email" 
                          className="form-control" 
                          label="Email Address" 
                        />
                      </div>
                      <div className="mb-3">
                        <TextFormInput
                          control={control}
                          name="password"
                          placeholder="Enter your password"
                          className="form-control"
                          label="Password"
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