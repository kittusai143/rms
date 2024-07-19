import React, { useEffect, useState } from "react";
import {
  Label,
  Input,
  Button,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faEdit } from "@fortawesome/free-solid-svg-icons";
import "../../CSS/PDO/ClientPage.css";
import PmoDashboard from "../../Api/Pmo_Dashboard.js";
import Toast, { handleErrorToast, handleSuccessToast } from "./Toast.js";

export default function ClientPage() {
  const [clientData, setClientData] = useState({
    clientName: "",
    partner: "",
    clientManager: "",
    clientContactNumber: "",
    clientEmail: "",
    clientOnboardDate: "",
    status: "Active",
  });

  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [edit, setEdit] = useState(false);
  const [data, setData] = useState([]);
  const filtered=data
  ?.filter((item) =>
  item.clientName?.toLowerCase().includes(searchTerm?.toLowerCase())||
  item.clientManager?.toLowerCase().includes(searchTerm?.toLowerCase())||
  item.clientEmail?.toLowerCase().includes(searchTerm?.toLowerCase())||
  item.clientContactNumber?.toLowerCase().includes(searchTerm?.toLowerCase())||
  item.clientOnboardDate?.toLowerCase().includes(searchTerm?.toLowerCase())||
  item.partner?.toLowerCase().includes(searchTerm?.toLowerCase())||
  item.status?.toLowerCase().includes(searchTerm?.toLowerCase())
  )
  const pageSize = 10; // Number of rows per page
  const pageCount = Math.ceil(filtered?.length / pageSize);
  const [successToast, setSuccessToast] = useState(false);
  const [errorToast, setErrorToast] = useState(false);
  const [errors, setErrors] = useState();
  
  const regemail = /^[a-zA-Z0-9+_.-]+@[a-z0-9]+\.[a-z]{2,3}$/;
  const regPhone = /^\+?(\d{1,3})?[-.\s]?(\(?\d{1,4}\)?)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
  const pages = [...Array(pageCount).keys()];
  const handleCancel = () => {
    setClientData({
      clientName: "",
      partner: "",
      clientManager: "",
      clientContactNumber: "",
      clientEmail: "",
      clientOnboardDate: "",
      status: "",
    });
    setErrors({});
    if (edit == true) setEdit(false);
  };
  const validateForm = () => {
    const errors = {};
    Object.keys(clientData).forEach((field) => {
      const temp = clientData[field] + "";
      if (!clientData[field] || !temp.trim()) {
        errors[field] = `This field is required`;
      } else if (field == "clientContactNumber") {
        if (!regPhone.test(clientData[field]))
          errors[field] = "Enter a valid contact number";
      } else if (field == "clientEmail") {
        if (!regemail.test(clientData[field]))
          errors[field] = "Enter a valid emailId";
      }
    });
    return errors;
  };
  const fetchData = () => {
    PmoDashboard.getAllClients().then((res) => setData(res.data));
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    PmoDashboard.getAllClients().then((result) => {
      setData(result.data);
    });
  }, []);

  const handlePageClick = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  const handleSearch = () => {};

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  
  const handleEdit = (item) => {
    setErrors({});
    setEdit(true);
    const temp=item
    delete temp.clientCode;
    delete temp.role;
    delete temp.clientShortName;
    delete temp.comment;
    setClientData({
      ...temp,
      clientOnboardDate: formatDate(item.clientOnboardDate),
    });
  };

  const handleSave = async (e) => {
    const validate = validateForm();
    if (Object.keys(validate).length > 0) {
      setErrors(validate);
      return;
    }

    if (edit == false) {
      PmoDashboard.addclient(clientData).then((res) => {
        handleSuccessToast("Data added successfully");
        setClientData({
          clientName: "",
          partner: "",
          clientManager: "",
          clientContactNumber: "",
          clientEmail: "",
          clientOnboardDate: "",
          status: "Active",
        });
        PmoDashboard.getAllClients().then((res) => {
          setData(res.data);
        });
      });
    } else {
      PmoDashboard.updateclient(clientData).then((res) => {
        handleSuccessToast("Data updated successfully");
        setClientData({
          clientName: "",
          partner: "",
          clientManager: "",
          clientContactNumber: "",
          clientEmail: "",
          clientOnboardDate: "",
          status: "",
        });
        PmoDashboard.getAllClients().then((res) => {
          setData(res.data);
        });
      });
      setEdit(false);
    }
  };

  const startIndex = currentPage * pageSize + 1;
  const endIndex = Math.min((currentPage + 1) * pageSize, filtered?.length);

  return (
    <>
      <div class="container card ">
        <span className="client_heading">CLIENT DATA</span>
        <div class="row  mb-3">
          <div class="col-4">
            <Label>Client Name</Label>
            <Input
              type="text"
              value={clientData?.clientName||""}
              onChange={(e) => {
                setClientData({
                  ...clientData,
                  clientName: e.target.value,
                });
                if (e.target.value) {
                  setErrors({ ...errors, clientName: "" });
                }
              }}
            ></Input>
            {errors && (
              <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                {errors.clientName}
              </div>
            )}
          </div>
          <div class="col-4">
            <Label>Client Manager</Label>
            <Input
              type="text"
              value={clientData?.clientManager||""}
              onChange={(e) => {
                setClientData({
                  ...clientData,
                  clientManager: e.target.value,
                });
                if (e.target.value) {
                  setErrors({ ...errors, clientManager: "" });
                }
              }}
            ></Input>
            {errors && (
              <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                {errors.clientManager}
              </div>
            )}
          </div>
          <div class="col-4">
            <Label>Client Email</Label>
            <Input
              type="text"
              value={clientData?.clientEmail||""}
              onChange={(e) => {
                setClientData({
                  ...clientData,
                  clientEmail: e.target.value,
                });
                if (e.target.value) {
                  setErrors({ ...errors, clientEmail: "" });
                }
              }}
            ></Input>
            {errors && (
              <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                {errors.clientEmail}
              </div>
            )}
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-4">
            <Label>Client Contact Number</Label>
            <Input
            maxLength="16"
              type="text"
              value={clientData?.clientContactNumber||""}
              onChange={(e) => {
                setClientData({
                  ...clientData,
                  clientContactNumber: e.target.value,
                });
                if (e.target.value) {
                  setErrors({ ...errors, clientContactNumber: "" });
                }
              }}
            ></Input>
            {errors && (
              <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                {errors.clientContactNumber}
              </div>
            )}
          </div>
          <div class="col-4">
            <Label>Client Onboarding Date</Label>
            <Input
              type="date"
              value={clientData?.clientOnboardDate||""}
              onChange={(e) => {
                setClientData({
                  ...clientData,
                  clientOnboardDate: e.target.value,
                });
                if (e.target.value) {
                  setErrors({ ...errors, clientOnboardDate: "" });
                }
              }}
            ></Input>
            {errors && (
              <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                {errors.clientOnboardDate}
              </div>
            )}
          </div>

          <div class="col-4">
            <Label>Partner Name</Label>
            <Input
              type="text"
              value={clientData?.partner||""}
              onChange={(e) => {
                setClientData({
                  ...clientData,
                  partner: e.target.value,
                });
                if (e.target.value) {
                  setErrors({ ...errors, partner: "" });
                }
              }}
            ></Input>
            {errors && (
              <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                {errors.partner}
              </div>
            )}
          </div>
        </div>
        <div class="row mb-3">
          {edit === true ? (
            <div class="col-4">
              <Label>Client Status</Label>

              <select
                className="select_dropdown"
                value={clientData?.status||""}
                onChange={(e) => {
                  setClientData({
                    ...clientData,
                    status: e.target.value,
                  });
                  if (e.target.value) {
                    setErrors({ ...errors, status: "" });
                  }
                }}
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
            </div>
          ) : null}
        </div>
        <div class="col-4 button_client" style={{ marginLeft: "67%" }}>
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
      </div>
      <div class="container card ">
        <span className="vendor_heading">RECENTLY ADDED</span>
        <div className="search-container">
          <div className="search-input">
            <Input
              type="text"
              placeholder="Search..."
              outline
              className="searchbox"
              value={searchTerm}
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
          <thead style={{ backgroundColor: "#E6E1C1", borderBottom: "none" }}>
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
                Client Name
              </th>
              <th
                style={{
                  backgroundColor: "#535BFF",
                  color: " #fff",
                  border: "none",
                }}
              >
                Client Manager
              </th>
              <th
                style={{
                  backgroundColor: "#535BFF",
                  color: " #fff",
                  border: "none",
                }}
              >
                Client Email
              </th>
              <th
                style={{
                  backgroundColor: "#535BFF",
                  color: " #fff",
                  border: "none",
                }}
              >
                Client Contact Number
              </th>
              <th
                style={{
                  backgroundColor: "#535BFF",
                  color: " #fff",
                  border: "none",
                }}
              >
                Client Onboarding Date
              </th>
              <th
                style={{
                  backgroundColor: "#535BFF",
                  color: " #fff",
                  border: "none",
                }}
              >
                Partner Name
              </th>
              <th
                style={{
                  backgroundColor: "#535BFF",
                  color: " #fff",
                  border: "none",
                }}
              >
                Client Status 
              </th>
              
            </tr>
          </thead>
          <tbody>
            {filtered?.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
              ?.map((item) => (
                <tr key={item.id}>
                   <td>
                    <FontAwesomeIcon
                      icon={faEdit}
                      onClick={() => handleEdit(item)}
                    />
                  </td>
                  <td>{item.clientName}</td>
                  <td>{item.clientManager}</td>
                  <td>{item.clientEmail}</td>
                  <td>{item.clientContactNumber}</td>
                  <td>{formatDate(item.clientOnboardDate)}</td>
                  <td>{item.partner}</td>
                  <td>
                    {" "}
                    <td>
                      <span>{item.status}</span>
                    </td>
                  </td>
                 
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
            <PaginationItem disabled={currentPage >= pages.length - 1}>
              <PaginationLink
                next
                onClick={() => handlePageClick(currentPage + 1)}
              />
            </PaginationItem>
          </Pagination>
        </div>
      </div>
      <Toast setSuccessToast={setSuccessToast} setErrorToast={setErrorToast} />
    </>
  );
}
