import React, { useState, useEffect } from "react";
import {
  Label,
  Input,
  Button,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink,
  FormFeedback,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faEdit } from "@fortawesome/free-solid-svg-icons";
import Toast, { handleErrorToast, handleSuccessToast } from "./Toast";
import "../../CSS/PDO/DomainPage.css";
import Pmo_Dashboard from "../../Api/Pmo_Dashboard.js";

export default function DomainPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const pageSize = 10;
  const [domainData, setDomainData] = useState([]);
  const [domainName, setDomainName] = useState("");
  const [domainId, setDomainId] = useState({});
  const [successToast, setSuccessToast] = useState(false);
  const [errorToast, setErrorToast] = useState(false);
  const [subDomain, setSubDomain] = useState("");
  const [other, setOther] = useState();
  const [otherSubDomain, setOtherSubDomain] = useState();
  const [edit, setEdit] = useState(false);
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const errors = {};
    Object.keys(domainData).forEach((field) => {
      const temp = "" + domainData[field];
      if (!domainName.trim()) {
        errors.domainName = "Domain Name is required";
      }
      if (!subDomain.trim()) {
        errors.subDomain = "Sub-Domain Name is required";
      }
    });
    return errors;
  }
  const filtered = domainData
    ?.filter((item) =>
      Object.values(item).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(searchTerm?.toLowerCase())
      )
    )

  const pageCount = Math.ceil(filtered?.length / pageSize);
  const pages = [...Array(pageCount).keys()];

  const handlePageClick = (pageIndex) => {
    setCurrentPage(pageIndex);
  };
  const startIndex = currentPage * pageSize + 1;
  const endIndex = Math.min((currentPage + 1) * pageSize, filtered?.length);

  const handleSearch = () => { };


  const handleSave = async (e) => {
    const validate = validateForm();
    if (Object.keys(validate)?.length > 0) {
      setErrors(validate);
      return
    }

    const data = {
      domainName: domainName === "Others" ? other : domainName,
      subDomainId: subDomain === "Others" ? otherSubDomain : subDomain,
    }

    if (edit == false) {
      console.log(domainData)
      Pmo_Dashboard.addDomain((data)).then((res) => {
        handleSuccessToast("Data added successfully");

        setDomainData([...domainData, data]);
        handleResetValue();
        Pmo_Dashboard.getAllDomains().then((res) => {
          setDomainData(res.data);
        });
      });
    } else {
      const data = {
        domainId: domainId,
        domainName: domainName === "Others" ? other : domainName,
        subDomainId: subDomain === "Others" ? otherSubDomain : subDomain,
      }
      Pmo_Dashboard.updateDomain(data).then(() => {
        handleSuccessToast("Data updated successfully");

        Pmo_Dashboard.getAllDomains().then((res) => setDomainData(res.data));
        handleResetValue();
        setEdit(false);
      });

    }
  }

  const [domain, setDomain] = useState([]);
  useEffect(() => {
    Pmo_Dashboard.getDistinct().then((res) => {
      setDomain(res.data);
    });
  }, []);

  const [subDomainData, setSubDomainData] = useState([]);

  const handleDomainName = (e) => {
    setDomainName(e.target.value);
    const domain = e.target.value;
    if (domain !== "Others") {
      Pmo_Dashboard.getSUbdomains(domain).then((res) => {
        setSubDomainData(res.data);
      });
    } else {
      setSubDomainData([]);
    }

  };

  const handleEditData = (data) => {
    setEdit(true)
    setDomainId(data.domainId);
    setErrors({});
    setDomainId(data.domainId);
    setDomainName(data.domainName);
    Pmo_Dashboard.getSUbdomains(data.domainName).then((res) => {
      setSubDomainData(res.data);
      setSubDomain(data.subDomainId);
    });
    setEdit(true);
  };

  const handleResetValue = () => {
    setDomainId(null);
    setDomainName("");
    setSubDomain("");
    setOther("");
    setOtherSubDomain("");
    setErrors({});
    if (edit == true) setEdit(false);
  };

  useEffect(() => {
    Pmo_Dashboard.getAllDomains().then((res) => setDomainData(res.data));
  }, []);
  return (
    <>
      <div class="container card ">
        <span className="tech_heading">DOMAIN DATA</span>
        <div class="row  mb-3">
          <div class="col-3">
            <Label>Domain Name </Label>
            <select
              className="select_dropdown"
              value={domainName||""}
              onChange={(e) => handleDomainName(e)}
            >
              <option value="">Select</option>
              {domain?.map((d, key) => (
                <option value={d}>{d}</option>
              ))}
              <option value="Others">Others</option>
            </select>
            {errors && errors?.domainName && (
              <FormFeedback style={{ display: "block" }}>
                {errors?.domainName}
              </FormFeedback>
            )}
          </div>
          {domainName === 'Others' ? (
            <div className="col-3">
              <Label>Custom Domain Name</Label>
              <Input type='text' onChange={(e) => setOther(e.target.value)} />
            </div>
          ) : null}
          <div class="col-3">
            <Label>Sub-Domain Name </Label>
            <select
              className="select_dropdown"
              value={subDomain||""}
              onChange={(e) => setSubDomain(e.target.value)}
            >
              <option value="">Select</option>
              {subDomainData?.map((d, key) => (
                <option value={d}>{d}</option>
              ))}
              <option value="Others">Others</option>
            </select>
            {errors && errors?.subDomain && (
              <FormFeedback style={{ display: "block" }}>
                {errors?.subDomain}
              </FormFeedback>
            )}
          </div>
          {subDomain === "Others" ? (
            <div className="col-3">
              <Label>Custom Sub-Domain Name</Label>
              <Input type="text" onChange={((e) => setOtherSubDomain(e.target.value))}></Input>
            </div>
          ) : null}

        </div>
        <div class="col-3" className="tech_buttons" style={{ marginLeft: "80%" }}>
          {edit ? <Button
            style={{
              backgroundColor: "#535BFF",
              color: " #fff",
              border: "none",
            }}
            className="save_btn"
            color="success"
            onClick={handleSave}
          >
            Update
          </Button> : <Button
            style={{
              backgroundColor: "#535BFF",
              color: " #fff",
              border: "none",
            }}
            className="save_btn"
            color="success"
            onClick={handleSave}
          >
            Save
          </Button>}
          <Button
            className="tech_cancel_btn"
            color="light"
            onClick={handleResetValue}
          >
            Cancel
          </Button>
        </div>
      </div>
      <div
        class="container card "
        style={{ paddingRight: "20px", paddingLeft: "20px", paddingTop: "60px" }}
      >
        <span className="tech_heading">RECENTLY ADDED</span>
        <div className="tech_search-container">
          <div className="tech_search-input">
            <Input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              outline
              className="tech_searchbox"
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(0) }}
            />
            <FontAwesomeIcon icon={faSearch} className="tech_search-icon" />
          </div>
          <div
            className="tech_search-button"
            style={{ marginLeft: "20px", marginRight: "20px" }}
          >
            <Button outline onClick={handleSearch}>
              Search
            </Button>
          </div>
        </div>
        <Table
          striped
          bordered
          className="tech_tabel_content"
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
                Domain Name
              </th>
              <th
                style={{
                  backgroundColor: "#535BFF",
                  color: " #fff",
                  border: "none",
                }}
              >
                Sub-Domain Name
              </th>

            </tr>
          </thead>
          <tbody>
            {filtered
              ?.slice(currentPage * pageSize, (currentPage + 1) * pageSize)?.map((item, index) => (
                <tr key={index}>
                  <td>
                    <FontAwesomeIcon
                      icon={faEdit}
                      onClick={() => handleEditData(item)}
                    />
                  </td>
                  <td>{item.domainName}</td>
                  <td>{item.subDomainId}</td>

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
            <PaginationItem disabled={currentPage >= pages?.length - 1}>
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
