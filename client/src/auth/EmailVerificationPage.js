import {useNavigate, useSearchParams} from "react-router-dom";
import Stack from "react-bootstrap/Stack";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {useState} from "react";
import authRepository from "../api/auth.repository";

function EmailVerificationPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [codeError, setCodeError] = useState("");
    const [isSubmit, setIsSubmit] = useState(false);

    const userId = searchParams.get('userId');
    const email = searchParams.get('email');

    if (!userId || !email) {
        navigate('/sign-in', {replace: true});
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        const form = new FormData(event.currentTarget);

        setIsSubmit(true);

        authRepository.verifyEmail(userId, form.get('code'))
            .then(() => navigate('/', {replace: true}))
            .catch(err => {
                setCodeError(err.response.data.message);
            })
            .finally(() => setIsSubmit(false))
    }

    return (
        <div className="d-flex justify-content-center align-items-center" style={{minHeight: '100vh', width: '100vw'}}>
            <Col md={6}>
                <Stack>
                    <h1 className='mb-5'>Email verification</h1>
                    <p>A verification code has been sent to <strong>{email}</strong></p>
                    <p className='mb-4 text-secondary'>Please check your inbox and enter the verification code below to verify your email address.</p>

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className='mb-3' controlId='formCode'>
                            <Form.Control
                                required
                                type='text'
                                placeholder='Code'
                                isInvalid={codeError}
                                name='code'/>
                            <Form.Control.Feedback type='invalid'>{codeError}</Form.Control.Feedback>
                        </Form.Group>

                        <div className='d-grid mb-3'>
                            <Button variant='outline-primary' type='Submit' disabled={isSubmit}>{isSubmit ? 'Submit...' : ('Verify')}</Button>
                        </div>
                    </Form>
                </Stack>
            </Col>
        </div>
    );
}

export default EmailVerificationPage;