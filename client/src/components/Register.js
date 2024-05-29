import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import backgroundImage from './background.jpg';
import logoImage from './logo.png';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => {
                setErrorMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    useEffect(() => {
        const body = document.body;
        body.style.backgroundImage = `url(${backgroundImage})`;
        body.style.backgroundSize = 'cover';
        body.style.backgroundPosition = 'center';
        body.style.minHeight = '100vh';
        body.style.display = 'flex';
        body.style.justifyContent = 'center';
        body.style.alignItems = 'center';

        return () => {
            body.style.backgroundImage = '';
            body.style.backgroundSize = '';
            body.style.backgroundPosition = '';
            body.style.minHeight = '';
            body.style.display = '';
            body.style.justifyContent = '';
            body.style.alignItems = '';
        };
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!username || !email || !password || !accountNumber) {
            setErrorMessage('All fields are required');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/auth/register', { username, email, password, accountNumber });
            if (response.data.message === 'User registered successfully') {
                setSuccessMessage(response.data.message);
                setTimeout(() => {
                    setSuccessMessage('');
                    navigate('/');
                }, 2000);
            }
        } catch (error) {
            if (error.response && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('An error occurred. Please try again.');
            }
        }
    };

    return (
        <div style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Card style={{ width: '30rem', backgroundColor: '#f8f9fa' }}>
                <Card.Body>
                    <div className='d-flex flex-row mb-4 align-items-center justify-content-center'>
                        <img src={logoImage} alt="Logo" style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                        <span className="h1 fw-bold mb-0">Adess Bank</span>
                    </div>

                    <h5 className="fw-normal my-4 pb-3 text-center" style={{ letterSpacing: '1px' }}>Register your account</h5>

                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                    {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group as={Row} controlId="formUsername" className="mb-4">
                            <Form.Label column sm={4}>Username</Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="formEmail" className="mb-4">
                            <Form.Label column sm={4}>Email address</Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="formPassword" className="mb-4">
                            <Form.Label column sm={4}>Password</Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="formAccountNumber" className="mb-4">
                            <Form.Label column sm={4}>Account Number</Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="text"
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                />
                            </Col>
                        </Form.Group>

                        <div className="d-flex justify-content-center">
                            <Button variant="dark" type="submit" className="px-5">Register</Button>
                        </div>
                    </Form>

                    <p className="mt-4 text-center" style={{ color: '#393f81', fontSize: '0.875rem' }}>
                        Already have an account? <Link to="/" style={{ color: '#393f81', fontSize: '0.875rem' }}>Login here</Link>
                    </p>

                    <div className='d-flex flex-row justify-content-center'>
                        <a href="#!" className="small text-muted me-1">Terms of use.</a>
                        <a href="#!" className="small text-muted">Privacy policy</a>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Register;
