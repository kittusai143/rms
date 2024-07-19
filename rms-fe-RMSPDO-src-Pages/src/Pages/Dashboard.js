import React, { useEffect, useState } from "react";
import ResourceNavigation from "./Navigation";
import { Row, Col, Card, CardBody, CardTitle, CardText, Button, Badge, Input } from 'reactstrap';
import { postReq } from "../Api/api";
import Table from 'react-bootstrap/Table';
import { Tab } from "react-bootstrap";
import AllEmployees from "../Pages/LoginPage/Images/employees.png";
import BenchEmployees from "../Pages/LoginPage/Images/Bench-Employees.png";
import "../CSS/Template.css";
import PieChart from "./PieChart";
import BarGraph from "./BarGraph";
import BenchExit from "../Pages/LoginPage/Images/bench-exit.png";
import EmployeeForecast from "../Pages/LoginPage/Images/EmployeeForecast.png";
import "../CSS/Dashboard.css"; // Import the new CSS file
import BenchProjects from "./BenchProjects";
import DashBoardNavigation from "./DashboardNavigation";
import { ImMenu } from "react-icons/im";
import { Navigate, useNavigate } from "react-router";
import Spinner from "react-bootstrap/Spinner";
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,



} from "reactstrap";
import { useSelector } from "react-redux";


const DashBoard = () => {
    const select = useSelector((state) => state?.login?.tasks);
    const direction = 'end';
    const url = process.env.REACT_APP_URL;
    const navigate = useNavigate();
    const [API, setAPI] = useState({
        availability: ["Allocated"],
        availForeCastWeeks: 4
    });
    const [benchdata, setBenchData] = useState();
    const [APIParams, setAPIParams] = useState({
        availability: ["Allocated"],
        availForeCastWeeks: 4,
    });
    const [resourcedata, setResourceData] = useState([]);
    const [exitcount,setExitCount]=useState([]);
    const [resourcecount, setResourceCount] = useState();
    const [allocatedemployees, setAllocatedEmployees] = useState([]);
    const [benchcount, setBenchCount] = useState(
        {
            availability: [],
            availForeCastWeeks: null,
            techGroups: [],
            roles: [],
            skills: [],
            yearsOfExp: [],
            locations: [],
            domains: []
        }
    );
    const[loader,setLoader]=useState(false);
    const [input, setInput] = useState();
    const [allcount, setAllCount] = useState(
        {
            availability: ["Available", "Allocated"],
            availForeCastWeeks: null,
            techGroups: [],
            roles: [],
            skills: [],
            yearsOfExp: [],
            locations: [],
            domains: []
        }
    );
    const [list, setList] = useState();
    const tableHeadings2 = ['Emp Id', 'Resource Name', 'Experience', 'Location', 'Skills', 'Resource Available Date']
    const [show, setshow] = useState(false)

    const getStats = async () => {
        setLoader(true);
        const availabilityResponse = await postReq(`${url}ResAlloc/filter`, {
            availability: APIParams.availability,
            availForeCastWeeks: APIParams.availForeCastWeeks
        });

        if (availabilityResponse) {
            setAllocatedEmployees(availabilityResponse.data)
            setList(availabilityResponse.data);
        }

        const benchResponse = await postReq(`${url}ResAlloc/filter`, benchcount);

        if (benchResponse) {
            setResourceData(benchResponse.data)
            setBenchData(benchResponse.data);
        }

        const allResourceCount = await postReq(`${url}ResAlloc/filter`, allcount);
        // console.log(allResourceCount, benchResponse)

        if (allResourceCount) {
            setResourceCount(allResourceCount.data);
            const exit_count=allResourceCount.data.filter((data)=>data.resource.status==="Exit")
            if(exit_count)
            {
                // console.log(allResourceCount.data);
                // console.log(exit_count);
                setExitCount(exit_count.length)
            }
        }
        setLoader(false);
    };
    const HandleSearchClick = (searchVal) => {
        if (searchVal === "") {
            setAllocatedEmployees(list);
            return;
        }

        const filterBySearch = list?.filter((group) => {
            const { name, location, skillset1, skillset2, silId, projectEndDate, yearsOfExp } = group?.resource;
            const searchStr = searchVal?.toLowerCase();
            const allocEndDateStr = projectEndDate ? projectEndDate?.toString()?.slice(0, 10) : "";
            return (
                name?.toLowerCase()?.includes(searchStr) ||
                location?.toLowerCase()?.includes(searchStr) ||
                skillset1?.toLowerCase()?.includes(searchStr) ||
                skillset2?.toLowerCase()?.includes(searchStr) ||
                silId?.toLowerCase()?.includes(searchStr) ||
                allocEndDateStr.includes(searchStr) ||
                yearsOfExp?.toString().includes(searchStr)
            );
        });

        setAllocatedEmployees(filterBySearch);
        // console.log(filterBySearch);
    }


    useEffect(() => {
        getStats();
    }, [APIParams]);

    useEffect(() => {
        HandleSearchClick(input);
    }, [input])
    useEffect(() => {
        if (loader) {
          document.documentElement.style.overflow = 'hidden';
        } else {
          document.documentElement.style.overflow = '';
        }
      }, [loader]);

    // console.log(allocatedemployees)
    const data = [
        {
            projectType: "INTERNAL",
            yearsOfExp: 3.15,
            projectCode: "PSAG0524BN",
            employeeName: "Abishek Reddy Wdaru"
        },
        {
            projectType: "INTERNAL",
            yearsOfExp: 4,
            projectCode: "PSAG0524BN",
            employeeName: "Boppella Deepika Reddy"
        },
        // Add more data here
    ];
    return (
        <>
            
            {loader && <><div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><div className="backdrop"><Spinner animation="border" variant="primary" /></div></div></>}
            <div className={`dashboard-container ${loader ? 'no-scroll' : ''}`}>
                {/* <Dropdown
                    drop="end"
                    isOpen={show}
                    toggle={() => setshow(!show)}
                    className="user_dropdown"
                >
                    <DropdownToggle
                        className="dropdown-toggle"
                        data-toggle="dropdown"
                        tag="div"
                        style={{
                            background: "#46494C !important",
                            cursor: "pointer"
                        }}
                    >
                        <ImMenu size="2em" onClick={() => setshow(!show)} />
                    </DropdownToggle>
                    <DropdownMenu className={show ? 'show1' : ''}>
                        <DropdownItem onClick={() => { }} className="bg-info">
                            Dashboard
                        </DropdownItem>
                        <DropdownItem onClick={() => { if(select[0].empRoleName==='Higher Management'||select[0].empRoleName==='Management'){navigate('/rmloginview')}else{navigate('/pmosloginview')} }}>
                            Workbench
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown> */}
                <div style={{ padding: "1%" }}>
                    <div>
                        <Row>

                            <Col sm="3">
                                <Card body className="card-item A">
                                    <CardTitle tag="h5">All Resources</CardTitle>
                                    <CardText style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <h2>{resourcecount?.length}</h2>
                                        <img className="card-img" src={AllEmployees} alt="All Employees" />
                                    </CardText>
                                </Card>
                            </Col>
                            <Col sm="3">
                                <Card body className="card-item B">
                                    <CardTitle tag="h5">Bench Resources</CardTitle>
                                    <CardText style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <h2>{benchdata?.length}</h2>
                                        <img className="card-img" src={BenchEmployees} alt="Bench Employees" />
                                    </CardText>
                                </Card>
                            </Col>
                            <Col sm="3">
                                <Card body className="card-item C">
                                    <CardTitle tag="h5">Bench Exit</CardTitle>
                                    <CardText style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <h2>{exitcount}</h2>
                                        <img className="card-img" src={BenchExit} alt="Bench Exit" />
                                    </CardText>
                                </Card>
                            </Col>
                            <Col sm="3">
                                <Card body className="card-item D">
                                    <CardTitle tag="h5">Availability Forecast</CardTitle>
                                    <CardText style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <h2>{allocatedemployees?.length}</h2>
                                        <img className="card-img" src={EmployeeForecast} alt="Employee Forecast" />
                                    </CardText>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                    <div style={{ height: "20%" }}>
                        <Row className="middle">
                            <Col sm="6" lg="6" xl="4">
                                <Card body className="table-2" style={{ height: '350px' }}>
                                    <CardTitle tag="h5">Bench Resource by Experience</CardTitle>
                                    <CardText style={{ display: 'flex' }}>
                                        <div style={{ height: '350px' }}>
                                            <PieChart />
                                        </div>
                                    </CardText>
                                </Card>
                            </Col>
                            <Col sm="6" lg="6" xl="4">
                                <Card body className="table-2" style={{ height: '350px' }}>
                                    <CardTitle tag="h5">Bench Resource by TechGroups</CardTitle>
                                    <CardText style={{ display: 'flex' }}>
                                        <div style={{ height: '350px' }}>
                                            <BenchProjects data={data} />
                                        </div>
                                    </CardText>
                                </Card>
                            </Col>
                            <Col sm="4" lg="6" xl="4">
                                <Card body className="table-2" style={{ height: '350px' }}>
                                    <CardTitle tag="h5">Bench Resource RunRate</CardTitle>
                                    <CardText style={{ display: 'flex', height: "400px" }}>

                                        <div style={{ height: '350px' }}>
                                            <BarGraph />
                                        </div>
                                    </CardText>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Card body className="table-2" style={{ height: '300px', overflow: 'hidden' }}>

                                    <CardTitle tag="h5">Availability Forecast</CardTitle>
                                    <Row style={{ marginTop: "1%", marginBottom: "1%" }}>
                                        <Col xs="2">
                                            <Input
                                                type="text"
                                                value={input}
                                                onChange={(e) => setInput(e.target.value)}
                                                placeholder="Search ..."
                                                style={{
                                                    borderRadius: "25px",
                                                    paddingRight: "40px",
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                    <CardText style={{ height: '100%', overflow: 'hidden' }}>
                                        <div className="table-container-3">
                                            <Table responsive>
                                                <thead>
                                                    <tr >
                                                        <th className="table-row">#</th>
                                                        {tableHeadings2?.map((data, index) => (
                                                            <th className="table-row" key={index}>{data}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                            </Table>
                                        </div>
                                        <div className="table-container-1" style={{ paddingBottom: '2%' }}>
                                            <Table responsive>
                                                <tbody>
                                                    {allocatedemployees?.map((data, index) => (
                                                        <tr key={index}>
                                                            <td className="table-row">{index + 1}</td>
                                                            <td className="table-row">{data?.resource?.silId}</td>
                                                            <td className="table-row">{data?.resource?.name}</td>
                                                            <td className="table-row">{data?.resource?.yearsOfExp}</td>
                                                            <td className="table-row">{data?.resource?.location}</td>
                                                            <td className="table-row">
                                                                {data?.resource?.skillset1 || data?.resource?.skillset2 ? (
                                                                    <>
                                                                        {data?.resource?.skillset1} {data?.resource?.skillset2}
                                                                    </>
                                                                ) : (
                                                                    '-'
                                                                )}
                                                            </td>
                                                            <td className="table-row">{(data?.processes[0]?.allocEndDate?.slice(0, 10))}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </CardText>
                                </Card>
                            </Col>
                        </Row>

                    </div>
                </div>
            </div>
        </>
    );
};

export default DashBoard;
