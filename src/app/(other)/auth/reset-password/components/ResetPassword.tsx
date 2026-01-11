import Logo from '@/assets/images/vpflow-logo-light.png'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import { Card, CardBody, Col, Row } from 'react-bootstrap'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

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
    <>
      <div className="">
        <div className="account-pages py-5">
          <div className="container">
            <Row className=" justify-content-center">
              <Col md={6} lg={5}>
                <Card className=" border-0 shadow-lg">
                  <CardBody className=" p-5">
                    <div className="text-center">
                      <div className="mx-auto mb-4 text-center auth-logo">
                        <Link to="/">
                          <img src={Logo} height={40} alt="VP-Flow" />
                        </Link>
                      </div>
                      <h4 className="fw-bold text-dark mb-2">Reset Password</h4>
                      <p className="text-muted">
                        Enter your email address and we&apos;ll send you an email with instructions to reset your password.
                      </p>
                    </div>
                    <form onSubmit={handleSubmit(() => {})} className="mt-4">
                      <div className="mb-3">
                        <label className="form-label">Email</label>
                        <Controller
                          name="email"
                          control={control}
                          render={({ field, fieldState: { error } }) => (
                            <>
                              <input
                                {...field}
                                type="email"
                                placeholder="Enter your email"
                                className={`form-control bg-light bg-opacity-50 border-light py-2 ${error ? 'is-invalid' : ''}`}
                              />
                              {error && (
                                <div className="invalid-feedback">{error.message}</div>
                              )}
                            </>
                          )}
                        />
                      </div>
                      <div className="d-grid">
                        <button className="btn btn-dark btn-lg fw-medium" type="submit">
                          Reset Password
                        </button>
                      </div>
                    </form>
                  </CardBody>
                </Card>
                <p className="text-center mt-4 text-white text-opacity-50">
                  Back to&nbsp;
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

export default ResetPassword
