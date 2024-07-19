import {
    Row,
    Col,
    Container,
    Label,
    Input,
    Button,
    Table,
    Pagination,
    PaginationItem,
    PaginationLink,
    Form,
  } from "reactstrap";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { faSearch, faEdit } from "@fortawesome/free-solid-svg-icons";
  import "../../CSS/PDO/ProjectData.css";
  import { useEffect, useState } from "react";
  import Pmo_Dashboard from "../../Api/Pmo_Dashboard.js";

  import Toast, { handleErrorToast, handleSuccessToast } from "./Toast";
  export default function ProjectData() {
    const [projectData, setProjectData] = useState({
      domainName: "",
      sizeOfProjectHrs: "",
      typeOfProject: "",
      deliveryManager: "",
      projectManager: "",
      sowEndDate: "",
      sowStartDate: "",
      sow: "",
      projectEndDate: "",
      projectStartDate: "",
      projectObjective: "",
      projectName: "",
      projectCode: "",
      clientName: "",
    });
    
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [clients, setClients] = useState([]);
    const [sowId, setSowId] = useState([]);
    const pageSize = 5;
    const [data, setData] = useState([]);
    const filtered=data
    ?.filter((item) =>
    item.projectName?.toLowerCase().includes(searchTerm?.toLowerCase())||
    item.projectCode?.toLowerCase().includes(searchTerm?.toLowerCase())||
    item.clientName?.toLowerCase().includes(searchTerm?.toLowerCase())||
    item.projectObjective?.toLowerCase().includes(searchTerm?.toLowerCase())||
    item.typeOfProject?.toLowerCase().includes(searchTerm?.toLowerCase())||
    item.projectManager?.toLowerCase().includes(searchTerm?.toLowerCase())||
    item.deliveryManager?.toLowerCase().includes(searchTerm?.toLowerCase())||
    item.projectStartDate?.toLowerCase().includes(searchTerm?.toLowerCase())|
    item.projectEndDate?.toLowerCase().includes(searchTerm?.toLowerCase())||
    item.sowId?.toLowerCase().includes(searchTerm?.toLowerCase())||
    item.domainName?.toLowerCase().includes(searchTerm?.toLowerCase())
    )
    const pageCount = Math.ceil(filtered?.length / pageSize);
    const [domain, setDomain] = useState();
    const [successToast, setSuccessToast] = useState(false);
    const [errorToast, setErrorToast] = useState(false);
    const [errors, setErrors] = useState();
    const [edit, setEdit] = useState(false);
    const startIndex = currentPage * pageSize + 1;
    const end = pageCount - 1;
    const endIndex = Math.min((currentPage + 1) * pageSize, filtered?.length);
    const validateForm = () => {
      const errors = {};
      Object.keys(projectData).forEach((field) => {
        const temp = "" + projectData[field];
        if (!projectData[field] || !temp.trim()) {
          errors[field] = `This field is required`;
        } else if (field == "projectEndDate") {
          if (projectData?.projectEndDate <= projectData?.projectStartDate) {
            errors[field] = "End date should be later than Start date";
          }
        } else if (field == "sizeOfProjectHrs") {
          if (projectData[field] < 0) {
            errors[field] = "Cannot be a negative value";
          }
        }
      });
      return errors;
    };
    const handlePageClick = (pageIndex) => {
      setCurrentPage(pageIndex);
    };
    const handleSave = async (e) => {
      const validate = validateForm();
      console.log(validate)
      if (Object.keys(validate).length > 0) {
        setErrors(validate);
        return;
      }
  
      if (edit == false) {
        Pmo_Dashboard.addProject(projectData).then((res) => {
          handleSuccessToast("Data added successfully");
  
          setProjectData({
            domainName: "",
            sizeOfProjectHrs: "",
            typeOfProject: "",
            deliveryManager: "",
            projectManager: "",
  
            sowEndDate: "",
            sowStartDate: "",
            sow: "",
            projectEndDate: "",
            projectStartDate: "",
  
            projectObjective: "",
            projectName: "",
            projectCode: "",
            clientName: "",
          });
          Pmo_Dashboard.getAllProjects().then((res) => {
            setData(res.data);
          });
        });
      } else {
        Pmo_Dashboard.updateProject(projectData).then((res) => {
          handleSuccessToast("Data updated successfully");
  
          setProjectData({
            domainName: "",
            sizeOfProjectHrs: "",
            typeOfProject: "",
            deliveryManager: "",
            projectManager: "",
  
            sowEndDate: "",
            sowStartDate: "",
            sow: "",
            projectEndDate: "",
            projectStartDate: "",
  
            projectObjective: "",
            projectName: "",
            projectCode: "",
            clientName: "",
          });
          Pmo_Dashboard.getAllProjects().then((res) => {
            setData(res.data);
          });
        });
        setEdit(false);
      }
    };
    useEffect(() => {
      Pmo_Dashboard.getAllProjects().then((res) => {
        setData(res.data);
      });
      Pmo_Dashboard.getAllClients().then((res) => {
        setClients(res.data);
      });
      Pmo_Dashboard.getSowIds().then((res) => {
        setSowId(res.data);
      });
      Pmo_Dashboard.getAllDomains().then((res) => {
        setDomain(res.data);
      });
    }, []);
  
    const handleSearch = () => {};
  
    const handleEdit = (item) => {
      setErrors({});
      const temp=item
      delete temp.clientCode;
      delete temp.projectStatus;
      delete temp.domainId;
      delete temp.projectStar;
      delete temp.duration;
      setEdit(true);
      setProjectData({ ...temp });
    };
    const handleCancel = () => {
      setProjectData({
        domainName: "",
        sizeOfProjectHrs: "",
        typeOfProject: "",
        deliveryManager: "",
        projectManager: "",
        sowEndDate: "",
        sowStartDate: "",
        sow: "",
        projectEndDate: "",
        projectStartDate: "",
        projectObjective: "",
        projectName: "",
        projectCode: "",
        clientName: "",
      });
      setErrors({});
      if (edit == true) setEdit(false);
    };
  
    return (
      <>
        <Container>
          <Container className="container card project_container">
            <span className="project_heading">PROJECT DATA</span>
  
            <Form>
              <Row className="mb-3">
                <Col>
                  <Label>Project Name</Label>
                  <Input
                    required
                    value={projectData?.projectName||""}
                    onChange={(e) => {
                      setProjectData({
                        ...projectData,
                        projectName: e.target.value,
                      });
                      if (e.target.value) {
                        setErrors({ ...errors, projectName: "" });
                      }
                    }}
                  ></Input>
                  {errors && (
                    <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                      {errors.projectName}
                    </div>
                  )}
                </Col>
                <Col>
                  <Label>Project Code</Label>
                  <Input
                    required
                    value={projectData?.projectCode||""}
                    onChange={(e) => {
                      setProjectData({
                        ...projectData,
                        projectCode: e.target.value,
                      });
                      if (e.target.value) {
                        setErrors({ ...errors, projectCode: "" });
                      }
                    }}
                  ></Input>
                  {errors && (
                    <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                      {errors.projectCode}
                    </div>
                  )}
                </Col>
                <Col>
                  <Label>Client Name</Label>
                  <select
                    className="select_dropdown"
                    value={projectData?.clientName||""}
                    onChange={(e) => {
                      setProjectData({
                        ...projectData,
                        clientName: e.target.value,
                      });
                      if (e.target.value) {
                        setErrors({ ...errors, clientName: "" });
                      }
                    }}
                  >
                    <option value="">Select</option>
                    {clients?.map((d) => (
                      <option value={d.clientName}>{d.clientName}</option>
                    ))}
                  </select>
                  {errors && (
                    <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                      {errors.clientName}
                    </div>
                  )}
                </Col>
                <Col>
                  <Label>Project Objective</Label>
                  <Input type="textarea"
                    required
                    value={projectData?.projectObjective||""}
                    onChange={(e) => {
                      setProjectData({
                        ...projectData,
                        projectObjective: e.target.value,
                      });
                      if (e.target.value) {
                        setErrors({ ...errors, projectObjective: "" });
                      }
                    }}
                  ></Input>
                  {errors && (
                    <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                      {errors.projectObjective}
                    </div>
                  )}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <Label>Type of Project</Label>
                  <Input
                    required
                    value={projectData?.typeOfProject||""}
                    onChange={(e) => {
                      setProjectData({
                        ...projectData,
                        typeOfProject: e.target.value,
                      });
                      if (e.target.value) {
                        setErrors({ ...errors, typeOfProject: "" });
                      }
                    }}
                  ></Input>
                  {errors && (
                    <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                      {errors.typeOfProject}
                    </div>
                  )}
                </Col>
                <Col>
                  <Label>Project Manager(L1)</Label>
                  <Input
                    required
                    value={projectData?.projectManager||""}
                    onChange={(e) => {
                      setProjectData({
                        ...projectData,
                        projectManager: e.target.value,
                      });
                      if (e.target.value) {
                        setErrors({ ...errors, projectManager: "" });
                      }
                    }}
                  ></Input>
                  {errors && (
                    <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                      {errors.projectManager}
                    </div>
                  )}
                </Col>
                <Col>
                  <Label>Delivery Manager(L2)</Label>
                  <Input
                    required
                    value={projectData?.deliveryManager||""}
                    onChange={(e) => {
                      setProjectData({
                        ...projectData,
                        deliveryManager: e.target.value,
                      });
                      if (e.target.value) {
                        setErrors({ ...errors, deliveryManager: "" });
                      }
                    }}
                  ></Input>
                  {errors && (
                    <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                      {errors.deliveryManager}
                    </div>
                  )}
                </Col>
                <Col>
                  <Label>Project Start Date</Label>
                  <Input
                    required
                    type="date"
                    value={projectData?.projectStartDate||""}
                    onChange={(e) => {
                      setProjectData({
                        ...projectData,
                        projectStartDate: e.target.value,
                      });
                      if (e.target.value) {
                        setErrors({ ...errors, projectStartDate: "" });
                      }
                    }}
                  ></Input>
                  {errors && (
                    <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                      {errors.projectStartDate}
                    </div>
                  )}
                </Col>
              </Row>
  
              <Row className="mb-3">
                <Col>
                  <Label>Project End Date</Label>
                  <Input
                    required
                    type="date"
                    value={projectData?.projectEndDate||""}
                    onChange={(e) => {
                      setProjectData({
                        ...projectData,
                        projectEndDate: e.target.value,
                      });
                      if (e.target.value) {
                        setErrors({ ...errors, projectEndDate: "" });
                      }
                    }}
                  ></Input>
                  {errors && (
                    <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                      {errors.projectEndDate}
                    </div>
                  )}
                </Col>
                <Col>
                  <Label>SOW ID</Label>
                  <select
                    className="select_dropdown"
                    value={projectData?.sow||""}
                    onChange={(e) => {
                      setProjectData({ ...projectData, sow: e.target.value });
  
                      if (e.target.value) {
                        setErrors({
                          ...errors,
                          sow: "",
                          sowStartDate: "",
                          sowEndDate: "",
                        });
                        Pmo_Dashboard.getSowDataById(e.target.value).then(
                          (res) => {
                            setProjectData((prevProjectData) => ({
                              ...prevProjectData,
                              sowStartDate: res.data.sowStartDate,
                              sowEndDate: res.data.sowEndDate,
                            }));
                          }
                        );
                      } else {
                        setProjectData({
                          ...projectData,
                          sow: e.target.value,
                          sowStartDate: "",
                          sowEndDate: "",
                        });
                      }
                    }}
                  >
                    <option value="">Select</option>
                    {sowId?.map((d) => (
                      <option value={d}>{d}</option>
                    ))}
                  </select>
                  {errors && (
                    <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                      {errors.sow}
                    </div>
                  )}
                </Col>
                <Col>
                  <Label>Domain</Label>
                  <Input
                    required
                    value={projectData?.domainName||""}
                    onChange={(e) => {
                      setProjectData({
                        ...projectData,
                        domainName: e.target.value,
                      });
                      if (e.target.value) {
                        setErrors({ ...errors, domainName: "" });
                      }
                    }}
                  ></Input>
  
                  {errors && (
                    <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                      {errors.domainName}
                    </div>
                  )}
                </Col>
                <Col>
                  <Label>Size of Project Hours</Label>
                  <Input
                    required
                    type="number"
                    value={projectData?.sizeOfProjectHrs||""}
                    onChange={(e) => {
                      setProjectData({
                        ...projectData,
                        sizeOfProjectHrs: e.target.value,
                      });
                      if (e.target.value) {
                        setErrors({ ...errors, sizeOfProjectHrs: "" });
                      }
                    }}
                  ></Input>
                  {errors && (
                    <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                      {errors.sizeOfProjectHrs}
                    </div>
                  )}
                </Col>
              </Row>
  
              <div class="col-4 button_client">
                <div className="ventor_buttons">
                  {edit == false ? (
                    <Button
                      style={{
                        backgroundColor: "#535BFF",
                        width: "100px",
                        color: " #fff",
                        border: "none",
                      }}
                      className="save_btn"
                      onClick={(e) => handleSave(e)}
                    >
                      Save
                    </Button>
                  ) : (
                    <Button
                      style={{
                        backgroundColor: "#535BFF",
                        width: "100px",
                        color: " #fff",
                        border: "none",
                      }}
                      className="save_btn"
                      onClick={(e) => handleSave(e)}
                    >
                      Update
                    </Button>
                  )}
  
                  <Button
                   className="tech_cancel_btn"
                   color="light"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Form>
          </Container>
          {data.hasOwnProperty("message") ? (
            <div className="container card">
              <Table className="mt-4 ">
                <tbody>
                  <tr>
                    <td colSpan="18" style={{ textAlign: "center" }}>
                      <div
                        style={{
                          padding: "20px",
                          backgroundColor: "#f2f2f2",
                          borderRadius: "5px",
                        }}
                      >
                        <h4>No data found</h4>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          ) : (
            <div class="container card project_container ">
              <span className="project_heading">RECENTLY ADDED</span>
              <div className="search-container">
                <div className="search-input">
                  <Input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    outline
                    className="searchbox"
                    onChange={(e) => {setSearchTerm(e.target.value);setCurrentPage(0)}}
                  />
                  <FontAwesomeIcon icon={faSearch} className="search-icon" />
                </div>
                <div className="search-button">
                  <Button outline onClick={handleSearch}>
                    Search
                  </Button>
                </div>
              </div>
              <Table
                striped
                bordered
                className="tabel_content"
                hover
                responsive
                size=""
              >
                <thead
                  style={{ backgroundColor: "#E6E1C1", borderBottom: "none" }}
                >
                  <tr>
                  <th
                      style={{
                        backgroundColor: "#535BFF",
                        color: " #fff",
                        border: "none",
                      }}
                    >
                      Actions
                    </th>
                    <th
                      style={{
                        backgroundColor: "#535BFF",
                        color: " #fff",
                        border: "none",
                      }}
                    >
                      Project Name
                    </th>
                    <th
                      style={{
                        backgroundColor: "#535BFF",
                        color: " #fff",
                        border: "none",
                      }}
                    >
                      Project Code
                    </th>
                    <th
                      style={{
                        backgroundColor: "#535BFF",
                        color: " #fff",
                        border: "none",
                      }}
                    >
                      Client Name
                    </th>
                    <th
                      style={{
                        backgroundColor: "#535BFF",
                        color: " #fff",
                        border: "none",
                      }}
                    >
                      Project Objective
                    </th>
                    <th
                      style={{
                        backgroundColor: "#535BFF",
                        color: " #fff",
                        border: "none",
                      }}
                    >
                      Type of Project
                    </th>
                    <th
                      style={{
                        backgroundColor: "#535BFF",
                        color: " #fff",
                        border: "none",
                      }}
                    >
                      Project Manager(L1)
                    </th>
                    <th
                      style={{
                        backgroundColor: "#535BFF",
                        color: " #fff",
                        border: "none",
                      }}
                    >
                      Delivery Manager(L2)
                    </th>
  
                    <th
                      style={{
                        backgroundColor: "#535BFF",
                        color: " #fff",
                        border: "none",
                      }}
                    >
                      Project Start Date
                    </th>
                    <th
                      style={{
                        backgroundColor: "#535BFF",
                        color: " #fff",
                        border: "none",
                      }}
                    >
                      Project End Date
                    </th>
                    <th
                      style={{
                        backgroundColor: "#535BFF",
                        color: " #fff",
                        border: "none",
                      }}
                    >
                      SOW ID
                    </th>
  
                    <th
                      style={{
                        backgroundColor: "#535BFF",
                        color: " #fff",
                        border: "none",
                      }}
                    >
                      Domain 
                    </th>
  
                    <th
                      style={{
                        backgroundColor: "#535BFF",
                        color: " #fff",
                        border: "none",
                      }}
                    >
                      Size of Project Hours
                    </th>
  
                    
                  </tr>
                </thead>
                <tbody>
                  {filtered
                    ?.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
                    ?.map((item) => (
                      <tr key={item.id}>
                         <td>
                          <FontAwesomeIcon
                            icon={faEdit}
                            onClick={() => handleEdit(item)}
                          />
                        </td>
                        <td>{item.projectName}</td>
                        <td>{item.projectCode}</td>
                        <td>{item.clientName}</td>
                        <td>{item.projectObjective}</td>
                        <td>{item.typeOfProject}</td>
                        <td>{item.projectManager}</td>
                        <td>{item.deliveryManager}</td>
                        <td>{item.projectStartDate}</td>
                        <td>{item.projectEndDate}</td>
                        <td>{item.sow}</td>
                        <td>{item.domainName}</td>
                        <td>{item.sizeOfProjectHrs}</td>
  
                       
                      </tr>
                    ))}
                </tbody>
              </Table>
              <div className="pagination-container">
                <Pagination>
                  <PaginationItem disabled={currentPage <= 0}>
                    <PaginationLink
                      previous
                      onClick={() => handlePageClick(currentPage - 1)}
                    />
                  </PaginationItem>
                  <div className="pagination-info">
                    {startIndex}-{endIndex} of {filtered?.length}
                  </div>
                  <PaginationItem disabled={currentPage >= end}>
                    <PaginationLink
                      next
                      onClick={() => handlePageClick(currentPage + 1)}
                    />
                  </PaginationItem>
                </Pagination>
              </div>
            </div>
          )}
        </Container>
        <Toast setSuccessToast={setSuccessToast} setErrorToast={setErrorToast} />
      </>
    );
  }
  