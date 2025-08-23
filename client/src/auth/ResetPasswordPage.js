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
import { useSearchParams } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [passwordError, setPasswordError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [isRestored, setIsRestored] = useState(false);
  const [requestExpired, setRequestExpired] = useState(null);

  const token = searchParams.get('token');

  const showErrorToast = (err) => {
    toast.error(handleApiError(err).message);
  }

  const handleError = (err) => {
    const apiErr = handleApiError(err);
    const details = apiErr.data.details;
    console.log(details);
    if (details && (details.email || details.password)) {
      setEmailError(details.email);
      setPasswordError(details.password);
    } else {
      if (apiErr.status === 410) {
        setRequestExpired(apiErr.message);
      } else {
        showErrorToast(err);
      }
    }
  }

  const onEmailChange = () => {
    setEmailError(null);
  };

  const onPasswordChange = () => {
    setPasswordError(null);
  };

  const resetPassword = (email) => {
    authRepository.resetPassword(email)
      .then(() => setIsReset(true))
      .catch(e => handleError(e))
      .finally(() => setIsSubmit(false));
  }

  const restorePassword = (token, password) => {
    authRepository.restorePassword(token, password)
      .then(() => setIsRestored(true))
      .catch(e => handleError(e))
      .finally(() => setIsSubmit(false));
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = form.get("email");
    const password = form.get("password");

    setIsSubmit(true);
    token ? restorePassword(token, password) : resetPassword(email);
  };

  const renderContent = () => {
    if (isReset) {
      return (
        <div>Link to restore password has been sent to your email.</div>
      );
    } else if (isRestored) {
      return (
        <div>Your password has been restored. <a href='/sign-in'>Sign in</a> with new credentials</div>
      );
    } else if (requestExpired) {
      return (
        <Alert variant='danger'>{requestExpired}. Please <a href="/reset-password">try again</a></Alert>
      );
    } else {
      return (
        <Form onSubmit={handleSubmit}>
          {token ? (
            <Form.Group className='mb-3' controlId='formPassword'>
              <Form.Label>New password</Form.Label>
              <Form.Control
                required
                type='password'
                placeholder='Enter new password'
                disabled={isSubmit}
                onChange={onPasswordChange}
                isInvalid={passwordError}
                name='password' />
              <Form.Control.Feedback type='invalid'>{passwordError}</Form.Control.Feedback>
            </Form.Group>
          ) : (
            <Form.Group className='mb-3' controlId='formEmail'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                required
                type='email'
                placeholder='Enter your email address'
                disabled={isSubmit}
                onChange={onEmailChange}
                isInvalid={emailError}
                name='email' />
              <Form.Control.Feedback type='invalid'>{emailError}</Form.Control.Feedback>
            </Form.Group>
          )}
          <div className='d-grid mb-3'>
            <Button variant='outline-primary' type='Submit' disabled={isSubmit}>{isSubmit ? 'Submit...' : (token ? 'Restore' : 'Reset')}</Button>
          </div>
        </Form>
      );
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', width: '100vw' }}>
      <Container>
        <Row className='justify-content-center'>
          <Col md={6}>
            <Stack>
              <h1 className='mb-5'>{token ? 'Restore password' : 'Reset password'}</h1>
              {renderContent()}
            </Stack>
          </Col>
        </Row>
      </Container>

      {toastContainer()}
    </div>
  );
}

export default ResetPasswordPage;