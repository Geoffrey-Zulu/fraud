import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Button, Navbar, Nav, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles.css';
import logoImage from './logo2.png';
import { UserContext } from './UserContext';

const Home = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showTransactModal, setShowTransactModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [receiverAccount, setReceiverAccount] = useState('');
  const [time, setTime] = useState('');
  const [transactionMessage, setTransactionMessage] = useState('');
  const [depositMessage, setDepositMessage] = useState('');
  const [withdrawMessage, setWithdrawMessage] = useState('');
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:3000/auth/user', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data.user);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
    };

    fetchUser();
  }, [setUser]);

  const fetchTransactions = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get('http://localhost:3000/transactions/history', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTransactions(response.data.transactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  const handleShowDepositModal = () => setShowDepositModal(true);
  const handleCloseDepositModal = () => setShowDepositModal(false);

  const handleShowWithdrawModal = () => setShowWithdrawModal(true);
  const handleCloseWithdrawModal = () => setShowWithdrawModal(false);

  const handleShowTransactModal = () => setShowTransactModal(true);
  const handleCloseTransactModal = () => setShowTransactModal(false);

  const handleShowViewModal = () => {
    fetchTransactions();
    setShowViewModal(true);
  };
  const handleCloseViewModal = () => setShowViewModal(false);

  const handleDeposit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('http://localhost:3000/transactions/deposit',
        { accountNumber, amount: parseFloat(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.message === 'Deposit successful') {
        setDepositMessage(`Deposit successful. New balance: K${response.data.balance}`);

        setUser(prevUser => ({
          ...prevUser,
          balance: response.data.balance
        }));

        setTimeout(() => {
          setDepositMessage('');
          handleCloseDepositModal();
        }, 3000);
      } else {
        setDepositMessage(response.data.message);
      }
    } catch (error) {
      setDepositMessage(error.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  const handleWithdraw = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('http://localhost:3000/transactions/withdraw',
        { accountNumber, amount: parseFloat(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.message === 'Withdrawal successful') {
        setWithdrawMessage(`Withdrawal successful. New balance: K${response.data.balance}`);

        setUser(prevUser => ({
          ...prevUser,
          balance: response.data.balance
        }));

        setTimeout(() => {
          setWithdrawMessage('');
          handleCloseWithdrawModal();
        }, 3000);
      } else {
        setWithdrawMessage(response.data.message);
      }
    } catch (error) {
      setWithdrawMessage(error.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  const handleTransaction = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    const [hours, minutes] = time.split(':').map(Number);
    const timeInSeconds = (hours * 3600) + (minutes * 60);

    try {
      const response = await axios.post('http://localhost:3000/transactions/transaction',
        { time: timeInSeconds, amount: parseFloat(amount), senderAccount: accountNumber, receiverAccount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.message === 'Transaction processed') {
        setTransactionMessage(`Transaction successful. New balance: K${response.data.senderBalance}. Fraud check: ${response.data.isFraud ? 'Fraudulent' : 'Not Fraudulent'}`);

        setUser(prevUser => ({
          ...prevUser,
          balance: response.data.senderBalance
        }));

        setTimeout(() => {
          setTransactionMessage('');
          handleCloseTransactModal();
        }, 3000);
      } else {
        setTransactionMessage(response.data.message);
      }
    } catch (error) {
      setTransactionMessage(error.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <>
      <Navbar  variant="dark" expand="lg" fixed="top">
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

<Container className='main-content-container'>

      <Container className="d-flex flex-column align-items-center justify-content-center" style={{ height: '100vh', paddingTop: '5rem' }}>
        <Row className="mb-4 title-container">
          <Col>
            <h1 className="text-center">Transaction Simulator</h1>
          </Col>
          <hr className="w-100" />
        </Row>
        <Row className="mb-4">
          <Col>
            <p className="balance text-center">Balance K{user?.balance}</p>
          </Col>
        </Row>
        <Row className="mb-4 text-center">
          <Col><Button variant="secondary" onClick={handleShowDepositModal}>Deposit</Button></Col>
          <Col><Button variant="secondary" onClick={handleShowWithdrawModal}>Withdraw</Button></Col>
          <Col><Button variant="secondary" onClick={handleShowTransactModal}>Transact</Button></Col>
        </Row>
        <hr className="w-100" />
        <Row  className="pb-custom">
          <Col>
            <h2 className="text-center">Transaction History</h2>
            <Button variant="success" onClick={handleShowViewModal}>View</Button>
          </Col>
        </Row>
      </Container>

      </Container>


      {/* Deposit Modal */}
      <Modal show={showDepositModal} onHide={handleCloseDepositModal}>
        <Modal.Header closeButton>
          <Modal.Title>Deposit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleDeposit}>
            <Form.Group controlId="formAccountNumber" className="mb-3">
              <Form.Label>Account Number</Form.Label>
              <Form.Control
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formAmount" className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Form.Group>
            {depositMessage && <p style={{ color: depositMessage.includes('successful') ? 'green' : 'red' }}>{depositMessage}</p>}
            <Button variant="primary" type="submit">Submit</Button>
          </Form>
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
          <Form onSubmit={handleWithdraw}>
            <Form.Group controlId="formAccountNumber" className="mb-3">
              <Form.Label>Account Number</Form.Label>
              <Form.Control
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formAmount" className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Form.Group>
            {withdrawMessage && <p style={{ color: withdrawMessage.includes('successful') ? 'green' : 'red' }}>{withdrawMessage}</p>}
            <Button variant="primary" type="submit">Submit</Button>
          </Form>
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
          <Form onSubmit={handleTransaction}>
            <Form.Group controlId="formSenderAccountNumber" className="mb-3">
              <Form.Label>Sender Account Number</Form.Label>
              <Form.Control
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formReceiverAccountNumber" className="mb-3">
              <Form.Label>Receiver Account Number</Form.Label>
              <Form.Control
                type="text"
                value={receiverAccount}
                onChange={(e) => setReceiverAccount(e.target.value)}
              />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group controlId="formAmount" className="mb-3">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formTime" className="mb-3">
                  <Form.Label>Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            {transactionMessage && <p style={{ color: transactionMessage.includes('successful') ? 'green' : 'red' }}>{transactionMessage}</p>}
            <Button variant="primary" type="submit">Submit</Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseTransactModal}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* View Transactions Modal */}
      <Modal show={showViewModal} onHide={handleCloseViewModal}>
        <Modal.Header closeButton>
          <Modal.Title>Transactions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Amount: Time : Status</p>
          {transactions.length > 0 ? (
            <ul>
              {transactions.map((transaction, index) => (
                <li key={index}>
                  {transaction.time} - {transaction.amount} - {transaction.isFraud ? 'Fraudulent' : 'Not Fraudulent'}
                </li>
              ))}
            </ul>
          ) : (
            <p>No transactions found</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseViewModal}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Footer */}
      <footer className="footer">
        <Container className="text-center">
          <p>© 2024 Adess Bank, All rights reserved.</p>
          <p>Location: Lusaka | Customer Support: support@adess.co.zm</p>
        </Container>
      </footer>
    </>
  );
};

export default Home;
