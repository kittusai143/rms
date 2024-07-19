import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../CSS/Template.css";
import Notification from "./Notification";
import '../../src/CSS/PDO/Topbar.css'
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  Col,
  Row,
  Badge,
  Navbar,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap"
import iconLogo from '../../src/Pages/LoginPage/Images/sagarsoft.png'
import { addUser } from "../Store/reducers/loginReducer";
import Profile from "./Profile";
import PmNotification from "./PmNotification";
import { postReq, getReq, putReq } from "../Api/api";
import Toast, { handleErrorToast, handleSuccessToast } from "./Toast";


import "../CSS/topbar.css";
import AdminNotification from "./AdminNotification";
import { changePmo } from "../Store/reducers/Statusstore";
import { ImMenu } from "react-icons/im";
import DashboardNavigation from "./DashboardNavigation";
import { changePDSNavigate, changermsNavigate } from "../Store/reducers/Statusstore";
import Rmsnavigate from "./Rmsnavigate";



const Topbar = (props) => {
  const url = process.env.REACT_APP_URL;
  let select = useSelector((state) => state?.login?.tasks);
  const status = useSelector((state) => state?.newStore.indication)
  const count = useSelector((state) => state?.newStore.readnotification)
  // console.log(select);
  let data = select[0];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const rmsnavigate = useSelector((state) => state?.newStore?.rmsNavigate);
  const pdsnavigate = useSelector((state) => state?.newStore?.PDSNavigate)
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [ispmnotification, setPmNotification] = useState(false);
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState(groups);
  const [items, setItems] = useState([]);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [pmstatus, setpmstatus] = useState(0);
  const [pmostatus, setpmostatus] = useState(0);
  const [rmstatus, setrmstatus] = useState(0);
  const [readids, setreadids] = useState([]);
  const adminNotification = useSelector((state) => state?.newStore?.adminNotification)
  // console.log(adminNotification,useSelector((state) => state?.newStore?.adminNotification,status))
  const [activeItem, setActiveItem] = useState('');
  const [isOpen, setIsOpen] = useState(false);



  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const Logout = () => {
    dispatch(changePmo())
    if (pdsnavigate === true) {
      dispatch(changePDSNavigate())
    }
    if (rmsnavigate === true) {
      dispatch(changermsNavigate())
    }
    dispatch(addUser({}));
    navigate("/");
  };

  const setSToast = (message) => {
    handleSuccessToast(message);
  };
  const setEToast = (message) => {
    handleErrorToast(message);
  };

  const [API, setAPI] = useState({
    techGroups: [],
    roles: [],
    skills: [],
    yearsOfExp: [],
    locations: [],
    domains: [],
    availability: [],
    availForeCastWeeks: null
  });
  const twoMonthsFromNow = new Date(
    new Date().setDate(new Date().getDate() + 90)
  );
  const today = new Date();
  const oneYearFromNow = new Date(
    new Date().setDate(new Date().getDate() + 364)
  );
  // console.log(select[0].empRoleName);
  const fetchData = async () => {
    try {

      const response = await postReq(`${url}ResAlloc/filter`, API);
      // console.log(response.data);
      if (response && response.data) {
        const groupData = response.data.map((item) => ({
          id: item.resource?.allocationId,
          title: item.resource?.name,
          tip: item.resource?.location,
          item: item,
        }));
        const itemsData = response?.data.map((item) => {
          const softBlockRequestedProcesses = item?.processes.filter(
            (process) =>
              process.processStatus === "SoftBlocked" ||
              process.processStatus === "Allocation Requested"
          );
          const allocatedProcesses = item?.processes.filter(
            (process) =>
              process.processStatus === "Allocated" ||
              process.processStatus == "De-Allocation Requested" ||
              process.processStatus == "De-Allocation Rejected"
          );

          const isSoftBlocked = softBlockRequestedProcesses?.length > 0;
          const isAllocated = allocatedProcesses?.length > 0;

          let title = "";
          let background = "";
          let startDate = today;
          let endDate = twoMonthsFromNow;

          if (isSoftBlocked) {
            title = "Soft Blocked";
            background = "grey";
            startDate = new Date(softBlockRequestedProcesses[0].sbstartDate);
            endDate = new Date(softBlockRequestedProcesses[0].sbendDate);
          } else if (isAllocated) {
            title = "Allocated to for the project ";
            background = "blue";
            startDate = new Date(allocatedProcesses[0].allocStartDate);
            endDate = new Date(item?.processes[0]?.allocEndDate);
          } else {
            title = "Free Pool : Resource Available for Project";
            background = "green";
          }
          // console.log(title);
          return {
            id: item.resource.allocationId,
            group: item.resource.allocationId,
            start_time: startDate,
            end_time: endDate,
            title: title,
            itemProps: {
              style: { background: background, borderRadius: "8px" },
            },
          };
        });
        setGroups(groupData);
        setFilteredGroups(groupData);
        setItems(itemsData);
      } else {
        console.error("Unexpected response format or empty data:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const getnotification = async () => {
    if (select[0].empRoleName === "Manager") {
      try {
        const response = await getReq(
          `${url}ResourceAllocProcess/getlistusers`
        );
        if (response && response.data) {
          const res = response.data.filter(
            (obj) => obj.CreatedBy === select[0].employeeId
          );
          if (res) {
            const ids = res
              .filter((item) => item.PmReadStatus === false)
              .map((item) => item.Id);
            // console.log(ids.length);
            setreadids(ids);
            setpmstatus(ids.length);
            fetchData();
          }
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    } else if (select[0].empRoleName === "PMO Analyst") {
      try {
        const response = await getReq(
          `${url}ResourceAllocProcess/getlistusers`
        );
        if (response && response.data) {
          const ids = response?.data
            ?.filter((item) => item?.PmoReadStatus === false)
            .map((item) => item?.Id);
          // console.log(ids.length);
          setreadids(ids);
          setpmostatus(ids.length);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    } else if (select[0].empRoleName === "Resource Manager") {
      try {
        // console.log(select[0].empRoleName);
        const response = await getReq(
          `${url}ResourceAllocProcess/getlistusers`
        );
        if (response && response.data) {
          const ids = response?.data
            ?.filter((item) => item.RmReadStatus === false)
            .map((item) => item.Id);
          // console.log(ids.length,ids);
          setreadids(ids);
          setrmstatus(ids.length);
          // console.log(ids.length)
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    }
  };
  useEffect(() => {
    getnotification();
  }, [count]);

  const closePmNotification = () => {
    setPmNotification(false);
    const name = select[0].empRoleName;
    // console.log("HELLO", name, readids);
    const readstatus = { role: name, ids: readids };
    putReq(`${url}ResourceAllocProcess/read`, readstatus).then((res) => {

      getnotification();
    });
  };
  const closeNotification = () => {
    setNotificationOpen(false);
    const name = select[0].empRoleName;
    const readstatus = { role: name, ids: readids };
    // console.log(readstatus)
    putReq(`${url}ResourceAllocProcess/read`, readstatus).then((res) => {
      getnotification();
    });
  };
  // console.log(props);
  const isActive = (path) => {
    const isActiveRoute = activeItem === path;
    return isActiveRoute ? 'select_label' : 'header_label';
  };
  const handleNavigate = (path) => {
    navigate(path);
    setActiveItem(path);
    setIsOpen(false); // Close the navbar menu after clicking a link
  };



  return (
    <>
      <nav>
        <div className="navbar-wrap">
          <div className="navbar-left">
            <button className="logo_page"
              onClick={() => {
                if (pdsnavigate === true) {
                  dispatch(changePDSNavigate())
                }
                if (rmsnavigate === true) {
                  dispatch(changermsNavigate())
                };
                navigate("/")
              }}
            >
              <a style={{ paddingRight: '8%' }}>
                <img className="sagarsoft_logos" src={iconLogo} alt="iconLogo" style={{ height: "10%", width: "100%" }} />
              </a>

            </button>
            <div>
              <a href="#" className="logo" onClick={() => { dispatch(changermsNavigate); navigate('/') }}>

              </a>
            </div>
          </div>
          {/* <div className="navbar-center d-none d-lg-block">
                    <div className="search_div">
                        <input
                            type="search"
                            placeholder="Search"
                            id="search"
                            value={searchValue}
                            onChange={handleSearchChange}
                        />
                        {searchValue === "" && <i className="bi bi-search"></i>}
                    </div>
                </div> */}

          <div className="navbar-right">
            {rmsnavigate && (<div style={{ display: "flex", marginRight: "5%" }}>
              {(select[0].empRoleName !== "Higher Management" && select[0].empRoleName !== "Management") && <div title="Notification">
                {data.empRoleName === "Manager" ? (
                  <>
                    {" "}
                    <Button
                      // className="notification-btn"
                      onClick={() => setPmNotification(true)}
                      style={{
                        marginRight: "10%",
                        fontSize: "80%",
                        border: "1px solid #dadce0",
                      }}
                    >
                      <i class="bi bi-bell-fill"></i>
                    </Button>
                  </>
                ) : (
                  <Button
                    // className="notification-btn"
                    onClick={() => {
                      setNotificationOpen(true);
                    }}
                    style={{
                      marginRight: "10%",
                      fontSize: "80%",
                      border: "1px solid #dadce0",
                    }}
                  >

                    <i class="bi bi-bell-fill"></i>
                    {/* <sup>{(data.empRoleName==="PMO Analyst")?(pmostatus):(rmstatus)}</sup> */}
                  </Button>
                )}
              </div>
              }

              {(select[0].empRoleName !== "Higher Management" && select[0].empRoleName !== "Management") && <div style={{ display: "flex" }}>
                <sup>
                  <Badge
                    style={{
                      marginRight: "10%",
                      fontSize: "80%",
                      border: "1px solid #dadce0",

                    }}
                  >
                    {data.empRoleName === "Manager"
                      ? pmstatus > 0
                        ? pmstatus
                        : null
                      : data.empRoleName === "PMO Analyst"
                        ? pmostatus > 0
                          ? pmostatus
                          : null
                        : rmstatus > 0
                          ? rmstatus
                          : null}
                  </Badge>
                </sup>
              </div>
              }</div>)}
            <div class="user-container">
              <Dropdown
                isOpen={dropdownOpen}
                toggle={toggle}
                direction="down"
              >
                <DropdownToggle
                  className="dropdown-toggle"
                  data-toggle="dropdown"
                  tag="div">
                  <div class="user-picture image">
                    {!data.imageUrl ? (<svg
                      width="50"
                      height="50"
                      viewBox="0 0 50 50"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <rect x="0" y="0" width="50" height="50" fill="#FE4D93" />
                      <text
                        x="40%"
                        y="40%"
                        dominant-baseline="middle"
                        text-anchor="middle"
                        fill="white">
                        {data.name
                          .split(" ")
                          .map((part) => part.charAt(0))
                          .join("")}
                      </text>
                    </svg>) : (<img src={data.imageUrl} height="100%" width="100%" alt="" />)}

                  </div>
                  <div class="info-container d-none d-lg-block">
                    <div class="user-name">
                      {data.name}
                    </div>
                    <div class="user-title">
                      {data.empRoleName}
                    </div>
                  </div>
                </DropdownToggle>
                <DropdownMenu >
                  <DropdownItem onClick={() => { navigate('/profile') }}>Profile</DropdownItem>
                  <DropdownItem onClick={Logout}>Log Out</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </div>
        {(ispmnotification) && (select[0].empRoleName === "Manager") && <PmNotification onClose={closePmNotification} />}
        {(isNotificationOpen && !adminNotification) && (
          <Notification
            onClose={closeNotification}
            onRefresh={fetchData}
            setSToast={setSToast}
            setEToast={setEToast}
          />
        )}
        {(isNotificationOpen) && (select[0].empRoleName === "PMO Analyst" && adminNotification) && (
          <AdminNotification
            onClose={closeNotification}
            onRefresh={fetchData}
            setSToast={setSToast}
            setEToast={setEToast}
          />
        )}

      </nav>

      {pdsnavigate && (<div className="navbars_content">
        <Navbar style={{ backgroundColor: "#302f2f",
          height: "50px",
          padding: "15px 0px 0px 0px",
}}>
          <Nav>
          <NavItem>
            <NavLink className={isActive("/user/dashboard") || isActive("/user/peopleData") || isActive("/user/utilizatinData")}>
              <select
                className="select_dropdowns"
                onChange={(e) => handleNavigate(e.target.value)}
                value={activeItem}
              >

                <option selected hidden >Resource Dashboard</option>
                <option value="/">Resource Dashboard</option>
                <option value="/user/peopleData">Project Dashboard</option>
                <option value="/user/utilizatinData">Utilization Dashboard</option>
              </select>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={isActive("/user/resource")}
              onClick={() => handleNavigate("/user/resource")}
            >
              Resource Allocation
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={isActive("/user/consultantdata")}
              onClick={() => handleNavigate("/user/consultantdata")}>
              Consultant Data
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={isActive("/user/projectdata")}
              onClick={() => handleNavigate("/user/projectdata")}
            >
              Project Data
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={isActive("/user/clientData")}
              onClick={() => handleNavigate("/user/clientData")}
            >
              Client Data
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={isActive("/user/sowData")}
              onClick={() => handleNavigate("/user/sowData")}>
              SOW Data
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={isActive("/user/vendorDetails")}
              onClick={() => handleNavigate("/user/vendorDetails")}>
              Vendor Data
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={isActive("/user/clientAssest")}
              onClick={() => handleNavigate("/user/clientAssest")}>
              Client Assets
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={isActive("/user/techMasterData")}
              onClick={() => handleNavigate("/user/techMasterData")}>
              Technology Master
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={isActive("/user/domainData")}
              onClick={() => handleNavigate("/user/domainData")}>
              Domain Data
            </NavLink>
          </NavItem>



        </Nav>
      </Navbar>
        </div >
)}
    </>
  );
};
export default Topbar;
