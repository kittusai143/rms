import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


const DashboardNavigation = () => {
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const navigate = useNavigate();

  return (
    <div className="dashboard-nav">
      <Row className="align-items-center">
        <Col>
          <a className="nav-link" onClick={() => navigate('/dashboard')}>
            Dashboard
          </a>
        </Col>
        <Col >
          <a className="nav-link" onClick={() => navigate('/pmosloginview')}>
            Resource
          </a>
        </Col>
        <Col xs='7'></Col>
        {/* <Col xs='3'>
          <Row className="align-items-center justify-content-end">
            <Col className="date">
              {getTodayDate()}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" style={{ marginLeft: '5px' }} fill="currentColor" className="bi bi-calendar" viewBox="0 0 16 16">
                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
              </svg>
            </Col>
          </Row>
        </Col> */}
      </Row>
    </div>
  );
};

export default DashboardNavigation;
