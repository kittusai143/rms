import React from "react";
import {
  Container,
  Table,
  Row,
  Col,
  Card,
  CardBody,
} from "reactstrap";
import { IoArrowBackOutline } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';

import { useSelector } from "react-redux";
import { Button } from "rsuite";
const Profile = () => {
   
let select=useSelector(state=>state?.login?.tasks)
// console.log(select[0],select)
let data=select[0]
let navigate=useNavigate()

  return (
    <div id="base">
      <Container>
        <Row className="mt-3">
          <Col md={6} className="mb-3"> <Button onClick={()=>{
             if(select[0].empRoleName==="PMO Analyst")
             navigate('/pmologinview')
           else if(select[0].empRoleName==="Resource Manager"){
             navigate('/rmloginview')
           }
           else{
             navigate('/resource')
           }
          }}><IoArrowBackOutline /></Button></Col>
        </Row>
        <div style={{ backgroundColor: "#004e89", borderRadius:'10px' }} className="pt-4 mb-4 mb-lg-3 pb-lg-4">
                        <Row className="g-4">
                       
                            <div className="col-auto">
                                {/* <div className="avatar-lg">
                                <img src={data.imageUrl} style={{ borderRadius:'75px', marginLeft:'20px', height: '150px'}} alt={profile}></img> */}
                                    {/* /* <img src={avatar1} alt="user-img" */}
                                {/* </div> */}
                            </div>
                            <Col>
                                <div className="p-2">
                                    <h3 style={{ marginTop:'22px' }} className="text-white mb-1">{data.name}</h3>
                                    <p className="hstack text-white-50 gap-1">{data.empRoleName}</p>
                                    <div className="hstack text-white-50 gap-1">
                                        <div className="me-2"><i
                                            className="ri-map-pin-user-line me-1 text-white-75 fs-16 align-middle"></i>{data.employeeId
                                            }</div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
        <Row className="mt-3">
          <Col md={6} className="mb-3">
            <Card>
              <CardBody>
                <h5 className="card-title mb-3">Basic Information</h5>
                <div className="table-responsive">
                  <Table className="table-borderless mb-0">
                    <tbody>
                      <tr>
                        <th className="ps-0" scope="row">
                          Full Name :
                        </th>
                        <td className="text-muted">{data.name}</td>
                      </tr>
                      <tr>
                        <th className="ps-0" scope="row">
                          Mobile :
                        </th>
                        <td className="text-muted">+91 - 94623 36543</td>
                      </tr>
                      <tr>
                        <th className="ps-0" scope="row">
                          Employee ID :
                        </th>
                        <td className="text-muted">{data.employeeId}</td>
                      </tr>
                      <tr>
                        <th className="ps-0" scope="row">
                          E-mail :
                        </th>
                        <td className="text-muted">{data.email}</td>
                      </tr>
                      <tr>
                        <th className="ps-0" scope="row">
                          Role :
                        </th>
                        <td className="text-muted">{data.empRoleType}</td>
                      </tr>
                      <tr>
                        <th className="ps-0" scope="row">
                          Location :
                        </th>
                        <td className="text-muted">Hyderabad, India</td>
                      </tr>
                      <tr>
                        <th className="ps-0" scope="row">
                          Joining Date
                        </th>
                        <td className="text-muted">24 Nov 2021</td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md={6} className="mb-3">
          <Card>
              <CardBody>
                <h5 className="card-title mb-3">System Settings</h5>
                <div className="table-responsive">
                  <Table className="table-borderless mb-0">
                    <tbody>
                      <tr>
                        <th className="ps-0" scope="row">
                          Language :
                        </th>
                        <td className="text-muted">English (United States)</td>
                      </tr>
                      <tr>
                        <th className="ps-0" scope="row">
                          Privacy :
                        </th>
                        <td className="text-muted">Only administrators and myself can view my profile.</td>
                      </tr>
                      <tr>
                        <th className="ps-0" scope="row">
                          Notification Settings:
                        </th>
                        <td className="text-muted">Allowing all notifications.</td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row >
          <Col md={6} className="mb-3">
            <Card>
              <CardBody>
                <h5 className="card-title mb-4">Skills</h5>
                <div className="d-flex flex-wrap gap-2 fs-15">
                  <Link to="#" style={{ backgroundColor: "#004e89" }} className="badge badge-soft-primary">
                    Photoshop
                  </Link>
                  <Link to="#" style={{ backgroundColor: "#004e89" }} className="badge badge-soft-primary">
                    illustrator
                  </Link>
                  <Link to="#" style={{ backgroundColor: "#004e89" }} className="badge badge-soft-primary">
                    HTML
                  </Link>
                  <Link to="#" style={{ backgroundColor: "#004e89" }} className="badge badge-soft-primary">
                    CSS
                  </Link>
                  <Link to="#" style={{ backgroundColor: "#004e89" }} className="badge badge-soft-primary">
                    Javascript
                  </Link>
                  <Link to="#" style={{ backgroundColor: "#004e89" }} className="badge badge-soft-primary">
                    Php
                  </Link>
                  <Link to="#" style={{ backgroundColor: "#004e89" }} className="badge badge-soft-primary">
                    Python
                  </Link>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Profile;