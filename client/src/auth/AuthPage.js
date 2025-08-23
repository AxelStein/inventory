import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import { useState } from 'react';
import handleApiError from '../api/error.handler.js';
import authRepository from '../api/auth.repository.js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import toastContainer from '../components/toast.container.js';
import { useNavigate } from 'react-router-dom';

function AuthPage({ isSignIn }) {
  const [nameError, setNameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();

  const showErrorToast = (err) => {
    toast.error(handleApiError(err).message);
  }

  const onNameChange = () => {
    setNameError(null);
  };

  const onEmailChange = () => {
    setEmailError(null);
  };

  const onPasswordChange = () => {
    setPasswordError(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const body = {
      email: form.get("email"),
      password: form.get("password")
    };
    if (!isSignIn) {
      body.name = form.get("name");
    }

    setIsSubmit(true);

    (isSignIn ? authRepository.signIn(body) : authRepository.signUp(body))
      .then(() => navigate('/', { replace: true }))
      .catch(err => {
        const details = handleApiError(err).data.details;
        if (details && (details.name || details.email || details.password)) {
          setNameError(details.name);
          setEmailError(details.email);
          setPasswordError(details.password);
        } else {
          showErrorToast(err);
        }
      })
      .finally(() => setIsSubmit(false));
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', width: '100vw' }}>
      <Container>
        <Row className='justify-content-center'>
          <Col md={6}>
            <Stack>
              <h1 className='mb-5'>{isSignIn ? 'Sign in to App' : 'Sign up to App'}</h1>

              <Form onSubmit={handleSubmit}>
                {!isSignIn && (
                  <Form.Group className='mb-3' controlId='formName'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      required type='name'
                      placeholder='Enter name'
                      isInvalid={nameError}
                      disabled={isSubmit}
                      onChange={onNameChange}
                      name='name' />
                    <Form.Control.Feedback type='invalid'>{nameError}</Form.Control.Feedback>
                  </Form.Group>
                )}

                <Form.Group className='mb-3' controlId='formEmail'>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    required
                    type='email'
                    placeholder='Enter email'
                    disabled={isSubmit}
                    onChange={onEmailChange}
                    isInvalid={emailError}
                    name='email' />
                  <Form.Control.Feedback type='invalid'>{emailError}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className='mb-3' controlId='formPassword'>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    required
                    type='password'
                    placeholder='Enter password'
                    disabled={isSubmit}
                    onChange={onPasswordChange}
                    isInvalid={passwordError}
                    name='password' />
                  <Form.Control.Feedback type='invalid'>{passwordError}</Form.Control.Feedback>
                </Form.Group>

                <div className='d-grid mb-3'>
                  <Button variant='outline-primary' type='Submit' disabled={isSubmit}>{isSubmit ? 'Submit...' : (isSignIn ? 'Sign in' : 'Sign up')}</Button>
                </div>

                {isSignIn && (
                  <div className='text-center'>
                    <a href='/reset-password'>Forgot password?</a>

                    <div className='mt-5'>
                      Don't have an account? <a href='/sign-up'>Sign up</a>
                    </div>
                  </div>
                )}

                {!isSignIn && (
                  <div className='text-center mt-5'>
                    Already have an account? <a href='/sign-in'>Sign in</a>
                  </div>
                )}
              </Form>
            </Stack>
          </Col>
        </Row>
      </Container>

      {toastContainer()}
    </div>
  );
}

export default AuthPage;