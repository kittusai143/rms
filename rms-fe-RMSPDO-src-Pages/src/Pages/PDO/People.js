import React, { useEffect, useState } from 'react'
import { Nav, Navbar, Pagination, PaginationItem, PaginationLink, Table, NavItem, NavLink, Label } from 'reactstrap'
import Pmo_Dashboard from "../../Api/Pmo_Dashboard.js";

import "../../CSS/PDO/Dashboard.css";

export default function People() {
    const [data, setData] = useState([])
    const [availableResource, setAvailableResource] = useState([])
    const [projectData, setProjectData] = useState([])
    const [searchTerm, setSearchTerm] = useState("");
    const pageSize = 5;
    const pageCount = Math.ceil(data.length / pageSize);
  const pages = [...Array(pageCount).keys()];
  const [currentPage, setCurrentPage] = useState(0);
  const [currentPages, setCurrentPages] = useState(0);
  const handlePageClick = (pageIndex) => {
    setCurrentPage(pageIndex);
  };
  const handleNextPageClick = (pageIndex) => {
    setCurrentPages(pageIndex);
  }

  //Project Resource
  const startIndex = currentPage * pageSize + 1;
  const endIndex = Math.min((currentPage + 1) * pageSize, data.length);
  //Bench Resource
  const startIndexx = currentPages * pageSize + 1;
  const endIndexx  = Math.min((currentPages + 1) * pageSize, availableResource.length);
  //Project End Resource
  const projectStartIndex = currentPage * pageSize + 1;
  const projectEndIndex = Math.min((currentPage + 1) * pageSize, projectData.length);

  useEffect(() => {
    Pmo_Dashboard.getAllocatedResources().then((res) => {
      setData(res.data);
    })
    Pmo_Dashboard.getAvailableResources().then((res) => {
      setAvailableResource(res.data);
    })
  },[])
  return (
      <>
    
    <br />
    <div>
    <h2 style = {{fontWeight : '600', fontSize : '20px'}}>Projects</h2>
    <br />
        <Table bordered className="tabel_content" hover responsive size="" style = {{border : '1px solid #0000001A'}}>
          <thead style={{ backgroundColor: "#F6F6F6", borderBottom: "none", border : '1px solid white' }}>
            <tr>
              <th className="tabelHeadings">Name</th>
              <th className="tabelHeadings">Client</th>
              <th className="tabelHeadings">Project</th>
              <th className="tabelHeadings">StartDate</th>
              <th className="tabelHeadings">EndDate</th>
              <th className="tabelHeadings">Skills</th>
              <th className="tabelHeadings">ProjectManager</th>
            </tr>
          </thead>
          <tbody style = {{border : '1px solid white'}}>
            {data
              .filter((item) =>
                Object.values(item).some(
                  (value) =>
                    typeof value === "string" &&
                    value.toLowerCase().includes(searchTerm.toLowerCase())
                )
              )
              .slice(currentPage * pageSize, (currentPage + 1) * pageSize)
              .map((item) => (
                <tr key={item.Name}>
                <td>{item.name}</td>
                  <td>{item.clientCode}</td>
                  <td>{item.projectCode}</td>
                  <td>{item.billingStartDate}</td>
                  <td>{item.billingEndDate}</td>
                  <td>{item.skillset1 + "," + item.skillset2}</td>
                  <td>{item.ProjectManager}</td>
                 
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
              {startIndex}-{endIndex} of {data.length}
            </div>
            <PaginationItem disabled={currentPage >= pages.length - 1}>
              <PaginationLink
                next
                onClick={() => handlePageClick(currentPage + 1)}
              />
            </PaginationItem>
          </Pagination>
        </div>
        <h2 style = {{fontWeight : '600', fontSize : '20px'}}>On-Bench</h2>
    <br />
        <Table bordered className="tabel_content" hover responsive size="" style = {{border : '1px solid #0000001A'}}>
          <thead style={{ backgroundColor: "#F6F6F6", borderBottom: "none", border : '1px solid white' }}>
            <tr>
              <th className="tabelHeadings">Name</th>
              <th className="tabelHeadings">Client</th>
              <th className="tabelHeadings">Project</th>
              <th className="tabelHeadings">StartDate</th>
              <th className="tabelHeadings">EndDate</th>
              <th className="tabelHeadings">Skills</th>
              <th className="tabelHeadings">ProjectManager</th>
            </tr>
          </thead>
          <tbody style = {{border : '1px solid white'}}>
            {availableResource
              .filter((item) =>
                Object.values(item).some(
                  (value) =>
                    typeof value === "string" &&
                    value.toLowerCase().includes(searchTerm.toLowerCase())
                )
              )
              .slice(currentPages * pageSize, (currentPages + 1) * pageSize)
              .map((item) => (
                <tr key={item.Name}>
                <td>{item.name}</td>
                  <td>{item.clientCode}</td>
                  <td>{item.projectCode}</td>
                  <td>{item.billingStartDate}</td>
                  <td>{item.billingEndDate}</td>
                  <td>{item.skillset1 + "," + item.skillset2}</td>
                  <td>{item.ProjectManager}</td>
                 
                </tr>
              ))}
          </tbody>
        </Table>
        <div className="pagination-container">
          <Pagination>
            <PaginationItem disabled={currentPages <= 0}>
              <PaginationLink
                previous
                onClick={() => handleNextPageClick(currentPages - 1)}
              />
            </PaginationItem>
            <div className="pagination-info">
              {startIndexx}-{endIndexx} of {availableResource.length}
            </div>
            <PaginationItem disabled={currentPages >= pages.length - 1}>
              <PaginationLink
                next
                onClick={() => handleNextPageClick(currentPages + 1)}
              />
            </PaginationItem>
          </Pagination>
        </div>
        <h2 style = {{fontWeight : '600', fontSize : '20px'}}>Nearing to  Project End</h2>
    <br />
        <Table bordered className="tabel_content" hover responsive size="" style = {{border : '1px solid #0000001A'}}>
          <thead style={{ backgroundColor: "#F6F6F6", borderBottom: "none", border : '1px solid white' }}>
            <tr>
              <th className="tabelHeadings">Name</th>
              <th className="tabelHeadings">Client</th>
              <th className="tabelHeadings">Project</th>
              <th className="tabelHeadings">StartDate</th>
              <th className="tabelHeadings">EndDate</th>
              <th className="tabelHeadings">Skills</th>
              <th className="tabelHeadings">ProjectManager</th>
            </tr>
          </thead>
          <tbody style = {{border : '1px solid white'}}>
           
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
              {projectStartIndex}-{projectEndIndex} of {projectData.length}
            </div>
            <PaginationItem disabled={currentPage >= pages.length - 1}>
              <PaginationLink
                next
                onClick={() => handlePageClick(currentPage + 1)}
              />
            </PaginationItem>
          </Pagination>
        </div>
        <br />
        <h2 style = {{fontWeight : '600', fontSize : '20px'}}>Trainees</h2>
        <Table bordered className="tabel_content" hover responsive size="" style = {{border : '1px solid #0000001A'}}>
          <thead style={{ backgroundColor: "#F6F6F6", borderBottom: "none", border : '1px solid white' }}>
            <tr>
              <th className="tabelHeadings">SIL ID</th>
              <th className="tabelHeadings">Name</th>
              <th className="tabelHeadings">DOJ</th>
              <th className="tabelHeadings">Contact Number</th>
              <th className="tabelHeadings">Project Name</th>
              <th className="tabelHeadings">Skillset1</th>
              <th className="tabelHeadings">Skillset2</th>
            </tr>
          </thead>
          <tbody style = {{border : '1px solid white'}}>
          <tr>
                 <td>SIL-0749</td>
                 <td>Nizam Khan</td>
                 <td>01-09-2021</td>
                 <td>9182136019</td>
                 <td>PDS</td>
                 <td>React JS</td>
                 <td>Java</td>
               </tr>
               <tr>
                 <td>SIL-0749</td>
                 <td>Nizam Khan</td>
                 <td>01-09-2021</td>
                 <td>9182136019</td>
                 <td>PDS</td>
                 <td>React JS</td>
                 <td>Java</td>
               </tr>
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
              {projectStartIndex}-{projectEndIndex} of {projectData.length}
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
    </>
  )
}
