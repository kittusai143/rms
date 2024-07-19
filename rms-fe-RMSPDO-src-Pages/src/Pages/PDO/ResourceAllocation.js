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
    FormFeedback,
    Form,
  } from "reactstrap";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { faSearch, faEdit } from "@fortawesome/free-solid-svg-icons";
  import "../../CSS/PDO/ProjectData.css";
  import { useEffect, useState } from "react";
  import Pmo_Dashboard from "../../Api/Pmo_Dashboard.js";

  import Toast, { handleErrorToast, handleSuccessToast } from "./Toast";
  import Select from "react-select";
  export default function ResourceAllocation() {
    const [formData, setFormData] = useState({
      allocationStatus: "Available",
      contactNumber:"",
      clientCode: "Sentrifugo",
      doj: "",
      employeeType: "",
      gender: "",
      name: "",
      projectCode: "PSAG0524BN",
      role: "",
      silId: "",
      skillset1: "",
      technologydivision: "",
      vendorId: "Sagarsoft",
      yearsofExp: "",
      status: ""
    });
    const regemail = /^[a-zA-Z0-9+_.-]+@[a-z0-9]+\.[a-z]{2,3}$/;
    const regPhone = /^[1-9][0-9]{0,9}$/;
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 5;
    const [data, setData] = useState([]);
    const [successToast, setSuccessToast] = useState(false);
    const [errorToast, setErrorToast] = useState(false);
    const [errors, setErrors] = useState();
    const [edit, setEdit] = useState(false);
    const [groups, setGroups] = useState([])
    const startIndex = currentPage * pageSize + 1;
    const filtered = data
      ?.filter((item) =>
        Object.values(item).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(searchTerm?.toLowerCase())
        )
      )
    const pageCount = Math.ceil(filtered?.length / pageSize);
    const endIndex = Math.min((currentPage + 1) * pageSize, filtered?.length);
    const [vendors, setVendors] = useState([]);
    const [clientIds, setClientIds] = useState([]);
    const [sowId, setSowId] = useState([]);
    const [emp, setEmp] = useState([]);
    const [empid, setEmpId] = useState([]);
    const validateForm = () => {
      const errors = {};
      Object.keys(formData).forEach((field) => {
        const temp = formData[field] + "";
        if (!formData[field] || !temp.trim()) {
          errors[field] = `This field is required`;
        } else if (field === "yearsofExp") {
          if (formData[field] < 0) {
            errors[field] = "Experience cannot be negative";
          }
        } else if (field === "clientEmailID" || field === "partnerEmailID") {
          if (!regemail.test(formData[field])) {
            errors[field] = "Enter a valid emailId";
          }
        } else if (field === "contactNumber") {
          if (!regPhone.test(formData[field])) {
            errors[field] = "Enter a valid contact number";
          }
        }
  
        // if (formData.allocationStatus === "Available" && field === "billability") {
        //   console.log("Billability")
        //   return "";
        // }
      });
      return errors;
    };
    const handlePageClick = (pageIndex) => {
      setCurrentPage(pageIndex);
    };
    const handleCancel = () => {
      setFormData({
        contactNumber: "",
        allocationStatus: "Available",
        clientCode: "Sagarsoft",
        doj: "",
        employeeType: "",
        gender: "",
        name: "",
        projectCode: "Internal",
        role: "",
        silId: "",
        skillset1: "",
        technologydivision: "",
        vendorId: "Sagarsoft",
        yearsofExp: "",
        status: ""
      });
      setErrors({});
      setEdit(false)
    };
    const handleSave = async (e) => {
      const validate = validateForm();
      console.log(validate)
  
      if (Object.keys(validate)?.length > 0) {
        setErrors(validate);
        return;
      }
      if (edit)
        try {
          await Pmo_Dashboard.updateResource(formData);
          fetch();
          handleCancel();
          handleSuccessToast("Resource updated successfully!");
        } catch (error) {
          handleErrorToast(error.message);
        }
      else
        try {
          setFormData((prevData) => ({
            ...prevData,
          }));
          await Pmo_Dashboard.addResource(formData);
          handleCancel();
          fetch();
          handleSuccessToast("Resource added successfully!");
        } catch (error) {
          handleErrorToast(error.message);
        }
    };
  
    const fetch = () => {
      Pmo_Dashboard.getAllResources().then((res) => {
        const activeResources = res.data.filter((item) => item.status !== 'Inactive');
        setData(activeResources);
      });
    };
    useEffect(() => {
      fetch();
  
      Pmo_Dashboard.getAllVendorIds().then((res) => {
        setVendors(res.data);
      });
      Pmo_Dashboard.getSowIds().then((res) => {
        setSowId(res.data);
      });
      Pmo_Dashboard.getAllClientIds().then((res) => {
        setClientIds(res.data);
      });
      Pmo_Dashboard.getEmployeeIds().then((res) => {
        const options = res.data.map((item) => ({
          value: item.employeeId,
          label: item.employeeId,
        }));
        setEmp(options);
      })
        .catch((error) => {
          console.error('Error fetching employee IDs:', error);
  
        });
      Pmo_Dashboard.getEmployeesAllocatedData().then((res) => {
        setEmpId(res.data);
      });
      Pmo_Dashboard.getTechGroupData().then((res) => {
        setGroups(res.data.groups);
      })
    }, []);
  
  
    const handleChange = (e) => {
      const { name, value } = e.target;
  
  
      if (name === 'technologydivision') {
        setFormData((prevData) => ({
          ...prevData,
          technologydivision: value,
        }));
      } else {
  
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
  
  
      if (value) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: '',
        }));
      }
    };
  
    const handleSearch = () => { };
    const handleEdit = (item) => {
      console.log(item)
      setEdit(true);
      setErrors({});
      const temp=item
      if(temp.allocationStatus=="Available"){
        delete temp?.clientEmailID
        delete temp?.partnerEmailID
        delete temp?.clientTimesheetAccess
        delete temp?.yubikeySno
        delete temp?.yubikey
        delete temp?.startDate
        delete temp?.projectEndDate
        delete temp?.billingEndDate
        delete temp?.billingStartDate
      }
      delete temp?.subsidiary
      delete temp?.partner
      delete temp?.ResumeLink
      delete temp?.training;
      delete temp?.techMId;
      delete temp?.consultantId;
      delete temp?.certifications;
      delete temp?.awards;
      delete temp?.audit;
      delete temp?.skillset2;
      setFormData(temp );
    };
    return (
      <>
        <Container>
          <Container className="container card project_container">
            <span className="project_heading">Resource Allocation</span>
            <Form>
              <Row className="mb-3">
                <Col>
                  <Label>Emp ID</Label>
                  <Select
                  isDisabled={edit}
                    value={{ value: formData?.silId, label: formData?.silId } || { value: "", label: "" }}
                    options={emp}
                    onChange={(selectedOption) => {
                      setFormData((prevData) => ({
                        ...prevData,
                        silId: selectedOption.value,
                      }));
                      if(selectedOption){
                        setErrors((prev)=>{return{...prev,silId:""}})
                      }
                      Pmo_Dashboard.getbyEmployeeID(selectedOption.value).then((res) => {
                        setFormData(prevData => ({
                          ...prevData,
                          name: res.data.userFullName,
                          role: res.data.roleName,
                          contactNumber: res.data.contactNumber,
                          doj: res.data.joining?.split("T")[0]
                        }));
                      });
                    }}
                    defaultValue={{
                      value: formData?.silId,
                      label: formData?.silId,
                    }}
                    label="Single select"
                    
                  />
                  {errors && errors?.silId && (
                    <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                      {errors?.silId}
                    </div>
                  )}
                </Col>
                <Col>
                  <Label>Emp Name</Label>
                  <Input
                    disabled
                    required
                    name="name"
                    value={formData?.name || ""}
                    onChange={handleChange}
                  />
                  {errors && errors?.name &&!formData?.name&& (
                    <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                      {errors?.name}
                    </div>
                  )}
                </Col>
                <Col>
                  <Label>Emp Role</Label>
                  <Input
                    disabled
                    required
                    name="role"
                    value={formData?.role || ""}
                    onChange={handleChange}
                  />
                  {errors && errors?.role &&!formData?.role && (
                    <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                      {errors?.role}
                    </div>
                  )}
                </Col>
                <Col>
                  <Label>Emp Type</Label>
                  <select
  
                    className="select_dropdown"
                    name="employeeType"
                    value={formData?.employeeType || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="Employee">Employee</option>
                    <option value="Consultant">Consultant</option>
                    <option value="Intern">Intern</option>
                  </select>
                  {errors && errors?.employeeType && (
                    <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                      {errors.employeeType}
                    </div>
                  )}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <Label>DOJ</Label>
                  <Input
  
                    required
                    type="date"
                    name="doj"
                    value={formData?.doj ? formData.doj.split('T')[0] : ""}
                    onChange={handleChange}
                  />
                  {errors && errors?.doj && (
                    <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                      {errors.doj}
                    </div>
                  )}
                </Col>
                <Col>
                  <Label>Contact Number</Label>
                  <Input
                    disabled
                    required
                    name="contactNumber"
                    value={formData?.contactNumber || ""}
                    onChange={handleChange}
                  />
                  {errors && errors?.contactNumber &&!formData?.contactNumber && (
                    <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                      {errors.contactNumber}
                    </div>
                  )}
                </Col>
                <Col>
                  <Label>Gender</Label>
                  <select
                    className="select_dropdown"
                    name="gender"
                    value={formData?.gender || ""}
                    onChange={handleChange}
                  >
                    {" "}
                    <option value=""> Select </option>
                    <option key="Male" value="Male">
                      {" "}
                      Male{" "}
                    </option>
                    <option key="Female" value="Female">
                      {" "}
                      Female{" "}
                    </option>
                    <option key="Other" value="Other">
                      {" "}
                      Other{" "}
                    </option>
                  </select>
                  {errors && errors?.gender && (
                    <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                      {errors.gender}
                    </div>
                  )}
                </Col>
                <Col>
                  <Label>Allocation Status</Label>
                  <select
                    className="select_dropdown"
                    required
                    disabled
                    name="allocationStatus"
                    value={formData?.allocationStatus || "Available"}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="Allocated">Allocated</option>
                    <option value="Available">Available</option>
                  </select>
  
                  {errors && errors?.allocationStatus && (
                    <FormFeedback style={{ display: "block" }}>
                      {errors?.allocationStatus}
                    </FormFeedback>
                  )}
  
  
                </Col>
              </Row>
              {formData.allocationStatus === "Allocated" && (
                <Row className="mb-3">
                  <Col>
                    <>
                      <Label>Client Name</Label>
                      <select
                        className="select_dropdown"
                        name="clientCode"
                        value={formData?.clientCode || ""}
                        onChange={handleChange}
                      >
                        <option value="">Select</option>
                        {clientIds?.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                      {errors && errors?.clientCode && (
                        <FormFeedback style={{ display: "block" }}>
                          {errors?.clientCode}
                        </FormFeedback>
                      )}
                    </>
                  </Col>
                  {formData.allocationStatus === "Allocated" && (
                    <Col>
                      <>
                        <Label>Project Name</Label>
                        <Input
                          required
                          name="projectCode"
                          value={formData?.projectCode || ""}
                          onChange={handleChange}
                        />
                        {errors && errors?.projectCode && (
                          <FormFeedback style={{ display: "block" }}>
                            {errors?.projectCode}
                          </FormFeedback>
                        )}
                      </>
                    </Col>
                  )}
                  {formData.allocationStatus === "Allocated" && (
                    <Col>
                      <>
                        <Label>Billability</Label>
                        <select
                          className="select_dropdown"
                          name="billability"
                          value={formData?.billability || ""}
                          onChange={handleChange}
                        >
                          <option value=""> Select </option>
                          <option key="Billable" value="Billable">
                            Billable
                          </option>
                          <option key="Non-Billable" value="Non-Billable">
                            Non-Billable
                          </option>
                          <option key="Non-Billable" value="Non-Billable">
                            Partial-Billable
                          </option>
                        </select>
                        {errors && errors?.billability && (
                          <FormFeedback style={{ display: "block" }}>
                            {errors?.billability}
                          </FormFeedback>
                        )}
                      </>
                    </Col>
                  )}
                  {formData.allocationStatus === "Allocated" && (
                    <Col>
                      <>
                        <Label>Billing Start Date</Label>
                        <Input
                          required
                          type="date"
                          name="billingStartDate"
                          value={formData?.billingStartDate ? formData.billingStartDate.split('T')[0] : ""}
                          onChange={handleChange}
                        />
                        {errors && errors?.billingStartDate && (
                          <FormFeedback style={{ display: "block" }}>
                            {errors?.billingStartDate}
                          </FormFeedback>
                        )}
                      </>
                    </Col>
                  )}
                </Row>
              )}
              {formData.allocationStatus === "Allocated" && (
                <Row className="mb-3">
                  <Col>
                    <>
                      <Label>Billing End Date</Label>
                      <Input
                        required
                        type="date"
                        name="billingEndDate"
                        value={formData?.billingEndDate ? formData.billingEndDate.split('T')[0] : ""}
                        onChange={handleChange}
                      />
                      {errors && errors?.billingEndDate && (
                        <FormFeedback style={{ display: "block" }}>
                          {errors?.billingEndDate}
                        </FormFeedback>
                      )}
                    </>
                  </Col>
  
                  {formData.allocationStatus === "Allocated" && (
                    <Col>
                      <>
                        <Label>Vendor Name</Label>
                        <select
                          className="select_dropdown"
                          name="vendorId"
                          value={formData?.vendorId || ""}
                          onChange={handleChange}
                        >
                          <option value="">Select</option>
  
                          {vendors?.map((vendor) => (
                            <option key={vendor?.VendorId} value={vendor?.VendorId}>
                              {vendor?.VendorName}
                            </option>
                          ))}
                        </select>
                        {errors && errors?.vendorId && (
                          <FormFeedback style={{ display: "block" }}>
                            {errors?.vendorId}
                          </FormFeedback>
                        )}
                      </>
                    </Col>
                  )}
                  {formData.allocationStatus === "Allocated" && (
                    <Col>
                      <>
                        <Label>SOW ID</Label>
                        <select
                          className="select_dropdown"
                          name="sowID"
                          value={formData?.sowID || ""}
                          onChange={(e) => {
                            handleChange(e);
                          }}
                        >
                          <option value="">Select</option>
                          {sowId.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                        {errors && errors?.sowID && (
                          <FormFeedback style={{ display: "block" }}>
                            {errors?.sowID}
                          </FormFeedback>
                        )}
                      </>
                    </Col>
                  )}
                  {formData.allocationStatus === "Allocated" && (
                    <Col>
                      <>
                        <Label>Client Email ID</Label>
                        <Input
                          required
                          name="clientEmailID"
                          value={formData?.clientEmailID || ""}
                          onChange={handleChange}
                        />
                        {errors && errors?.clientEmailID && (
                          <FormFeedback style={{ display: "block" }}>
                            {errors?.clientEmailID}
                          </FormFeedback>
                        )}
                      </>
                    </Col>
                  )}
                </Row>
              )}
              <Row >
                {formData.allocationStatus === "Allocated" && (
                  <Col>
                    <>
                      <Label>Partner Email ID</Label>
                      <Input
                        required
                        name="partnerEmailID"
                        value={formData?.partnerEmailID || ""}
                        onChange={handleChange}
                      />
                      {errors && errors?.partnerEmailID && (
                        <FormFeedback style={{ display: "block" }}>
                          {errors?.partnerEmailID}
                        </FormFeedback>
                      )}
                    </>
                  </Col>
                )}
                {formData.allocationStatus === "Allocated" && (
                  <Col xs="3">
                    <>
                      <Label>Client Timesheet Access</Label>
                      <Input
                        required
                        name="clientTimesheetAccess"
                        value={formData?.clientTimesheetAccess || ""}
                        onChange={handleChange}
                      />
                      {errors && errors?.clientTimesheetAccess && (
                        <FormFeedback style={{ display: "block" }}>
                          {errors?.clientTimesheetAccess}
                        </FormFeedback>
                      )}
                    </>
                  </Col>
                )}
                <Col xs="3" md="3">
                  <Label>Tech Group</Label>
                  {/* <Input
                    required
                    name="technologydivision"
                    value={formData?.technologydivision}
                    onChange={handleChange}
                  /> */}
                  <select name="technologydivision"
                    className='select_dropdown'
                    value={formData?.technologydivision || ""}
                    onChange={(e) => handleChange(e)}
                  >
                    <option value=''>Select</option>
                    {groups && groups.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  {errors && errors?.technologydivision && (
                    <FormFeedback style={{ display: "block" }}>
                      {errors?.technologydivision}
                    </FormFeedback>
                  )}
                </Col>
                <Col xs="3" md="3">
                  <Label>Skillset</Label>
                  <Input
                    required
                    name="skillset1"
                    value={formData?.skillset1 || ""}
                    onChange={handleChange}
                  />
                  {errors && errors?.skillset1 && (
                    <FormFeedback style={{ display: "block" }}>
                      {errors?.skillset1}
                    </FormFeedback>
                  )}
                </Col>
                <Col xs="3">
                  <Label>Experience (in Years)</Label>
                  <Input
                    type="number"
                    required
                    name="yearsofExp"
                    value={formData?.yearsofExp || ""}
                    onChange={handleChange}
                    style={{ width: "100%" }}
                  />
                  {errors && errors?.yearsofExp && (
                    <FormFeedback style={{ display: "block" }}>
                      {errors?.yearsofExp}
                    </FormFeedback>
                  )}
                </Col>
                <Col xs="3">
                  <Label>Status </Label>
                  <select
                    className="select_dropdown"
                    required
  
                    name="status"
                    value={formData?.status || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
  
                  {errors && errors?.status && (
                    <FormFeedback style={{ display: "block" }}>
                      {errors?.status}
                    </FormFeedback>
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
            <div className="container card project_container ">
              <span className="project_heading">RECENTLY ADDED</span>
              <div className="search-container">
                <div className="search-input">
                  <Input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    outline
                    className="searchbox"
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(0) }}
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
                    >Actions</th>
                    <th
                      style={{
                        backgroundColor: "#535BFF",
                        color: " #fff",
                        border: "none",
                      }}
                    >
                      Emp ID
                    </th>
                    <th
                      style={{
                        backgroundColor: "#535BFF",
                        color: " #fff",
                        border: "none",
                      }}
                    >
                      Emp Name
                    </th>
                    <th
                      style={{
                        backgroundColor: "#535BFF",
                        color: " #fff",
                        border: "none",
                      }}
                    >
                      Emp Role
                    </th>
                    <th
                      style={{
                        backgroundColor: "#535BFF",
                        color: " #fff",
                        border: "none",
                      }}
                    >
                      Emp Type
                    </th>
                    <th
                      style={{
                        backgroundColor: "#535BFF",
                        color: " #fff",
                        border: "none",
                      }}
                    >
                      DOJ
                    </th>
                    <th
                      style={{
                        backgroundColor: "#535BFF",
                        color: " #fff",
                        border: "none",
                      }}
                    >
                      Contact Number
                    </th>
                    <th
                      style={{
                        backgroundColor: "#535BFF",
                        color: " #fff",
                        border: "none",
                      }}
                    >
                      Gender
                    </th>
                    <th
                      style={{
                        backgroundColor: "#535BFF",
                        color: " #fff",
                        border: "none",
                      }}
                    >
                      Allocation Status
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
                      Project Name
                    </th>
                    <th
                      style={{
                        backgroundColor: "#535BFF",
                        color: " #fff",
                        border: "none",
                      }}
                    >
                      Billability
                    </th>
                    <th
                      style={{
                        backgroundColor: "#535BFF",
                        color: " #fff",
                        border: "none",
                      }}
                    >
                      Billing Start Date
                    </th>
                    <th
                      style={{
                        backgroundColor: "#535BFF",
                        color: " #fff",
                        border: "none",
                      }}
                    >
                      Billing End Date
                    </th>
                    <th
                      style={{
                        backgroundColor: "#535BFF",
                        color: " #fff",
                        border: "none",
                      }}
                    >
                      Vendor Name
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
                      Client Email ID
                    </th>
                    <th
                      style={{
                        backgroundColor: "#535BFF",
                        color: " #fff",
                        border: "none",
                      }}
                    >
                      Partner Email ID
                    </th>
                    <th
                      style={{
                        backgroundColor: "#535BFF",
                        color: " #fff",
                        border: "none",
                      }}
                    >
                      Client Timesheet Access
                    </th>
                    <th
                      style={{
                        backgroundColor: "#535BFF",
                        color: " #fff",
                        border: "none",
                      }}
                    >
                      Tech Group
                    </th>
                    <th
                      style={{
                        backgroundColor: "#535BFF",
                        color: " #fff",
                        border: "none",
                      }}
                    >
                      Skillset
                    </th>
                    <th
                      style={{
                        backgroundColor: "#535BFF",
                        color: " #fff",
                        border: "none",
                      }}
                    >
                      Experience (in Years)
                    </th>
                    <th
                      style={{
                        backgroundColor: "#535BFF",
                        color: " #fff",
                        border: "none",
                      }}
                    >
                      Status
                    </th>
  
                  </tr>
                </thead>
                <tbody>
                  {filtered
                    .slice(currentPage * pageSize, (currentPage + 1) * pageSize)
                    .map((item) => (
                      <tr key={item.id}>
                        <td>
                          <FontAwesomeIcon
                            icon={faEdit}
                            onClick={() => handleEdit(item)}
                          />
                        </td>
                        <td>{item.silId}</td>
                        <td>{item.name}</td>
                        <td>{item.role}</td>
                        <td>{item.employeeType}</td>
                        <td>{item.doj ? item.doj.split('T')[0] : ""}</td>
                        <td>{item.contactNumber}</td>
                        <td>{item.gender}</td>
                        <td>{item.allocationStatus}</td>
                        <td>{item.clientCode}</td>
                        <td>{item.projectCode}</td>
                        <td>{item.billability}</td>
                        <td>{item.billingStartDate ? item.billingStartDate.split('T')[0] : ""}</td>
                        <td>{item.billingEndDate ? item.billingEndDate.split('T')[0] : ""}</td>
                        <td>{item.vendorId}</td>
                        <td>{item.sowID}</td>
                        <td>{item.clientEmailID}</td>
                        <td>{item.partnerEmailID}</td>
                        <td>{item.clientTimesheetAccess}</td>
                        <td>{item.technologydivision}</td>
                        <td>{item.skillset1}</td>
                        <td>{item.yearsofExp}</td>
                        <td>{item.status}</td>
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
                  <div className="pagination-info" style={{ marginTop: "7%" }}>
                    {startIndex}-{endIndex} of {filtered.length}
                  </div>
                  <PaginationItem disabled={currentPage >= pageCount - 1}>
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
  