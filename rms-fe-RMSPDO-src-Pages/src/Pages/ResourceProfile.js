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
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

// import { useSelector } from "react-redux";
import { Button } from "rsuite";
import { useEffect, useState } from "react";
import { getReq } from "../Api/api";
import { useSelector } from "react-redux";


const ResourceProfile = () => {
  const [projects, setProjects] = useState();
  const url = process.env.REACT_APP_URL;
  let location = useLocation()
  let data = location?.state?.silId
  let currentProject=location?.state?.projectName;
  // console.log(location?.state)

  let select = useSelector(state => state?.login?.tasks)
  let admin = useSelector((state) => state?.newStore.adminNotification)
  // console.log(admin)

  let navigate = useNavigate()

  const fetchProjects = async () => {
    const response = await getReq(`${url}projectAlloc/getAllByResID/${location?.state?.allocationId}`)
    if (response && response.data) {
      setProjects(response?.data[0]?.ProjectName);
      // console.log(projects);
      // console.log(response.data);
    }
  }
  useEffect(() => {
    fetchProjects();
  }, [])
  return (
    <div id="base">
      <Container>
        <Row className="mt-3">
          <Col md={6} className="mb-3"> <Button onClick={() => {
            if (select[0].empRoleName === "PMO Analyst") {
              if (admin) {
                navigate('/pmosloginview')
              }
              else { navigate('/pmologinview') }
            }
            else if (select[0].empRoleName === "Resource Manager") {
              navigate('/rmloginview')
            }
            else {
              navigate('/resource')
            }

          }}><IoArrowBackOutline /></Button></Col>
        </Row>
        <div style={{ backgroundColor: "#004e89", borderRadius: '10px' }} className="pt-4 mb-4 mb-lg-3 pb-lg-4">
          <Row className="g-4">

            <div className="col-auto">
              {/* <div className="avatar-lg">
                                <img src={data.imageUrl} style={{ borderRadius:'75px', marginLeft:'20px', height: '150px'}} alt={profile}></img> */}
              {/* /* <img src={avatar1} alt="user-img" */}
              {/* </div> */}
            </div>
            <Col>
              <div className="p-2">
                <h3 style={{ marginTop: '22px' }} className="text-white mb-1">{location?.state?.name}</h3>
                <p className="hstack text-white-50 gap-1">{location?.state?.role}</p>
                <div className="hstack text-white-50 gap-1">
                  <div className="me-2"><i
                    className="ri-map-pin-user-line me-1 text-white-75 fs-16 align-middle"></i>{location?.state?.employeeId
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
                        <td className="text-muted">{location?.state?.name}</td>
                      </tr>
                      <tr>
                        <th className="ps-0" scope="row">
                          Employee ID :
                        </th>
                        <td className="text-muted">{location?.state?.silId}</td>
                      </tr>
                      {/* <tr>
                        <th className="ps-0" scope="row">
                          Date Of Birth :
                        </th>
                        <td className="text-muted">{location?.state?.dob?.slice(0,10)}</td>
                      </tr> */}
                      <tr>
                        <th className="ps-0" scope="row">
                          Role :
                        </th>
                        <td className="text-muted">{location?.state?.role}</td>
                      </tr>
                      <tr>
                        <th className="ps-0" scope="row">
                          Years Of Experience :
                        </th>
                        <td className="text-muted">{(location?.state?.yearsOfExp)}</td>
                      </tr>
                      <tr>
                        <th className="ps-0" scope="row">
                          Location :
                        </th>
                        <td className="text-muted">{(location?.state?.location)}</td>
                      </tr>
                      <tr>
                        <th className="ps-0" scope="row">
                          Joining Date :
                        </th>
                        <td className="text-muted">{location?.state?.doj.slice(0, 10)}</td>
                      </tr>
                      <tr>
                        <th className="ps-0" scope="row">
                          Technology Division :
                        </th>
                        <td className="text-muted">{(!location?.state?.technologydivision) ? ("NA") : (location?.state?.technologydivision)}</td>
                      </tr>
                      <tr>
                        <th className="ps-0" scope="row">
                         Previous Projects :
                        </th>
                        <td className="text-muted">{(!projects) ? ("NA") : (projects+''+currentProject)}</td>
                      </tr>
                      <tr>
                        <th className="ps-0" scope="row">
                          Resume :
                        </th>
                        <td><a href='https://drive.google.com/drive/folders/1uiznpXPgc5ic3f7zUxWp5Hq0YgAq-4bj' target="_blank" rel="noopener noreferrer">View Resume</a></td>
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
                  <span style={{ backgroundColor: "#004e89" }} className="badge badge-soft-primary">
                    {(!location?.state?.skillset1) ? ("NA") : (location?.state?.skillset1)}
                  </span>
                  <span style={{ backgroundColor: "#004e89" }} className="badge badge-soft-primary">
                    {(!location?.state?.skillset2) ? ("NA") : (location?.state?.skillset2)}
                  </span>

                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ResourceProfile;