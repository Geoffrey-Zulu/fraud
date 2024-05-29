import React, { useState } from 'react';
import { Container, Row, Col, Button, Navbar, Nav, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './styles.css'; 
import logoImage from './logo2.png';

const Home = ({ user }) => {
  const navigate = useNavigate();
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showTransactModal, setShowTransactModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const handleLogout = () => {
    navigate('/');
  };

  const handleShowDepositModal = () => setShowDepositModal(true);
  const handleCloseDepositModal = () => setShowDepositModal(false);

  const handleShowWithdrawModal = () => setShowWithdrawModal(true);
  const handleCloseWithdrawModal = () => setShowWithdrawModal(false);

  const handleShowTransactModal = () => setShowTransactModal(true);
  const handleCloseTransactModal = () => setShowTransactModal(false);

  const handleShowViewModal = () => setShowViewModal(true);
  const handleCloseViewModal = () => setShowViewModal(false);

  return (
    <>
      <Navbar bg="primary" variant="dark" expand="lg" fixed="top">
        <Container>
          <Navbar.Brand href="#home">
            <img src={logoImage} alt="Logo" style={{ width: '30px', height: '30px', marginRight: '10px' }} />
            Adess Bank Fraud Detector
          </Navbar.Brand>
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
            <p className="balance text-center">${user?.balance}</p>
          </Col>
        </Row>
        <Row className="mb-4 text-center">
          <Col><Button variant="secondary" className="option-button" onClick={handleShowDepositModal}>Deposit</Button></Col>
          <Col><Button variant="secondary" className="option-button" onClick={handleShowWithdrawModal}>Withdraw</Button></Col>
          <Col><Button variant="secondary" className="option-button" onClick={handleShowTransactModal}>Transact</Button></Col>
        </Row>
        <hr className="w-100"/>
        <Row>
          <Col>
            <h2 className="text-center">Transaction History</h2>
            <Button variant="success" className="view-button"  onClick={handleShowViewModal}>View</Button>
          </Col>
        </Row>
      </Container>

      {/* Deposit Modal */}
      <Modal show={showDepositModal} onHide={handleCloseDepositModal}>
        <Modal.Header closeButton>
          <Modal.Title>Deposit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Deposit*/}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDepositModal}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Withdraw Modal */}
      <Modal show={showWithdrawModal} onHide={handleCloseWithdrawModal}>
        <Modal.Header closeButton>
          <Modal.Title>Withdraw</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Withdraw */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseWithdrawModal}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Transact Modal */}
      <Modal show={showTransactModal} onHide={handleCloseTransactModal}>
        <Modal.Header closeButton>
          <Modal.Title>Transact</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Transact  */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseTransactModal}>Close</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showViewModal} onHide={handleCloseViewModal}>
        <Modal.Header closeButton>
          <Modal.Title>Transactions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Transaction */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseViewModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Home;
