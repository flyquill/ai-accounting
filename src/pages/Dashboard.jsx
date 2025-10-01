// src/Dashboard.jsx

import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Card, ProgressBar, Table, Badge, Button, Dropdown } from 'react-bootstrap';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement
} from 'chart.js';
import { BsArrowUp, BsArrowDown, BsPerson, BsBoxArrowInRight, BsPlusCircleFill, BsFileEarmarkText, BsBank, BsCashCoin } from 'react-icons/bs';
import Cookies from 'js-cookie';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

// --- Sub-components (for organization) ---

const KpiCard = ({ title, value, change, changeType, icon: Icon, iconBg }) => (
  <Card className="h-100">
    <Card.Body>
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h5 className="text-muted fw-normal">{title}</h5>
          <h2 className="mb-0 fw-bold">{value}</h2>
          <div className={`mt-2 d-flex align-items-center text-${changeType === 'increase' ? 'success' : 'danger'}`}>
            {changeType === 'increase' ? <BsArrowUp size={14} /> : <BsArrowDown size={14} />}
            <span className="ms-1">{change}% vs last month</span>
          </div>
        </div>
        <div className={`kpi-icon ${iconBg}`}>
          <Icon size={28} />
        </div>
      </div>
    </Card.Body>
  </Card>
);
KpiCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  change: PropTypes.number.isRequired,
  changeType: PropTypes.oneOf(['increase', 'decrease']).isRequired,
  icon: PropTypes.elementType.isRequired,
  iconBg: PropTypes.string.isRequired,
};

const MainChart = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue',
        data: [12000, 19000, 15000, 21000, 18000, 24000, 22000, 28000, 35000, 40000, 50000, 70000],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.4,
      },
      {
        label: 'Profit',
        data: [4000, 7000, 5000, 8000, 6000, 10000, 8000, 12000, 20000, 25000, 35000, 60000],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.4,
      },
    ],
  };
  const options = { responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Revenue & Profit Overview' } } };
  return <Card><Card.Body><Line options={options} data={data} /></Card.Body></Card>;
};

const ExpenseDonutChart = () => {
  const data = {
    labels: ['Marketing', 'Salaries', 'Software', 'Rent', 'Utilities'],
    datasets: [{
      data: [300, 500, 100, 120, 80],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
    }],
  };
  const options = { responsive: true, plugins: { legend: { position: 'right' }, title: { display: true, text: 'Expense Breakdown' } } };
  return <Card className="h-100"><Card.Body className="d-flex align-items-center justify-content-center"><Doughnut data={data} options={options} /></Card.Body></Card>;
};

const RecentInvoices = () => {
    const invoices = [
        { id: 'INV-2023-088', client: 'Creative Minds Inc.', amount: '$3,500', status: 'Paid' },
        { id: 'INV-2023-087', client: 'Tech Solutions LLC', amount: '$1,250', status: 'Pending' },
        { id: 'INV-2023-086', client: 'Global Exports', amount: '$8,000', status: 'Overdue' },
        { id: 'INV-2023-085', client: 'Web Innovators', amount: '$500', status: 'Paid' },
    ];
    const statusMap = { Paid: 'success', Pending: 'warning', Overdue: 'danger' };

    return (
        <Card>
            <Card.Header className="d-flex justify-content-between align-items-center bg-white border-0">
                <Card.Title className="mb-0">Recent Invoices</Card.Title>
                <Button variant="outline-primary" size="sm">View All</Button>
            </Card.Header>
            <Card.Body>
                <Table responsive hover className="text-nowrap">
                    <thead><tr><th>Invoice ID</th><th>Client</th><th>Amount</th><th>Status</th></tr></thead>
                    <tbody>
                        {invoices.map(inv => (
                            <tr key={inv.id}>
                                <td>{inv.id}</td>
                                <td>{inv.client}</td>
                                <td>{inv.amount}</td>
                                <td><Badge pill bg={statusMap[inv.status]}>{inv.status}</Badge></td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    );
};

// --- Main Dashboard Component ---

const Dashboard = () => {
  return (
    <Container fluid className="p-4">
      {/* Header */}
      <Row className="mb-4 align-items-center">
        <Col>
          <h1 className="fw-bold">{Cookies.get("business_name")}</h1>
        </Col>
        <Col xs="auto">
          <Button variant="primary" className="d-flex align-items-center">
            <BsPlusCircleFill className="me-2" />
            Create New
          </Button>
        </Col>
        <Col xs="auto">
          <Dropdown>
            <Dropdown.Toggle variant="light" id="dropdown-basic">
              Aug 2023
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="#">Jul 2023</Dropdown.Item>
              <Dropdown.Item href="#">Jun 2023</Dropdown.Item>
              <Dropdown.Item href="#">May 2023</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      {/* KPI Cards */}
      <Row>
        <Col md={6} xl={3} className="mb-4">
          <KpiCard title="Total Revenue" value="$75,320" change={5.2} changeType="increase" icon={BsCashCoin} iconBg="bg-success" />
        </Col>
        <Col md={6} xl={3} className="mb-4">
          <KpiCard title="Net Profit" value="$18,450" change={2.1} changeType="increase" icon={BsBank} iconBg="bg-primary" />
        </Col>
        <Col md={6} xl={3} className="mb-4">
          <KpiCard title="Total Expenses" value="$56,870" change={1.8} changeType="decrease" icon={BsFileEarmarkText} iconBg="bg-danger" />
        </Col>
        <Col md={6} xl={3} className="mb-4">
          <KpiCard title="New Clients" value="12" change={10} changeType="increase" icon={BsPerson} iconBg="bg-warning" />
        </Col>
      </Row>

      {/* Main Charts Row */}
      <Row className="mb-4">
        <Col xl={7} className="mb-4 mb-xl-0">
          <MainChart />
        </Col>
        <Col xl={5}>
          <ExpenseDonutChart />
        </Col>
      </Row>

      {/* Invoices and Goals */}
      <Row>
        <Col lg={8} className="mb-4">
          <RecentInvoices />
        </Col>
        <Col lg={4} className="mb-4">
          <Card>
            <Card.Body>
                <Card.Title>Monthly Goal</Card.Title>
                <p className="text-muted">You've reached 82% of your $100,000 revenue goal.</p>
                <ProgressBar now={82} label="82%" variant="success" animated style={{height: '20px'}} />
                <div className="text-center mt-3">
                    <Button variant="outline-success">Set New Goal</Button>
                </div>
            </Card.Body>
          </Card>
          <Card className="mt-4">
            <Card.Header className="bg-white border-0">
                <Card.Title className="mb-0">Quick Actions</Card.Title>
            </Card.Header>
            <Card.Body>
                <Row>
                    <Col>
                        <Button variant="light" className="w-100 p-3 d-flex flex-column align-items-center">
                            <BsPlusCircleFill size={24} className="mb-2 text-primary" />
                            <span>Add Expense</span>
                        </Button>
                    </Col>
                    <Col>
                        <Button variant="light" className="w-100 p-3 d-flex flex-column align-items-center">
                            <BsBoxArrowInRight size={24} className="mb-2 text-primary" />
                            <span>Create Invoice</span>
                        </Button>
                    </Col>
                </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;