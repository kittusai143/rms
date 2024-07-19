import {
    Row,
    Col,
    Container,
    Label,
    Input,
    Button,
    Table,
    Form,
    Pagination,
    PaginationItem,
    PaginationLink,
  } from "reactstrap";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { faSearch, faEdit } from "@fortawesome/free-solid-svg-icons";
  import "../../CSS/PDO/ConsultantData.css";
  import { useEffect, useState } from "react";
  import Toast, { handleErrorToast, handleSuccessToast } from "./Toast";
  import Pmo_Dashboard from "../../Api/Pmo_Dashboard.js";
  export default function ConsultantData() {
    const [consultantData, setConsultantData] = useState({
      silId: "",
      vendorID: "",
      consultantName: "",
      consultantContact: "",
      consultantEmail: "",
      consultantExprience: "",
      role: "",
      status: "Active"
    });
    const [successToast, setSuccessToast] = useState(false);
    const [errorToast, setErrorToast] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [data, setData] = useState([]);
    const [edit, setEdit] = useState(false);
    const [vendorIds, setVendorIds] = useState([]);
    const filtered=data
    ?.filter((item) =>
    item.silId?.toLowerCase().includes(searchTerm?.toLowerCase())||
    item.consultantName?.toLowerCase().includes(searchTerm?.toLowerCase())||
    item.consultantEmail?.toLowerCase().includes(searchTerm?.toLowerCase())||
    item.consultantContact?.toLowerCase().includes(searchTerm?.toLowerCase())||
    item.consultantExperience?.toLowerCase().includes(searchTerm?.toLowerCase())||
    item.role?.toLowerCase().includes(searchTerm?.toLowerCase())||
    item.vendorID?.toLowerCase().includes(searchTerm?.toLowerCase())||
    item.status?.toLowerCase().includes(searchTerm?.toLowerCase())
    )
    const pageSize = 5;
    const pageCount = Math.ceil(filtered?.length / pageSize);
    const [errors, setErrors] = useState();
    const [currentPage, setCurrentPage] = useState(0);
  
    const startIndex = currentPage * pageSize + 1;
    const endIndex = Math.min((currentPage + 1) * pageSize, filtered?.length);
  
    const handlePageClick = (pageIndex) => {
      setCurrentPage(pageIndex);
    };
  
  
    const validateForm = () => {
      const errors = {};
      Object.keys(consultantData).forEach((field) => {
        const temp = consultantData[field] + ""
        if (!consultantData[field] || !temp.trim()) {
          errors[field] = "This field is required";
        } else if (field === "consultantExperience") {
          if (isNaN(consultantData.consultantExperience)) {
            errors[field] = "Experience should be a number";
          }
        }else if (field === "consultantContact") {
          const contactPattern = /^\d{10}$/;
          if (!contactPattern.test(consultantData.consultantContact)) {
              errors[field] = "Enter a valid contact number";
          }
        } else if (field === "consultantEmail") {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(consultantData.consultantEmail)) {
            errors[field] = "Enter a valid emailId";
          }
        }
      });
  
      return errors;
    };
  
    const handleSave = async (e) => {
      const validate = validateForm();
      if (Object.keys(validate).length > 0) {
        setErrors(validate);
        return;
      }
      if (edit == false) {
        // const data={...consultantData,status:"Active"}
        console.log(consultantData);
        Pmo_Dashboard.addConsultant(consultantData).then((res) => {
          handleSuccessToast("Data added successfully");
          setConsultantData({
            silId: "",
            vendorID: "",
            consultantName: "",
            consultantContact: "",
            consultantEmail: "",
            consultantExprience: "",
            role: "",
            status: "Active"
          })
          handleCancel()
          Pmo_Dashboard.getAllConsultant().then((res) => {
            setData(res.data);
          });
        });
      } else {
        Pmo_Dashboard.updateConsultant(consultantData).then((res) => {
          handleSuccessToast("Data updated successfully");
          setConsultantData({
            silId: "",
            vendorID: "",
            consultantName: "",
            consultantContact: "",
            consultantEmail: "",
            consultantExprience: "",
            role: "",
            status: ""
          })
          handleCancel()
          Pmo_Dashboard.getAllConsultant().then((res) => {
            setData(res.data);
          });
        });
        setEdit(false)
      }
    };
    const fetch = async () => {
      const res = await Pmo_Dashboard.getAllConsultant();
      setData(res?.data);
    };
    useEffect(() => {
      fetch();
      setVendors();
    }, []);
  
    const handleSearch = () => { };
  
    const handleEdit = (item) => {
      setErrors({})
      const temp=item
      delete temp.vendorEmployeeType
      delete temp.workLocation
      setConsultantData({ ...temp });
      setEdit(true);
    };
  
    const setVendors = async () => {
      const response = await Pmo_Dashboard.getAllVendorIds();
      setVendorIds(response.data);
    };
    const handleCancel = () => {
      setConsultantData({
        silId: "",
        vendorID: "",
        consultantName: "",
        consultantContact: "",
        consultantEmail: "",
        consultantExprience: "",
        role: "",
        status: ""
      })
      setErrors({});
      if (edit == true) setEdit(false);
    };
    return (
      <>
        <Container>
          <Container className="container card project_container">
            <span className="project_heading">CONSULTANT DATA</span>
            <Form>
              <Row className="mb-3">
                <Col>
                  <Label>Emp ID</Label>
                  <Input
                    required
                    name="silId"
                    value={consultantData?.silId||""}
                    onChange={(e) => {
                      setConsultantData({
                        ...consultantData,
                        silId: e.target.value,
                      });
                      if (e.target.value) {
                        setErrors({ ...errors, silId: "" })
                      }
                    }
                    }
                  ></Input>
                  {errors && (
                    <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                      {errors.silId}
                    </div>
                  )}
                </Col>
                <Col>
                  <Label>Consultant Name</Label>
                  <Input
                    required
                    name="consultantName"
                    value={consultantData?.consultantName||""}
                    onChange={(e) => {
                      setConsultantData({
                        ...consultantData,
                        consultantName: e.target.value,
                      });
                      if (e.target.value) {
                        setErrors({ ...errors, consultantName: "" })
                      }
                    }
                    }
                  ></Input>
                  {errors && (
                    <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                      {errors.consultantName}
                    </div>
                  )}
                </Col>
                <Col>
                  <Label>Consultant Email </Label>
                  <Input
                    required
                    type="email"
  
                    name="consultantEmail"
                    value={consultantData?.consultantEmail||""}
                    onChange={(e) => {
                      setConsultantData({
                        ...consultantData,
                        consultantEmail: e.target.value,
                      });
                      if (e.target.value) {
                        setErrors({ ...errors, consultantEmail: "" })
                      }
                    }
                    }
                  ></Input>
                  {errors && (
                    <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                      {errors.consultantEmail}
                    </div>
                  )}
                </Col>
               
  
  
              </Row>
              <Row className="mb-3">
               
              
                <Col>
                  <Label>Consultant Contact Number</Label>
                  <Input
                    required
                    maxLength="16"
                    name="consultantContact"
                    value={consultantData?.consultantContact||""}
                    onChange={(e) => {
                      setConsultantData({
                        ...consultantData,
                        consultantContact: e.target.value,
                      });
                      if (e.target.value) {
                        setErrors({ ...errors, consultantContact: "" })
                      }
                    }
                    }
                  ></Input>
                  {errors && (
                    <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                      {errors.consultantContact}
                    </div>
                  )}
                </Col>
                <Col xs="4">
                  <Label>Consultant Experience (in Years)</Label>
                  <Input
                    required
                    type="number"
  
                    name="consultantExp"
                    value={consultantData?.consultantExprience||""}
                    onChange={(e) => {
                      setConsultantData({
                        ...consultantData,
                        consultantExprience: e.target.value,
                      });
                      if (e.target.value) {
                        setErrors({ ...errors, consultantExprience: "" })
                      }
                    }
                    }
                  ></Input>
                  {errors && (
                    <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                      {errors.consultantExprience}
                    </div>
                  )}
                </Col>
                <Col >
                  <Label>Emp Role</Label>
                  <Input
                    required
                    type="text"
                    name="role"
                    value={consultantData?.role||""}
                    onChange={(e) => {
                      setConsultantData({
                        ...consultantData,
                        role: e.target.value,
                      });
                      if (e.target.value) {
                        setErrors({ ...errors, role: "" })
                      }
                    }
                    }
                  ></Input>
                  {errors && (
                    <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                      {errors.role}
                    </div>
                  )}
                </Col>
              </Row>
              <Row className="mb-3" >
              <Col xs="4">
                  <Label>Vendor Name</Label>
                  <Input
                    type="select"
                    name="vendorname"
                    required
                    value={consultantData?.vendorID||""}
                    onChange={(e) => {
                      setConsultantData({
                        ...consultantData,
                        vendorID: e.target.value,
                      });
                      if (e.target.value) {
                        setErrors({ ...errors, vendorID: "" })
                      }
                    }
                    }
                  >
                    <option value="">Select</option>
                    {vendorIds?.map((vendor) => (
                    <option key={vendor?.vendorName} value={vendor?.vendorName}>
                      {vendor?.VendorName}
                    </option>
                  ))}
                  </Input>
                  {errors && (
                    <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                      {errors.vendorID}
                    </div>
                  )}
                </Col>
                {edit === true ? (
  
  
                  <Col xs="4">
                    <Label>Consultant Status</Label>
  
                    <select
                      className="select_dropdown"
                      value={consultantData?.status||""}
                      onChange={(e) => {
                        setConsultantData({
                          ...consultantData,
                          status: e.target.value,
                        });
                        if (e.target.value) {
                          setErrors({ ...errors, status: "" })
                        }
                      }
                      }
                    >
                      <option value="">Select</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                    {errors && (
                      <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                        {errors.status}
                      </div>
                    )}
                  </Col>
                ) : null}
              </Row>
              <div class="col-4 button_client">
                <div className="ventor_buttons">
                  {edit == false ? (
                    <Button style={{
                      backgroundColor: "#535BFF", width: "100px",
                      color: " #fff",
                      border: "none"
                    }} className="save_btn" onClick={(e) => handleSave(e)}>
                      Save
                    </Button>
                  ) : (
                    <Button style={{
                      backgroundColor: "#535BFF", width: "100px",
                      color: " #fff",
                      border: "none"
                    }} className="save_btn" onClick={(e) => handleSave(e)}>
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
            <Table striped bordered className="tabel_content" hover responsive size="">
              <thead style={{ backgroundColor: "#E6E1C1", borderBottom: "none" }}>
                <tr>
                <th style={{
                    backgroundColor: "#535BFF",
                    color: " #fff",
                    border: "none"
                  }}> Actions </th>
                  <th style={{
                    backgroundColor: "#535BFF",
                    color: " #fff",
                    border: "none"
                  }}>Emp ID</th>
                
                  <th style={{
                    backgroundColor: "#535BFF",
                    color: " #fff",
                    border: "none"
                  }}>Consultant Name</th>
                   <th style={{
                    backgroundColor: "#535BFF",
                    color: " #fff",
                    border: "none"
                  }}>Consultant Email</th>
                  <th style={{
                    backgroundColor: "#535BFF",
                    color: " #fff",
                    border: "none"
                  }}>Consultant Contact Number</th>
                 
                  <th style={{
                    backgroundColor: "#535BFF",
                    color: " #fff",
                    border: "none"
                  }}>Consultant Experience (in Years)</th>
                  <th style={{
                    backgroundColor: "#535BFF",
                    color: " #fff",
                    border: "none"
                  }}>Emp Role</th>
                    <th style={{
                    backgroundColor: "#535BFF",
                    color: " #fff",
                    border: "none"
                  }}>Vendor Name</th>
                  <th style={{
                    backgroundColor: "#535BFF",
                    color: " #fff",
                    border: "none"
                  }}>Status </th>
                 
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
                      <td>{item.silId}</td>
                      <td>{item.consultantName}</td>
                      <td>{item.consultantEmail}</td>
                      <td>{item.consultantContact}</td>
                      <td>{item.consultantExprience}</td>
                      <td>{item.role}</td>
                      <td>{item.vendorID}</td>
                      <td>{item.status}</td>
                      
                    </tr>
                  ))
  
                }
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
                <PaginationItem disabled={currentPage >= endIndex-1}>
                  <PaginationLink
                    next
                    onClick={() => handlePageClick(currentPage + 1)}
                  />
                </PaginationItem>
              </Pagination>
            </div>
          </div>
  
        </Container>
        <Toast setSuccessToast={setSuccessToast} setErrorToast={setErrorToast} />
      </>
    );
  }
  