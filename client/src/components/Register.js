// src/components/Register.js
import React, { useState, useEffect } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!username || !email || !password) {
            setErrorMessage('All fields are required');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/register', { username, email, password });
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
        <Card style={{ width: '28rem', backgroundColor: '#f8f9fa' }}>
            <Card.Body className='d-flex flex-column align-items-center'>
                <div className='d-flex flex-row mt-2 mb-4'>
                    <i className="fas fa-cubes fa-3x me-3" style={{ color: '#ff6219' }}></i>
                    <span className="h1 fw-bold mb-0">Adess Bank</span>
                </div>

                <h5 className="fw-normal my-4 pb-3" style={{ letterSpacing: '1px' }}>Register your account</h5>

                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formUsername" className="mb-4">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            size="lg"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="formEmail" className="mb-4">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            size="lg"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="formPassword" className="mb-4">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            size="lg"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>

                    <Button variant="dark" size="lg" type="submit" className="mb-4 px-5">Register</Button>
                </Form>

                <p className="mb-5 pb-lg-2" style={{ color: '#393f81' }}>
                    Already have an account? <Link to="/" style={{ color: '#393f81' }}>Login here</Link>
                </p>

                <div className='d-flex flex-row justify-content-start'>
                    <a href="#!" className="small text-muted me-1">Terms of use.</a>
                    <a href="#!" className="small text-muted">Privacy policy</a>
                </div>
            </Card.Body>
        </Card>
    );
};

export default Register;
