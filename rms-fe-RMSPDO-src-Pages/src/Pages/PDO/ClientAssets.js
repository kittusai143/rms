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
import "../../CSS/PDO/ClientAssets.css";
import Toast, { handleSuccessToast } from "./Toast.js";
import Pmo_Dashboard from "../../Api/Pmo_Dashboard.js";
import Select from "react-select";
export default function ClientAssets() {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [clientAssets, setClientAssets] = useState({
    clientName:"",
    assetType: "",
    assetId: "",
    model: "",
    assignedEmpId: "",
    empName: "",
    dateOfIssue: "",
    dateOfReturn: "",
    comments: "",
  });
  const [clients, setClients] = useState([]);
  const [data, setData] = useState([]);
  const [edit, setEdit] = useState(false);
  const [emp, setEmp] = useState([]);
  const [successToast, setSuccessToast] = useState(false);
  const [errorToast, setErrorToast] = useState(false);
  const [errors, setErrors] = useState({});
  const pageSize = 10;
  const filtered=data
  ?.filter((item) =>
  item.clientName?.toLowerCase().includes(searchTerm?.toLowerCase())||
  item.assetType?.toLowerCase().includes(searchTerm?.toLowerCase())||
  item.assetId?.toLowerCase().includes(searchTerm?.toLowerCase())||
  item.model?.toLowerCase().includes(searchTerm?.toLowerCase())||
  item.assignedEmpId?.toLowerCase().includes(searchTerm?.toLowerCase())||
  item.empName?.toLowerCase().includes(searchTerm?.toLowerCase())||
  item.dateOfIssue?.toLowerCase().includes(searchTerm?.toLowerCase())||
  item.dateOfReturn?.toLowerCase().includes(searchTerm?.toLowerCase())||
  item.comments?.toLowerCase().includes(searchTerm?.toLowerCase())
  )
  const pageCount = Math.ceil(filtered?.length / pageSize);
  useEffect(() => {
    Pmo_Dashboard.getAllClientIds().then((res) => {
      setClients(res.data);
    });
    Pmo_Dashboard.getEmployeeId().then((res) => {
      setEmp(res.data);
    });
  }, []);
  
  const pages = [...Array(pageCount).keys()];

  
  const validateForm = () => {
    const errors = {};
    Object.keys(clientAssets).forEach((field) => {
      const temp = clientAssets[field] + ""
      if (!clientAssets[field] || !temp.trim()) {
        errors[field] = "This field is required";
      } else if (field === "dateOfIssue") {
        if (
          new Date(clientAssets.dateOfReturn) <=
          new Date(clientAssets.dateOfIssue)
        ) {
          errors[field] = "Date of return should be later than date of issue";
        }
      }
    });

    return errors;
  };
  const handleCancel = () => {
    setClientAssets({
     clientName:"",
      assetType: "",
      assetId: "",
      model: "",
      assignedEmpId: "",
      empName: "",
      dateOfIssue: "",
      dateOfReturn: "",
      comments: "",
    });
    setErrors({});
    if (edit == true) setEdit(false);
  };
  const handleSave = async (e) => {
    const validate = validateForm();
    if (Object.keys(validate).length > 0) {
      setErrors(validate);
      return;
    }
    if (edit == false) {
      Pmo_Dashboard.addClientAsset(clientAssets).then((res) => {
        handleSuccessToast("Data added successfully");
        setClientAssets({
          clientName: "",
          assetType: "",
          assetId: "",
          model: "",
          assignedEmpId: "",
          empName: "",
          dateOfIssue: "",
          dateOfReturn: "",
          comments: "",
        });
        Pmo_Dashboard.getAllClientsAssets().then((res) => {
          setData(res.data);
        });
      });
    } else {
      Pmo_Dashboard.updateClientAsset(clientAssets).then((res) => {
        handleSuccessToast("Data updated successfully");

        setClientAssets({
          clientName: "",
          assetType: "",
          assetId: "",
          model: "",
          assignedEmpId: "",
          empName: "",
          dateOfIssue: "",
          dateOfReturn: "",
          comments: "",
        });
        Pmo_Dashboard.getAllClientsAssets().then((res) => {
          setData(res.data);
        });
      });
      setEdit(false);
    }
  };

  useEffect(() => {
    Pmo_Dashboard.getAllClientsAssets().then((result) => {
      setData(result.data);
    });
  }, []);

  const handlePageClick = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  const handleSearch = () => {};
  const handleEdit = (item) => {
    setErrors({});
    setEdit(true);
    const temp=item
    delete temp.clientId
    delete temp.status
    delete temp.partner
    delete temp.clientShortName
    delete temp.clientOnboardDate
    delete temp.accountName
    delete temp.clientManager
    delete temp.clientEmail
    delete temp.clientContactNumber
    delete temp.clientCode
    setClientAssets({ ...temp });
  };
  const startIndex = currentPage * pageSize + 1;
  const endIndex = Math.min((currentPage + 1) * pageSize, filtered?.length);

  return (
    <>
      <div class="container card ">
        <span className="client_heading">CLIENT ASSETS</span>
        <div class="row  mb-3">
          <div className="col-3">
            <Label>Client Name</Label>
            <select
              className="select_dropdown"
              value={clientAssets?.clientName||""}
              onChange={(e) => {
                setClientAssets({
                  ...clientAssets,
                  clientName: e.target.value,
                });
                if (e.target.value) {
                  setErrors({ ...errors, clientName: "" });
                }
              }}
            >
              <option value="">Select</option>
              {clients?.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            {errors.clientName && (
              <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                {errors.clientName}
              </div>
            )}
          </div>

          <div class="col-3">
            <Label>Asset Type</Label>
            <Input
              type="text"
              value={clientAssets?.assetType||""}
              onChange={(e) => {
                setClientAssets({
                  ...clientAssets,
                  assetType: e.target.value,
                });
                if (e.target.value) {
                  setErrors({ ...errors, assetType: "" });
                }
              }}
            ></Input>
            {errors && (
              <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                {errors.assetType}
              </div>
            )}
          </div>
          <div class="col-3">
            <Label>Asset ID</Label>
            <Input
              type="text"
              value={clientAssets?.assetId||""}
              onChange={(e) => {
                setClientAssets({
                  ...clientAssets,
                  assetId: e.target.value,
                });
                if (e.target.value) {
                  setErrors({ ...errors, assetId: "" });
                }
              }}
            ></Input>
            {errors && (
              <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                {errors.assetId}
              </div>
            )}
          </div>
          <div class="col-3">
            <Label>Model</Label>
            <Input
              type="text"
              value={clientAssets?.model||""}
              onChange={(e) => {
                setClientAssets({
                  ...clientAssets,
                  model: e.target.value,
                });
                if (e.target.value) {
                  setErrors({ ...errors, model: "" });
                }
              }}
            ></Input>
            {errors && (
              <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                {errors.model}
              </div>
            )}
          </div>
          <div class="col-3">
            <Label>Assigned to Emp ID</Label>

            <Select
              value={{
                value: clientAssets?.assignedEmpId,
                label: clientAssets?.assignedEmpId,
              }}
              options={emp?.map((item) => ({ value: item, label: item }))}
              // value = {clientAssets?.assignedEmpId}
              onChange={(selectedOption) => {
                setClientAssets({
                  ...clientAssets,
                  assignedEmpId: selectedOption.value,
                });
                Pmo_Dashboard.getbyEmployeeID(selectedOption.value).then((res) => {
                  setClientAssets(prevData => ({
                    ...prevData,
                    empName: res.data.userFullName,
                  }));
                });
              }}
              defaultValue={{
                value: clientAssets.assignedEmpId,
                label: clientAssets.assignedEmpId,
              }}
              label="Single select"
            />
            {errors && (
              <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                {errors.assignedEmpId}
              </div>
            )}
          </div>
          <div class="col-3">
            <Label>Emp Name</Label>
            <Input
            disabled
              type="text"
              value={clientAssets?.empName||""}
              onChange={(e) => {
                setClientAssets({
                  ...clientAssets,
                  empName: e.target.value,
                });
                if (e.target.value) {
                  setErrors({ ...errors, empName: "" });
                }
              }}
            ></Input>
            {errors && (
              <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                {errors.empName}
              </div>
            )}
          </div>
          <div class="col-3">
            <Label>Date of Issue</Label>
            <Input
              type="date"
              value={clientAssets?.dateOfIssue||""}
              onChange={(e) => {
                setClientAssets({
                  ...clientAssets,
                  dateOfIssue: e.target.value,
                });
                if (e.target.value) {
                  setErrors({ ...errors, dateOfIssue: "" });
                }
              }}
            ></Input>
            {errors && (
              <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                {errors.dateOfIssue}
              </div>
            )}
          </div>
          <div class="col-3">
            <Label>Date of Return</Label>
            <Input
              type="date"
              value={clientAssets?.dateOfReturn||""}
              onChange={(e) => {
                setClientAssets({
                  ...clientAssets,
                  dateOfReturn: e.target.value,
                });
                if (e.target.value) {
                  setErrors({ ...errors, dateOfReturn: "" });
                }
              }}
            ></Input>
            {errors && (
              <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                {errors.dateOfReturn}
              </div>
            )}
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-3">
            <Label>Comments</Label>
            <Input
              type="textarea"
              value={clientAssets?.comments||""}
              onChange={(e) => {
                setClientAssets({
                  ...clientAssets,
                  comments: e.target.value,
                });
                if (e.target.value) {
                  setErrors({ ...errors, comments: "" });
                }
              }}
            ></Input>
            {errors && (
              <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                {errors.comments}
              </div>
            )}
          </div>
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
                Asset Type
              </th>
              <th
                style={{
                  backgroundColor: "#535BFF",
                  color: " #fff",
                  border: "none",
                }}
              >
                Asset ID
              </th>
              <th
                style={{
                  backgroundColor: "#535BFF",
                  color: " #fff",
                  border: "none",
                }}
              >
                Model
              </th>
              <th
                style={{
                  backgroundColor: "#535BFF",
                  color: " #fff",
                  border: "none",
                }}
              >
                Assigned to Emp ID
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
                Date of Issue
              </th>
              <th
                style={{
                  backgroundColor: "#535BFF",
                  color: " #fff",
                  border: "none",
                }}
              >
                Date of Return
              </th>
              <th
                style={{
                  backgroundColor: "#535BFF",
                  color: " #fff",
                  border: "none",
                }}
              >
                Comments
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
                  <td>{item.assetType}</td>
                  <td>{item.assetId}</td>
                  <td>{item.model}</td>
                  <td>{item.assignedEmpId}</td>
                  <td>{item.empName}</td>
                  <td>{item.dateOfIssue}</td>
                  <td>{item.dateOfReturn}</td>
                  <td>{item.comments}</td>

                  
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
