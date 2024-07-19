import React, { useState, useEffect } from "react";
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
import "../../CSS/PDO/SowMaster.css";
import Toast, { handleSuccessToast } from "./Toast.js";
import Pmo_Dashboard from "../../Api/Pmo_Dashboard.js";

export default function SOWMaster() {
  const [sowData, setSowData] = useState({
    sowStartDate: "",
    sowEndDate: "",
    sowId: "",
    clientCode: "",
  });
  
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const filtered=data
  ?.filter((item) =>
  item.sowId?.toLowerCase().includes(searchTerm?.toLowerCase())||
  item.sowStartDate?.toLowerCase().includes(searchTerm?.toLowerCase())||
  item.sowEndDate?.toLowerCase().includes(searchTerm?.toLowerCase())||
  item.clientCode?.toLowerCase().includes(searchTerm?.toLowerCase())
  )
  
  const [edit, setEdit] = useState(false);
  const [successToast, setSuccessToast] = useState(false);
  const [errorToast, setErrorToast] = useState(false);
  const [errors, setErrors] = useState();
  const pageSize = 5;
  const pageCount = Math.ceil(filtered?.length / pageSize);
  const pages = [...Array(pageCount).keys()];
  const validateForm = () => {
    const errors = {};
    Object.keys(sowData).forEach((field) => {
      const temp = sowData[field] + "";
      if (!sowData[field] || !temp.trim()) {
        errors[field] = `This field is required`;
      } else if (field == "sowEndDate") {
        if (sowData?.sowEndDate <= sowData?.sowStartDate) {
          errors[field] = "End date should be later than Start date";
        }
      }
    });
    return errors;
  };

  useEffect(() => {
    Pmo_Dashboard.getAllSows().then((result) => {
      setData(result.data);
    });
  }, []);
  const handlePageClick = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  const handleSearch = () => {};
  const handleSave = async (e) => {
    const validate = validateForm();
    if (Object.keys(validate).length > 0) {
      setErrors(validate);
      return;
    }

    if (edit == false) {
      Pmo_Dashboard.addsow(sowData).then((res) => {
        handleSuccessToast("Data added successfully");

        setSowData({
          sowStartDate: "",
          sowEndDate: "",
          sowId: "",
          clientCode: "",
        });
        Pmo_Dashboard.getAllSows().then((res) => {
          setData(res.data);
        });
      });
    } else {
      Pmo_Dashboard.updateSow(sowData).then((res) => {
        handleSuccessToast("Data updated successfully");
        setSowData({
          sowStartDate: "",
          sowEndDate: "",
          sowId: "",
          clientCode: "",
        });
        Pmo_Dashboard.getAllSows().then((res) => {
          setData(res.data);
        });
      });
      setEdit(false);
    }
  };
  const handleEdit = (item) => {
    setErrors({});
    setEdit(true);
    setSowData({ ...item });
  };
  const handleCancel = () => {
    setSowData({
      sowStartDate: "",
      sowEndDate: "",
      sowId: "",
      clientCode: "",
    });
    setErrors({});
    if (edit == true) setEdit(false);
  };
  const [clientData, setClientData] = useState([]);

  const startIndex = currentPage * pageSize + 1;
  const endIndex = Math.min((currentPage + 1) * pageSize, filtered?.length);
  useEffect(() => {
    Pmo_Dashboard.getAllClientIds().then((res) => {
      setClientData(res.data);
    });
  }, []);

  return (
    <>
      <div class="container card ">
        <span className="Sow_heading">SOW DATA</span>
        <div class="row  mb-3">
          <div class="col-4">
            <Label>SOW ID</Label>
            <Input
              type="text"
              onChange={(e) => {
                setSowData({
                  ...sowData,
                  sowId: e.target.value,
                });
                if (!e.target.value) {
                  setErrors({ ...errors, sowId: `This field is required` });
                } else {
                  setErrors({ ...errors, sowId: "" });
                }
              }}
              value={sowData?.sowId || ""}
            ></Input>
            {errors && (
              <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                {errors.sowId}
              </div>
            )}
          </div>
          <div class="col-4">
            <Label>SOW Start Date</Label>
            <Input
              type="date"
              onChange={(e) => {
                setSowData({
                  ...sowData,
                  sowStartDate: e.target.value,
                });
                if (!e.target.value) {
                  setErrors({
                    ...errors,
                    sowStartDate: `This field is required`,
                  });
                } else {
                  setErrors({ ...errors, sowStartDate: "" });
                }
              }}
              value={sowData?.sowStartDate || ""}
            ></Input>
            {errors && (
              <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                {errors.sowStartDate}
              </div>
            )}
          </div>
          <div class="col-4">
            <Label>SOW End Date</Label>
            <Input
              type="date"
              onChange={(e) => {
                setSowData({
                  ...sowData,
                  sowEndDate: e.target.value,
                });
                if (!e.target.value) {
                  setErrors({
                    ...errors,
                    sowEndDate: `This field is required`,
                  });
                } else {
                  setErrors({ ...errors, sowEndDate: "" });
                }
              }}
              value={sowData?.sowEndDate || ""}
            ></Input>
            {errors && (
              <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                {errors.sowEndDate}
              </div>
            )}
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-4">
            <Label>Client Name</Label>
            <select
              className="select_dropdown"
              value={sowData?.clientCode||" "}
              onChange={(e) => {
                setSowData({
                  ...sowData,
                  clientCode: e.target.value,
                });
                if (!e.target.value) {
                  setErrors({
                    ...errors,
                    clientCode: `This field is required`,
                  });
                } else {
                  setErrors({ ...errors, clientCode: "" });
                }
              }}
            >
              <option value="">Select</option>
              {clientData?.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
            {errors && (
              <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                {errors.clientCode}
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
                {" "}
                SOW ID
              </th>
              <th
                style={{
                  backgroundColor: "#535BFF",
                  color: " #fff",
                  border: "none",
                }}
              >
                SOW Start Date
              </th>
              <th
                style={{
                  backgroundColor: "#535BFF",
                  color: " #fff",
                  border: "none",
                }}
              >
                SOW End Date
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
             
            </tr>
          </thead>
          <tbody>
            {filtered
              ?.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
              ?.map((item) => (
                <tr key={item.id}>
                   <td>
                    <FontAwesomeIcon
                      className="Hover"
                      icon={faEdit}
                      onClick={() => handleEdit(item)}
                    />
                  </td>
                  <td>{item.sowId}</td>
                  <td>{item.sowStartDate}</td>
                  <td>{item.sowEndDate}</td>
                  <td>{item.clientCode}</td>
                 
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
              {startIndex}-{endIndex} of {filtered.length}
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
