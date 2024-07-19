import React, { useEffect, useState } from "react";
import { Input, Row, Col, Container, Button } from "reactstrap";
import Modal from 'react-bootstrap/Modal';
import { getReq, putReq } from "../Api/api";
import { useSelector } from "react-redux";
import './Model.css';
import Form from 'react-bootstrap/Form';
const SoftBlock = ({ EmployeeRow, onClose, SToast, EToast, onRefresh }) => {
  const url = process.env.REACT_APP_URL;
  const [isModalOpen, setModalOpen] = useState(true);
  const [startdate, setStartdate] = useState();
  const [enddate, setEnddate] = useState();
  const select = useSelector((state) => state?.login?.tasks);
  const [result, setResult] = useState([]);
  const [errors, setErrors] = useState({});
  const [requirementId,setRequirementId]=useState("");
  const todayDate = new Date();
  const startDateObj = new Date(startdate);
  useEffect(() => {
    if (startdate === undefined && enddate === undefined) {
      const today = new Date();
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + 14); 
      setStartdate(today.toISOString().split('T')[0]);
    } else {
      const endDate = new Date(startdate || Date.now());
      endDate.setDate(endDate.getDate() + 14);
      setEnddate(endDate.toISOString().split('T')[0]);
    }
  }, [startdate])
  useEffect(() => {
    Validation(EmployeeRow.processes);
    // console.log(EmployeeRow);
  }, [])

  const Validation = (item) => {
    const res = item.find(obj =>
      obj.createdBy === select[0].employeeId && (obj.processStatus === "Interested"||obj.processStatus ==="SoftBlock Rejected"||obj.processStatus ==="Allocation Rejected"))
    // console.log(res);
    // console.log(select[0].employeeId)
    setResult(res);
  }
  const validateSave = () => {
    const errors = {};
    if (!startdate) {
      errors["startdate"] = 'Start date is required';
    }
    else if(requirementId.trim()==="")
    {
      setRequirementId("");
      errors["requirementId"] = 'Requirement Id is required';
    }
    else {
      const startDateObj = new Date(startdate);
      const todayDate = new Date();
     
      if (startDateObj < todayDate.setHours(0, 0, 0, 0)) {
        errors["startdate"] = 'Start date should not be less than today';
      } else if (startDateObj > new Date(todayDate.getFullYear() , todayDate.getMonth(), todayDate.getDate()+14)) {
        errors["startdate"] = 'Start date should not be greater than 2 weeks from Today';
      }
    }
  
    return errors;
  }
  const handleSoftblockSave = () => {
    const validationErrors = validateSave();
    if (Object?.keys(validationErrors)?.length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({})
    // console.log({ "updatedBy": select[0].employeeId, "startDate": startdate, "endDate": enddate, "processStatus": 'SoftBlock Requested'})
    // console.log(result.id,result)
    putReq(`${url}ResourceAllocProcess/update/${result.id}`, {
      "updatedBy": select[0].employeeId,
      "startDate": startdate,
      "endDate": enddate,
      "processStatus": 'SoftBlock Requested',
      "requirementId": requirementId
    }).then((response) => {
      if (response.data) {
        SToast("Resource SoftBlock request submitted successfully");
        onRefresh();
        onClose();
      } else {
        EToast("Resource SoftBlock request failed");
      }
    })

  }
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 13);
  const maxDateString = maxDate.toISOString().split('T')[0];
  return (
    <div className="softBlockContainer">
      <Modal show={isModalOpen} onHide={onClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Soft Block</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ overflowX: 'hidden' }}>
          <Container fluid className="m-1">
            <Row className="mx-2">Resource</Row>
            <Row className="mx-2">
              <Input
                type="text"
                style={{ border: 'none', borderBottom: '1px solid lightgray' }}
                value={EmployeeRow.resource.name}
                readOnly
              />
            </Row>
            <Row className="mt-3 mx-2">Requirement Id</Row>
            <Row className="mx-2">
              <Input
                type="text"
                style={{ border: 'none', borderBottom: '1px solid lightgray' }}
                onChange={(e)=>setRequirementId(e.target.value)}
                placeholder="Enter the Requirement Id"
              />
            </Row>
            {errors["requirementId"] && (<p style={{
              width: '100%',
              marginTop: '0.25rem',
              fontSize: '0.875em',
              color: 'var(--bs-form-invalid-color)'
            }}>{errors["requirementId"]}</p>
            )}
            <Row className="mt-3 mx-2 gap-2" style={{ justifyContent: "" }}>
              <Col className="l-6">
                <Row className="mb-1">Start Date</Row>
                <Row>
                  <Input type="date" value={startdate} min={new Date().toISOString().split('T')[0]} onChange={(e) => { setStartdate(e.target.value) }}  max={maxDateString}/>
                </Row>
              </Col>
              <Col className="l-6">
                <Row className="mb-1">End Date</Row>
                <Row>
                  <Input type="date" value={enddate} readOnly />
                </Row>
              </Col>
            </Row>

            {errors["startdate"] && (<p style={{
              width: '100%',
              marginTop: '0.25rem',
              fontSize: '0.875em',
              color: 'var(--bs-form-invalid-color)'
            }}>{errors["startdate"]}</p>
            )}
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <div
            className="buttons"
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button className="saveBtn" onClick={handleSoftblockSave}>
              Submit
            </Button>
            <Button className="cancelBtn" onClick={() => onClose()} >Cancel</Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SoftBlock;
