import React, { useEffect, useState, useRef } from "react";
import { Input, Row, Col, Container, Button } from "reactstrap";
import Modal from "react-bootstrap/Modal";
import { getReq, putReq } from "../Api/api";
import { useSelector } from "react-redux";
import "./Model.css";
import Form from "react-bootstrap/Form";
import { start } from "@popperjs/core";

const Allocation = ({ EmployeeRow, onClose, SToast, EToast, onRefresh }) => {
  const url = process.env.REACT_APP_URL;
  const [isModalOpen, setModalOpen] = useState(true);
  const [startdate, setStartdate] = useState();
  const [enddate, setEnddate] = useState();
  const select = useSelector((state) => state?.login?.tasks);
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [result, setResult] = useState([]);
  const [projectcode, setProjectCode] = useState();
  const [clientCode, setClientCode] = useState();
  const [errors, setErrors] = useState({});
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [projectopen, setProjectOpen] = useState(true);
  const [projectId, setProjectId] = useState();
  const [billability, setBillability] = useState();

  const billable = [
    { label: "Billable", value: 'Billable' }, {
      label: "Non-Billable", value: 'Non-Billable'
    }, {
      label: "Partial-Billable", value: 'Partial-Billable'
    },
  ];
  const fetchProjects = async () => {
    try {
      const res = await getReq(`${url}projects/getAll`);
      const sortedProjects = res?.data?.sort((a, b) => {
        return a.projectName.localeCompare(b.projectName);
      });
      setProjects(sortedProjects);
      setFilteredProjects(sortedProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };
  const fetchClients = async () => {
    const res = await getReq(`${url}clients/getAll`);
    const sortedclient = res?.data?.sort((a, b) => {
      return a.clientName.localeCompare(b.clientName);
    });
    setClients(sortedclient);
  };
  useEffect(() => {
    fetchProjects();
    fetchClients();
    Validation(EmployeeRow.processes);
    // console.log(EmployeeRow);
  }, []);
  useEffect(() => {
    filterProjectsByClient(clientCode);
  }, [clients, projects]);

  const Validation = (item) => {
    // console.log(item);
    const res = item.find(
      (obj) =>
        obj.createdBy === select[0].employeeId &&
        obj.processStatus === "SoftBlocked"
    );
    // console.log(res);
    setResult(res);
  };

  const RequirementId = EmployeeRow.processes.filter((obj) => obj.createdBy === select[0].employeeId)
  const filterProjectsByClient = (clientId) => {
    // console.log(projects);
    // console.log(clientId);
    const filtered = projects.filter(
      (project) => project.clientCode === clientId
    );
    // console.log(filtered);
    setFilteredProjects(filtered);
  };
  const handleClientChange = (e) => {
    setErrors({
      ...errors,
      project: undefined,
      client: undefined,
    });

    const clientId = e.target.value;
    setProjectOpen(false);
    setClientCode(clientId);
    filterProjectsByClient(clientId);
  };
  const setProject = () => {
    if (!clientCode) {
      setErrors({
      });
    } else {
      setErrors({
        ...errors,
        project: undefined,
      });
      setProjectOpen(false);
    }
  };
  const validateSave = () => {
    const errors = {};
    if (!clientCode) {
      errors["client"] = "This is required";
    } else if (!projectcode) {
      errors["project"] = "This is required";
    }
    else if (!billability) {
      errors["billability"] = "Please select billability"
    } else if (!startdate || !enddate) {
      errors["end date"] = "Both start and end dates need to be filled";
    }
    else if (startdate > enddate) {
      // console.log(billability);
      errors["end date"] = "End date must be greater than start date";
    }
    return errors;
  };

  const handleAllocationSave = () => {
    // console.log(billability);
    const validationErrors = validateSave();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    putReq(`${url}ResourceAllocProcess/update/${result.id}`, {
      updatedBy: select[0].employeeId,
      startDate: startdate,
      endDate: enddate,
      processStatus: "Allocation Requested",
      projectCode: projectcode,
      projectId: projectId,
      billability: billability
    }).then((response) => {
      if (response.data) {
        SToast("Resource Allocation request submitted successfully.");
        onRefresh();
        onClose();
      } else {
        EToast("Resource Allocation request failed.");
      }
    });
  };
  // console.log(projectId);
  // console.log(projectcode);

  const startDateRef = useRef(null);
console.log(startDateRef)
  const handleBillabilityChange = (e) => {
    setBillability(e.target.value);
    if (startDateRef.current) {
      startDateRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <div className="AllocationContainer">
      <Modal show={isModalOpen} onHide={onClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Allocation</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ overflowX: "hidden" }}>
          <Container fluid className="m-1">
            <Row className="mx-2">Resource</Row>
            <Row className="mx-2">
              <Input
                type="text"
                style={{ border: "none", borderBottom: "1px solid lightgray" }}
                value={EmployeeRow.resource.name}
                readOnly
              />
            </Row>
            <Row className="mt-3 mx-2">Requirement Id</Row>
            <Row className="mx-2">
              <Input
                type="text"
                style={{ border: "none", borderBottom: "1px solid lightgray" }}
                value={RequirementId[0]?.requirementID}
                readOnly
              />
            </Row>
            <Row className="mt-3 mx-2">Client</Row>
            <Row className="mx-2">
              <Form.Select
                aria-label="Default select example"
                onChange={(e) => handleClientChange(e)}
              >
                <option disabled selected hidden>
                  Select Client
                </option>
                {clients &&
                  clients?.map((data) => (
                    <option key={data?.id} value={data?.clientCode}>
                      {data?.clientName}
                    </option>
                  ))}
              </Form.Select>
              {errors["client"] && (
                <p
                  style={{
                    width: "100%",
                    marginTop: "0.25rem",
                    fontSize: "0.875em",
                    color: "var(--bs-form-invalid-color)",
                  }}
                >
                  {errors["client"]}
                </p>
              )}
            </Row>
            <Row className="mt-3 mx-2">Project</Row>
            <Row className="mx-2">
              <Form.Select
                aria-label="Default select example"
                onClick={setProject}
                onChange={(e) => {
                  const selectedProjectId =
                    e.target.options[e.target.selectedIndex].id;
                  setProjectCode(e.target.value);
                  setProjectId(selectedProjectId);
                }}
                disabled={projectopen}
              >
                <option disabled selected hidden>
                  Select Project
                </option>
                {filteredProjects &&
                  filteredProjects.map((data) => (
                    <option key={data?.id} id={data?.id} value={data?.projectCode}>
                      {data?.projectName}
                    </option>
                  ))}
              </Form.Select>
              {errors["project"] && (
                <p
                  style={{
                    width: "100%",
                    marginTop: "0.25rem",
                    fontSize: "0.875em",
                    color: "var(--bs-form-invalid-color)",
                  }}
                >
                  {errors["project"]}
                </p>
              )}
            </Row>
            <Row className="mt-3 mx-2">Billability</Row>
            <Row className="mx-2">
              <Form.Select
                aria-label="Default select example"
                onChange={handleBillabilityChange}
              >
                <option disabled selected hidden>
                  Select Billability
                </option>
                {billable && billable.map((data) => (
                  <option key={data?.label} value={data?.value}>
                    {data?.value}
                  </option>
                ))}
              </Form.Select>
              {errors["billability"] && (
                <p
                  style={{
                    width: "100%",
                    marginTop: "0.25rem",
                    fontSize: "0.875em",
                    color: "var(--bs-form-invalid-color)",
                  }}
                >
                  {errors["billability"]}
                </p>
              )}
            </Row>
            <Row className="mt-3 mx-2 gap-2" style={{ justifyContent: "" }}>
              <Col className="l-6">
                <Row className="mb-1">Start Date</Row>
                <Row>
                  <div ref={startDateRef}>
                    <Input
                      type="date"
                      value={startdate}
                      onChange={(e) => {
                        setStartdate(e.target.value);
                      }}
                    />
                  </div>
                </Row>
              </Col>
              <Col className="l-6">
                <Row className="mb-1">End Date</Row>
                <Row>
                  <Input
                    type="date"
                    value={enddate}
                    onChange={(e) => {
                      setEnddate(e.target.value);
                    }}
                  />
                </Row>
              </Col>
              {errors["end date"] && (
                <p
                  style={{
                    width: "100%",
                    marginTop: "0.25rem",
                    fontSize: "0.875em",
                    color: "var(--bs-form-invalid-color)",
                  }}
                >
                  {errors["end date"]}
                </p>
              )}
            </Row>
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
            <Button className="saveBtn" onClick={handleAllocationSave}>
              Submit
            </Button>
            <Button className="cancelBtn" onClick={() => onClose()}>
              Cancel
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default Allocation;
