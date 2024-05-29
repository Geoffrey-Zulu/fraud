import React from 'react';
import { Container, Row, Col, Button, Navbar, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './styles.css'; 

const Home = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
        <Container>
          <Navbar.Brand href="#home">Anipa Bank Fraud Detector</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <Navbar.Text className="me-3">
                Signed in as: <span style={{ color: '#ff6219' }}>{user?.username}</span>
              </Navbar.Text>
              <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="d-flex flex-column align-items-center justify-content-center" style={{ height: '100vh', paddingTop: '5rem' }}>
        <Row className="mb-4">
          <Col>
            <h1 className="text-center">Welcome to Adess Bank Fraud Detector</h1>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col>
            <h2 className="text-center">Your Balance</h2>
            <p className="text-center" style={{ fontSize: '2rem', color: '#393f81' }}>${user?.balance}</p>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
