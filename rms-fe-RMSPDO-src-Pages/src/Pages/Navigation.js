import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
const ResourceNavigation = (props) => {
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return ` ${day}-${month}-${year}`;
  };
  const navigate = useNavigate();
  return (
    <div style={{ backgroundColor: "lightgray" }}>
      <Row style={{ padding: "0.5%",height:'4rem',alignItems:'center'}}>
        <Col xs="1">
          <a
            onClick={() => {
              navigate("/dashboard");
            }}
          >
            Dashboard
          </a>
        </Col>
        <Col xs="1">
          <a
            style={{ textDecoration: "underline" }}
            onClick={() => {
              navigate("/resource");
            }}
          >
            Resource
          </a>
        </Col>
        <Col xs="2" style={{marginLeft:'65%'}}>
         
            {getTodayDate()}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              style={{ marginLeft: "5px" }}
              fill="currentColor"
              class="bi bi-calendar"
              viewBox="0 0 20 16"
            >
              <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
            </svg>
       
        </Col>
      </Row>
    </div>
  );
};

export default ResourceNavigation;
