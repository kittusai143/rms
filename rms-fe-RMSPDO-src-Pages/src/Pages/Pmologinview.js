import React, { useState, useEffect } from "react";
import Timeline, {
  TimelineHeaders,
  SidebarHeader,
  DateHeader,
} from "react-calendar-timeline";
import "react-calendar-timeline/lib/Timeline.css";
import "../src/../CSS/Resource.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { getReq, postReq } from "../Api/api";
import { Button, Input, Row, Col,Badge } from "reactstrap";
import { MultiSelect } from "react-multi-select-component";
import { useSelector } from "react-redux";
import FiltersSideBar from "./FiltersSideBar";
import "react-tooltip/dist/react-tooltip.css";
import Toast, { handleErrorToast, handleSuccessToast } from "./Toast";
import { Tooltip } from "react-tooltip";
import Notification from "./Notification";
import ExperienceSelectionModal from "./ExperienceSelectionModal";
import { useNavigate } from "react-router";
import ActivityHistory from "./ActivityHistory";
import Spinner from 'react-bootstrap/Spinner';
import "../CSS/Resource.css";
import Form from 'react-bootstrap/Form';
import { FcClearFilters } from "react-icons/fc";
import { useDispatch } from "react-redux";
import { changePmoAdmin} from "../Store/reducers/Statusstore";

function Pmologinview() {

  const url = process.env.REACT_APP_URL;
  let navigate = useNavigate()
  const [isAdmin, setIsAdmin] = useState(false);
  const status = useSelector((state) => state?.newStore.indication)
  const [input, setInput] = useState("");
  const [loader, setLoader] = useState(true);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState([]);
  const [activityhistory, setactivityhistory] = useState(false);
  const [selectedExp, setSelectedExp] = useState([]);
  const [skills, setSkills] = useState([]);
  const [activityid, setactivityid] = useState(0);
  const [selectedName, setselectedName] = useState("");
  const [place, setPlace] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [exp, setExp] = useState([]);
  const [showFilterSideBar, setShowFilterSideBar] = useState(false);
    const [lastAppliedFilters, setLastAppliedFilters] = useState({
    techGroups: [],
    roles: [],
    skills: [],
    yearsOfExp: [0, 30],
    locations: [],
    domains: [],
    availability: [],
    availForeCastWeeks: null
  });

  const [minNum, setMinNum] = useState();
  const [maxNum, setMaxNum] = useState();
  const [resourceStatus, setResourceStatus] = useState();
  const [skillOptions, setSkillOptions] = useState()
  const [locationOptions, setlocationOptions] = useState()
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [isExpModal, setExpModal] = useState(false);
  const [nullgroup, setNullgroup] = useState([]);
  const [nullitem, setNullitem] = useState([]);
  const [slidervalue, setSliderValue] = useState("Select Experience");
  const [min_value, setMinValue] = useState(lastAppliedFilters.yearsOfExp[0]);
  const [max_value, setMaxValue] = useState(lastAppliedFilters.yearsOfExp[1]);
  const [API, setAPI] = useState({
    techGroups: [],
    roles: [],
    skills: [],
    yearsOfExp: [],
    locations: [],
    domains: [],
    availability: [],
    availForeCastWeeks:null
})
let last={
  techGroups: [],
  roles: [],
  skills: [],
  yearsOfExp: [],
  locations: [],
  domains: [],
  availability: [],
  availForeCastWeeks:null
}
// console.log(useSelector((state) => state.newStore))
const dispatch = useDispatch();
  let resource="";
 
  const closeExpModal=()=>
  {
    setExpModal(false);
  }
  useEffect(() => {

    if (isAdmin) {
      dispatch(changePmoAdmin())
      navigate('/pmosloginview');
    } else {
  
      navigate('/pmologinview');
    }
  }, [isAdmin, navigate]);
  const today = new Date();
  const oneYearFromNow = new Date(
    new Date().setDate(new Date().getDate() + 364)
  );
  const twoMonthsFromNow = new Date(
    new Date().setDate(new Date().getDate() + 90)
  );
  const setSToast = (message) => {
    handleSuccessToast(message);
  };
  const setEToast = (message) => {
    handleErrorToast(message);
  };
  
  const handleSwitchToggle = () => {
    setIsAdmin(prevState => !prevState);
  };
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState(groups);
  const [data, setData] = useState([]);
  const select = useSelector((state) => state?.login?.tasks);
  const HandleClearFromSideBar = () => {
    setSelectedSkills([])
    setSelectedPlace([])
    setMinValue(0);
    setMaxValue(30);
    setSliderValue("Select Experience");
  }

  const handleRefresh = () => {
    setRefresh(true);
  };
  const closeNotification = () => {
    setNotificationOpen(false);
  };
  function HandleSearchClick(searchVal) {
    // console.log(searchVal);
    if (searchVal === "") {
      setGroups(filteredGroups);
      return;
    }
    const filterBySearch = filteredGroups.filter((group) =>
      group.title.toLowerCase().includes(searchVal.toLowerCase())
    );
    // console.log(filterBySearch);
    // console.log(groups);
    setGroups(filterBySearch);
  }
  const HandleFilter = () => {
    if(JSON.stringify(last)===JSON.stringify(API)){
    // console.log(maxNum,typeof maxNum)
    if (maxNum === "Maximum Exp...." || minNum === "Minimum Exp....") {
      setEToast("Please enter a valid number for min and max experience")
    } else if (maxNum < minNum) {
      setEToast("Max value of experience must be greater than or equal to min value.");
    } else if (maxNum > 30 || minNum < 0) {
      setEToast("Values must be between 0 and 30.");
    } else {
      setMinValue(minNum);
      setMaxValue(maxNum);
    }
  }
  else{
    setEToast("Please clear Advance Filters")
  }
  };
  const ClearFilter = () => {
    setMinValue(0);
    setMaxValue(30);
    setMinNum("Minimum Exp....");
    setMaxNum("Maximum Exp....");
  }

  const [items, setItems] = useState([]);
  useEffect(() => {
    FilterApi();
  }, [skills, place, min_value, max_value]);
  const fetchData = async () => {
    try {
      setLoader(true);
      setCurrentPage(1)
      const response = await postReq(`${url}ResAlloc/filter`, API);
      if (response && response.data) {
        const groupData = response.data.map((item) => ({
          id: item.resource?.allocationId,
          title: item.resource?.name,
          tip: item.resource?.location,
          item: item,
        }));
        groupData.sort((a, b) => {
          let fa = a.title.toLowerCase(),
            fb = b.title.toLowerCase();

          if (fa < fb) {
            return -1;
          }
          if (fa > fb) {
            return 1;
          }
          return 0;
        });
        const itemsData = [];
        response?.data.forEach((item) => {
          const softBlockProcesses = item?.processes.filter(
            (process) =>
              process.processStatus === "SoftBlocked" ||
              process.processStatus === "Allocation Requested"
          );

          let softBlockCounter = 0;

          softBlockProcesses.forEach((softBlockProcess) => {
            const startDate = new Date(softBlockProcess.sbstartDate);
            const endDate = new Date(softBlockProcess.sbendDate);
            let color;
            if (softBlockCounter === 0) {
              color = "orange";
            } else {
              color = "brown";
            }
            softBlockCounter++;

            itemsData.push({
              id: item?.resource?.allocationId + softBlockCounter / 10,
              group: item?.resource?.allocationId,
              start_time: startDate,
              end_time: endDate,
              title: "Soft Blocked",
              canResizeRight: false,
              canMove: false,
              itemProps: {
                style: { background: color, borderRadius: "8px" },
              },
            });
          });


          const allocatedProcesses = item?.processes.filter(
            (process) =>
              process.processStatus === "Allocated" ||
              process.processStatus === "Allocation Extension Requested"||
              process.processStatus == "De-Allocation Requested" ||
              process.processStatus == "De-Allocation Rejected"
          );

          const isAllocated = allocatedProcesses?.length > 0;

          if (!isAllocated && softBlockProcesses.length === 0) {
            itemsData.push({
              id: item?.resource?.allocationId,
              group: item?.resource?.allocationId,
              start_time: today,
              end_time: twoMonthsFromNow,
              title: (item?.resource?.status==="Active")? "Resource Available for Project Allocation":"On notice",
              canResizeRight: false,
              canMove: false,
              itemProps: {
                style: { background: (item?.resource?.status==="Active")?"green":"grey", borderRadius: "8px" },
              },
            });
          }
          else if (isAllocated) {
            const heading=`${item?.resource?.clientCode} - ${item?.resource?.projectName}`
            const startDate = new Date(item.processes[0].allocStartDate);
            const endDate = new Date(item?.processes[0]?.allocEndDate);
            itemsData.push({
              id: item?.resource?.allocationId,
              group: item?.resource?.allocationId,
              start_time: startDate,
              end_time: endDate,
              title:heading,
              canResizeRight: false,
              canMove: false,
              itemProps: {
                style: { background: "blue", borderRadius: "8px" },
              },
            });
          }
        });
        setGroups(groupData);
        setFilteredGroups(groupData);
        setItems(itemsData);
        setLoader(false);
      } else {
        setLoader(false);
        console.error("Unexpected response format or empty data:", response);
      }
    } catch (error) {
      setLoader(false);
      console.error("Error fetching data:", error);
    }
  };

  const fetchStatus = async () => {
    const data = await getReq(
      `${url}ResourceAllocProcess/getAll`
    );
    // console.log(data.data);
    setData(data.data);
  };

  // console.log(groups);

  useEffect(() => {
    fetchData();
    fetchStatus();
    getProcessStatus();
  }, [status]);

  useEffect(() => {
    HandleSearchClick(input);
  }, [input]);

 
  
  const FilterApi = async () => {
    setLoader(true)
    setCurrentPage(1)
    let exp = [];
    if (min_value === 0 && max_value === 30) {
      exp = []
    }
    else {
      exp = [min_value, max_value];
    }
    const res = await postReq(`${url}ResAlloc/filter`, {
      skills: skills,
      locations: place,
      yearsOfExp: exp,
    });
    const groupData = res?.data?.map((item) => ({
      id: item.resource?.allocationId,
      title: item.resource?.name,
      tip: item.resource?.location,
      item: item,
    }));
    // console.log(groupData);
    groupData?.sort((a, b) => {
      let fa = a.title.toLowerCase(),
        fb = b.title.toLowerCase();

      if (fa < fb) {
        return -1;
      }
      if (fa > fb) {
        return 1;
      }
      return 0;
    });
    setGroups(groupData);
    setLoader(false)
  };
  const clearExternalFilters = () => {
    setLoader(true);
    // console.log("hello");
    setSelectedSkills([]);
    setSelectedPlace([]);
    setMinValue(0);
    setMaxValue(30);
    setSliderValue("Select Experience");
    setMinNum("Minimum Exp....");
    setMaxNum("Maximum Exp....");
    fetchData();
    setLoader(false);
  }

  const val = true;
  const handleSkillsChange = async(selectedItems) => {
   
    if(JSON.stringify(last)===JSON.stringify(API)){
    setSelectedSkills(selectedItems);
    const selectedSkills = selectedItems.map((item) => item.value);
    setSkills(selectedSkills)
    }
    else{
      setEToast("Please clear Advance Filters")
    }
  };
  const handlePlaceChange = async (selectedItems) => {
    if(JSON.stringify(last)===JSON.stringify(API)){
    setSelectedPlace(selectedItems);
    const selectedSkills = selectedItems.map((item) => item.value);
    setPlace(selectedSkills);
    }
    else{
      setEToast("Please clear Advance Filters")
    }
  };
  const getProcessStatus = (item) => {
    // console.log(item);
    const res = item?.find((obj) => obj?.createdBy === select[0].employeeId);
    // console.log(res);
    setResourceStatus(res?.processStatus);
    // console.log(resourceStatus);
  };
  // console.log(data);

  useEffect(() => {
    getSkills();
    getLocations();
  }, []);

  const getSkills = async () => {
    await getReq(url + "techgroup/getAll").then((data) => {
      const result = data?.data?.map((item) => ({
        label: item?.techSkill,
        value: item?.techSkill,
      }));
      setSkillOptions(result);
    });
  };

  const getLocations = async () => {
    await getReq(url + 'ResAlloc/getLocations').then(data => {
      const result = data?.data?.map(item => ({ label: item, value: item }))
      setlocationOptions(result)
    })
  }
  const closeactivityhistory = () => {
    setactivityhistory(false);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGroups = groups.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
// console.log(useSelector((state) => state?.newStore))
  return (
    <><div style={{marginTop:"-2%"}}>
      <Toast />
      <Row style={{ margin: "1%" }}>
        <Col xs="2">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search Resource Name ..."
            style={{
              borderRadius: "25px",
              paddingRight: "40px",
            }}
          />
        </Col>
        <Col xs={1}>
          <Button
            outline
            color="secondary"
            onClick={() => setShowFilterSideBar(true)}
            style={{display:'flex'}}
          >
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              className="bi bi-filter"
              viewBox="3 0 16 14"
            >
              <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5" />
            </svg>
            Filter
          </Button>{" "}
        </Col>
        <Col xs="7" style={{ marginLeft: "16%" }}>
          <Row>
            <Col style={{ width: '20%' }}>
              {skillOptions && (
                <MultiSelect
                  options={skillOptions}
                  value={selectedSkills}
                  labelledBy="Skill"
                  overrideStrings={{ selectSomeItems: "Skill" }}
                  onChange={handleSkillsChange}
                  className="multi"
                />
              )}
            </Col>
            <Col style={{ width: '20%' }}>
              {locationOptions && (
                <MultiSelect
                  id="multi"
                  options={locationOptions}
                  value={selectedPlace}
                  onChange={handlePlaceChange}
                  labelledBy="Location"
                  overrideStrings={{ selectSomeItems: "Location" }}
                />
              )}
            </Col>
            <Col>
              <Input
                type="number"
                placeholder="Minimum Exp...."
                value={minNum}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setMinNum(value < 0 ? 0 : value > 30 ? 30 : value);
                }}
              ></Input>
            </Col>
            <Col>
              <Input
                type="number"
                placeholder="Maximum Exp...."
                value={maxNum}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setMaxNum(value < 0 ? 0 : value > 30 ? 30 : value);
                }}
              ></Input>
            </Col>

            <Col xs={1}>
              <Button
                title="Apply exp filter"
                className="check-btn"
                onClick={() => HandleFilter()}
                style={{
                  fontSize: "80%",
                  border: "1px solid #dadce0",
                }}
              >
                <i class="bi bi-check2"></i>
              </Button>
            </Col>
            <Col xs={1}>
              <Button
              title="Reset exp filter"
                className="cross-btn"
                onClick={() => ClearFilter()}
                style={{
                  marginRight: "80%",
                  fontSize: "80%",
                  border: "1px solid #dadce0",
                }}
              >
                <i class="bi bi-x-lg"></i>
              </Button>
            </Col>

            <Col
              xs={1}
              onClick={() => {
                clearExternalFilters()
              }}
            >
              <FcClearFilters
               title="Clear external filters"
                style={{
                  width: "2em",
                  height: "2em",
                  cursor: "pointer",
                  fill: "#333",
                  transition: "fill 0.3s ease",
                }}
              />
            </Col>
            <Col style={{marginTop:'1%'}}>
              <Form >
                <Form.Check 
                  type="switch"
                  id="custom-switch"
                  label="Admin"
                  checked={isAdmin}
                  onChange={handleSwitchToggle}
                />
              </Form>
            </Col>

          </Row>
        </Col>
      </Row>
      <div className="container-fluid">
        <div className="content-container" style={{ border: "2px" }}>
          <div className="timeline-container">
         
            {items.length > 0 && groups.length > 0 &&
              <>
              {loader && <div className="backdrop"><Spinner animation="border" variant="primary" /></div>}
                <Timeline
                  groups={currentGroups}
                  items={items}
                  defaultTimeStart={today}
                  defaultTimeEnd={oneYearFromNow}
                  itemRenderer={({ item, itemContext, getItemProps, getResizeProps }) => {
                    const { left: leftResizeProps, right: rightResizeProps } = getResizeProps();
                    return (
                      <div {...getItemProps(item.itemProps)}>
                        {itemContext.useResizeHandle ? <div {...leftResizeProps} /> : ""}
                        <div
                          className="rct-item-content"
                          style={{ maxHeight: `${itemContext.dimensions.height}` }}
                        >
                          {item.title}
                        </div>
                        {itemContext.useResizeHandle ? <div {...rightResizeProps} /> : ""}
                      </div>
                    );
                  }}
                  groupRenderer={({ group }) => {
                    getProcessStatus(group.item?.processes);
                    // console.log(resourceStatus);
                    // console.log(group);
                    const hasShownInterest = group?.item?.processes?.some(
                      (process) =>
                        process?.processStatus !== null &&
                        process.createdBy === select[0]?.employeeId
                    );
                    return (
                      <div className="custom-group">
                        <span
                          className="title"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "left",
                          }}
                        >
                          <a
                            id="clickable"
                            data-tooltip-place="right-end"
                            data-tooltip-position-strategy="fixed"
                            onClick={() => {
                              resource = group?.item?.resource
                              setactivityid(group?.item?.resource?.allocationId);
                              setselectedName(group?.title);
                              // console.log(group?.item?.resource?.silId)
                            }}
                            className="resource-name"
                          >
                            {group.title}
                          </a>
                          <Tooltip
                            className="react-too"
                            anchorSelect="#clickable"
                            openOnClick="true"
                            clickable
                          >
                            <button
                              onClick={() => {
                                if (resource) {
                                  navigate('/resourceProfile', { state: resource })
                                }

                              }}

                            >
                              Profile
                            </button>{" "}
                            <button
                              onClick={() => {
                                setactivityhistory(true);

                              }}
                            >
                              History
                            </button>
                          </Tooltip>
                        </span>
                        <p className="tip">{group.tip}</p>
                        {group.rightTitle && (
                          <div className="right-sidebar">{group.rightTitle}</div>
                        )}
                      </div>
                    );
                  }}
                >
                  <TimelineHeaders>
                    <SidebarHeader className="sidebar">
                      {({ getRootProps }) => {
                        return (
                          <div className="timeline" {...getRootProps()}>
                            <div>
                              <h5 style={{ color: "white" }}>
                                Resource Name <sup><Badge>{groups.length}</Badge></sup>
                              </h5>
                            </div>
                          </div>
                        );
                      }}
                    </SidebarHeader>
                    <DateHeader unit="primaryHeader" />
                    <DateHeader />
                  </TimelineHeaders>
                </Timeline>
                <div
                  className="pagination mt-3"
                  style={{ justifyContent: "space-between" }}
                >
                  <Button
                    disabled={currentPage === 1}
                    onClick={() => paginate(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    disabled={indexOfLastItem >= groups.length}
                    onClick={() => paginate(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </>
            }
            {
              ((items.length == 0 || groups.length == 0) &&
                <>
                  <Timeline
                    groups={nullgroup}
                    items={nullitem}
                    defaultTimeStart={today}
                    defaultTimeEnd={oneYearFromNow}
                    itemRenderer={({
                      item,
                      itemContext,
                      getItemProps,
                      getResizeProps,
                    }) => {
                      const { left: leftResizeProps, right: rightResizeProps } =
                        getResizeProps();
                      return (
                        <div {...getItemProps(item.itemProps)}>
                          {itemContext.useResizeHandle ? (
                            <div {...leftResizeProps} />
                          ) : (
                            ""
                          )}
                          <div
                            className="rct-item-content"
                            style={{
                              maxHeight: `${itemContext.dimensions.height}`,
                            }}
                          >
                            {itemContext.title}
                          </div>
                          {itemContext.useResizeHandle ? (
                            <div {...rightResizeProps} />
                          ) : (
                            ""
                          )}
                        </div>
                      );
                    }}
                  >
                    <TimelineHeaders>
                      <SidebarHeader className="sidebar">
                        {({ getRootProps }) => {
                          return (
                            <div className="timeline" {...getRootProps()}>
                              <div>
                                <h5 style={{ color: "white", marginRight: "25px" }}>
                                  Resource Name <sup><Badge>{groups.length}</Badge></sup>
                                </h5>
                              </div>
                            </div>
                          );
                        }}
                      </SidebarHeader>
                      <DateHeader unit="primaryHeader" />
                      <DateHeader />
                    </TimelineHeaders>
                  </Timeline>
                  {loader &&
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '5%' }}>
                      <Spinner animation="border" variant="primary" />
                    </div>}
                </>)}

          </div>
        </div>
        {
          showFilterSideBar &&
          <FiltersSideBar
            modal={showFilterSideBar}
            setModal={setShowFilterSideBar}
            SetGroups={setGroups}
            lastAppliedFilters={lastAppliedFilters}
            setLastAppliedFilters={setLastAppliedFilters}
            onRefresh={fetchData}
            setAPI={setAPI}
            API={API}
            HandleClearFromSideBar={HandleClearFromSideBar}
            setItems={setItems}
            setLoader={setLoader}
            clearExternalFilters={clearExternalFilters}
            setCurrentPage={setCurrentPage}
          />
        }
        {
          isExpModal && <ExperienceSelectionModal setGroups={setGroups} onClose={closeExpModal} setSliderValue={setSliderValue} min_value={min_value} max_value={max_value} setMaxValue={setMaxValue} setMinValue={setMinValue} />
        }
        {activityhistory && (
          <ActivityHistory
            onClose={closeactivityhistory}
            activityid={activityid}
            name={selectedName}
          // SToast={setSToast}
          // EToast={setEToast}
          // onRefresh={fetchData}
          />
        )}
      </div >
      </div>
    </>
  );
}

export default Pmologinview;
