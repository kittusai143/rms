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
import Toast, { handleErrorToast, handleSuccessToast } from "./Toast";
import Pmo_Dashboard from "../../Api/Pmo_Dashboard.js";

import "../../CSS/PDO/Vendor.css";
import { getReq } from "../../Api/api";
export default function VendorPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [successToast, setSuccessToast] = useState(false);
  const [errorToast, setErrorToast] = useState(false);
  
  const [data, setData] = useState([]);
  const [errors, setErrors] = useState();
  const [vendorData, setVendorData] = useState({
    vendorName: "",
    vendorOnBoardingDate: "",
    vendorContact: "",
    vendorEmail: "",
    vendorType: "",
    vendorStatus: "Active",
  });
  const [edit, setEdit] = useState(false);
  const filtered=data
  ?.filter((item) =>
  item.vendorName?.toLowerCase().includes(searchTerm?.toLowerCase())||
  item.vendorType?.toLowerCase().includes(searchTerm?.toLowerCase())||
  item.vendorEmail?.toLowerCase().includes(searchTerm?.toLowerCase())||
  item.vendorContact?.toLowerCase().includes(searchTerm?.toLowerCase())||
  item.vendorOnBoardingDate?.toLowerCase().includes(searchTerm?.toLowerCase())||
  item.vendorStatus?.toLowerCase().includes(searchTerm?.toLowerCase())
  )
  
  const pageSize = 5;
  const pageCount = Math.ceil(filtered?.length / pageSize);
  const regemail = /^[a-zA-Z0-9+_.-]+@[a-z0-9]+\.[a-z]{2,3}$/;
  const regPhone = /^\+?(\d{1,3})?[-.\s]?(\(?\d{1,4}\)?)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
  // const regPhone = /^[1-9][0-9]{0,9}$/;

  useEffect(() => {
    Pmo_Dashboard.getAllVendor().then((res) => {
      setData(res.data);
    });
  }, []);
  const pages = [...Array(pageCount).keys()];

  const handlePageClick = (pageIndex) => {
    setCurrentPage(pageIndex);
  };
  const startIndex = currentPage * pageSize + 1;
  const endIndex = Math.min((currentPage + 1) * pageSize, filtered?.length);

  const handleSearch = () => {};

  const validateForm = () => {
    const errors = {};

    Object.keys(vendorData).forEach((field) => {
      const temp = vendorData[field] + "";
      if (!vendorData[field] || !temp.trim()) {
        errors[field] = `This field is required`;
      } else if (field == "vendorEmail") {
        if (!regemail.test(vendorData?.vendorEmail)) {
          errors[field] = "Enter a valid email address";
        }
      } else if (field == "vendorContact") {
        if (!regPhone.test(vendorData?.vendorContact)) {
          errors[field] = "Enter a valid contact number";
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
      Pmo_Dashboard.addVendor(vendorData).then((res) => {
        handleSuccessToast("Data added successfully");
        setVendorData({
          vendorName: "",
          vendorOnBoardingDate: "",
          vendorContact: "",
          vendorEmail: "",
          vendorType: "",
          vendorStatus: "Active",
        });
        // Pmo_Dashboard.getAllVendor().then((res) => {
        //   setData(res.data);
        // });
        getReq("http://localhost:8080/vendors/getAll").then((res)=>{
          console.log(res)
          setData(res.data);
        })
      });
    } else {
      Pmo_Dashboard.updateVendor(vendorData).then((res) => {
        handleSuccessToast("Data updated successfully");
        setVendorData({
          vendorName: "",
          vendorOnBoardingDate: "",
          vendorContact: "",
          vendorEmail: "",
          vendorType: "",
          vendorStatus: "",
        });
        Pmo_Dashboard.getAllVendor().then((res) => {
          setData(res.data);
        });
        setEdit(false);
      });
    }
  };
  const handleCancel = () => {
    setVendorData({
      vendorName: "",
      vendorOnBoardingDate: "",
      vendorContact: "",
      vendorEmail: "",
      vendorType: "",
      vendorStatus: "",
    });
    setErrors({});
    if (edit == true) setEdit(false);
  };
  const handleEdit = (item) => {
    setErrors({});
    setEdit(true);
    const temp=item
    delete temp.vendorId;
    delete temp.comment;
    delete temp.status;
    setVendorData({ ...temp });
  };
  return (
    <>
      <div class="container card ">
        <span className="vendor_heading">VENDOR DATA</span>

        <div class="row  mb-3">
          <div class="col-4">
            <Label>Vendor Name</Label>
            <Input
              type="text"
              value={vendorData?.vendorName||""}
              onChange={(e) => {
                setVendorData({
                  ...vendorData,
                  vendorName: e.target.value,
                });
                if (e.target.value) {
                  setErrors({ ...errors, vendorName: "" });
                }
              }}
            ></Input>
            {errors && (
              <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                {errors.vendorName}
              </div>
            )}
          </div>

          <div class="col-4">
            <Label>Vendor Type</Label>

            <select
              className="select_dropdown"
              value={vendorData?.vendorType||""}
              onChange={(e) => {
                setVendorData({
                  ...vendorData,
                  vendorType: e.target.value,
                });
                if (e.target.value) {
                  setErrors({ ...errors, vendorType: "" });
                }
              }}
            >
              <option value="Select">Select</option>
              <option value="Preferred">Preferred</option>
              <option value="Non-Preferred">Non-Preferred</option>
              <option value="Direct-Contract">Direct-Contract</option>
            </select>
            {errors && (
              <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                {errors.vendorType}
              </div>
            )}
          </div>
          <div class="col-4">
            <Label>Vendor Email</Label>
            <Input
              type="email"
              value={vendorData?.vendorEmail||""}
              onChange={(e) => {
                setVendorData({
                  ...vendorData,
                  vendorEmail: e.target.value,
                });
                if (e.target.value) {
                  setErrors({ ...errors, vendorEmail: "" });
                }
              }}
            ></Input>

            {errors && (
              <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                {errors.vendorEmail}
              </div>
            )}
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-4">
            <Label>Vendor Contact Number</Label>
            <Input
              type="tel"
              maxLength="16"
              pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
              value={vendorData?.vendorContact||""}
              onChange={(e) => {
                setVendorData({
                  ...vendorData,
                  vendorContact: e.target.value,
                });
                if (e.target.value) {
                  setErrors({ ...errors, vendorContact: "" });
                }
              }}
            ></Input>
            {errors && (
              <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                {errors.vendorContact}
              </div>
            )}
          </div>
          <div class="col-4">
            <Label>Vendor Onboarding Date</Label>
            <Input
              type="date"
              value={vendorData?.vendorOnBoardingDate||""}
              onChange={(e) => {
                setVendorData({
                  ...vendorData,
                  vendorOnBoardingDate: e.target.value,
                });
                if (e.target.value) {
                  setErrors({ ...errors, vendorOnBoardingDate: "" });
                }
              }}
            ></Input>
            {errors && (
              <div style={{ color: "#dc3545", fontSize: ".750em" }}>
                {errors.vendorOnBoardingDate}
              </div>
            )}
          </div>
          {edit === true ? (
            <div class="col-4">
              <Label>Vendor Status</Label>
              <select
                className="select_dropdown"
                value={vendorData?.vendorStatus||""}
                onChange={(e) => {
                  setVendorData({
                    ...vendorData,
                    vendorStatus: e.target.value,
                  });
                  if (e.target.value) {
                    setErrors({ ...errors, vendorStatus: "" });
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
                className="tabelHeadings"
              >
                Actions
              </th>
              <th
                style={{
                  backgroundColor: "#535BFF",
                  color: " #fff",
                  border: "none",
                }}
                className="tabelHeadings"
              >
                Vendor Name
              </th>
              <th
                style={{
                  backgroundColor: "#535BFF",
                  color: " #fff",
                  border: "none",
                }}
                className="tabelHeadings"
              >
                Vendor Type
              </th>
              <th
                style={{
                  backgroundColor: "#535BFF",
                  color: " #fff",
                  border: "none",
                }}
                className="tabelHeadings"
              >
                Vendor Email
              </th>
              <th
                style={{
                  backgroundColor: "#535BFF",
                  color: " #fff",
                  border: "none",
                }}
                className="tabelHeadings"
              >
                Vendor Contact Number
              </th>
              <th
                style={{
                  backgroundColor: "#535BFF",
                  color: " #fff",
                  border: "none",
                }}
                className="tabelHeadings"
              >
                Vendor Onboarding Date
              </th>
              <th
                style={{
                  backgroundColor: "#535BFF",
                  color: " #fff",
                  border: "none",
                }}
                className="tabelHeadings"
              >
               Vendor Status
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
                  <td>{item.vendorName}</td>
                  <td>{item.vendorType}</td>
                  <td>{item.vendorEmail}</td>
                  <td>{item.vendorContact}</td>
                  <td>{item.vendorOnBoardingDate}</td>

                  <td>{item.vendorStatus}</td>
                 
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
