import React, { useState, useEffect } from "react";
import Timeline, {
  TimelineHeaders,
  SidebarHeader,
  DateHeader,
} from "react-calendar-timeline";
import "react-calendar-timeline/lib/Timeline.css";
import "../src/../CSS/Resource.css";
import "bootstrap/dist/css/bootstrap.min.css";
import SoftBlock from "./SoftBlock";
import { deleteReq, getReq, postReq, putReq } from "../Api/api";
import { Button, Input, Row, Col, Badge } from "reactstrap";
import { MultiSelect } from "react-multi-select-component";
import { useSelector } from "react-redux";
import FiltersSideBar from "./FiltersSideBar";
import Allocation from "./Allocation";
import "react-tooltip/dist/react-tooltip.css";
import Toast, { handleErrorToast, handleSuccessToast } from "./Toast";
import { Tooltip } from "react-tooltip";
import ActivityHistory from "./ActivityHistory";
import ExperienceSelectionModal from "./ExperienceSelectionModal";
import containerResizeDetector from "react-calendar-timeline/lib/resize-detector/container";
import Deallocation from "./Deallocation";
import { Navigate, json, useNavigate } from "react-router";
import { FcClearFilters } from "react-icons/fc";
import Spinner from "react-bootstrap/Spinner";
import { useDispatch } from "react-redux";
import { changecount } from "../Store/reducers/Statusstore";

function Resource(props) {
  // console.log(props)
  const dispatch = useDispatch();
  const url = process.env.REACT_APP_URL;
  const navigate = useNavigate();
  const status = useSelector((state) => state?.newStore.indication)

  // console.log(useSelector((state) => state.newStore))
  const [loader, setLoader] = useState(true);
  const [isDeallocaion, setIsDeallocation] = useState(false);
  const [isSoftBlockOpen, setSoftBlockOpen] = useState(false);
  const [isResourceBlockOpen, setisResourceBlockOpen] = useState(false);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [selectedResourceName, setSelectedResourceName] = useState("");
  const [EmployeeRow, setEmployeeRow] = useState();
  const [input, setInput] = useState("");
  const [isInterestedOpen, setisInterestedOpen] = useState(false);
  const [updateRejected, setUpdateRejected] = useState(false);
  const [rejectedGroup, setRejectedGroup] = useState();
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState([]);
  const [skills, setSkills] = useState([]);
  const [place, setPlace] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [showFilterSideBar, setShowFilterSideBar] = useState(false);
  const [resourceStatus, setResourceStatus] = useState([]);
  const [skillOptions, setSkillOptions] = useState();
  const [locationOptions, setlocationOptions] = useState();
  const [activityhistory, setactivityhistory] = useState(false);
  const [activityid, setactivityid] = useState();
  const [selectedName, setselectedName] = useState("");
  const [itemid, setItemid] = useState();
  const [isExpModal, setExpModal] = useState(false);
  const [nullgroup, setNullgroup] = useState([]);
  const [nullitem, setNullitem] = useState([]);
  const [ispmnotification, setPmNotification] = useState(false);
  const [notificationcount, setNotificationDataCount] = useState(0);
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
  let resource = "";


  const today = new Date();
  const twoWeeksFromNow = new Date(
    new Date().setDate(new Date().getDate() + 14)
  );
  const oneYearFromNow = new Date(
    new Date().setDate(new Date().getDate() + 364)
  );
  const twoMonthsFromNow = new Date(
    new Date().setDate(new Date().getDate() + 90)
  );
  const closeInterested = () => {
    setisInterestedOpen(false);
  };
  const closeExpModal = () => {
    setExpModal(false);
  };
  const closeDeallocationModal = () => {
    // props.setindication();
    dispatch(changecount())
    setIsDeallocation(false);
  };
  const closePmNotification = () => {
    setPmNotification(false);
  };
  const closeNotification = () => {
    setNotificationOpen(false);
  };

  const closeSoftBlock = () => {
    // props.setindication();
    dispatch(changecount())
    setSoftBlockOpen(false);
  };

  const closeResource = () => {
    // props.setindication();
    dispatch(changecount())
    setisResourceBlockOpen(false);
  };

  const setSToast = (message) => {
    handleSuccessToast(message);
  };
  const setEToast = (message) => {
    handleErrorToast(message);
  };
  const closeactivityhistory = () => {
    setactivityhistory(false);
  };

  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState(groups);
  const [slidervalue, setSliderValue] = useState("Select Experience");
  const [min_value, setMinValue] = useState(lastAppliedFilters.yearsOfExp[0]);
  const [max_value, setMaxValue] = useState(lastAppliedFilters.yearsOfExp[1]);
  const [data, setData] = useState([]);
  const [minNum, setMinNum] = useState();
  const [maxNum, setMaxNum] = useState();
  const select = useSelector((state) => state?.login?.tasks);

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
  const [isProcessing, setIsProcessing] = useState(false);

  const HandleFilter = () => {
    // console.log(JSON.stringify(last), JSON.stringify(API))
    if (JSON.stringify(last) === JSON.stringify(API)) {
      // console.log(maxNum, typeof maxNum)
      if (maxNum === "Maximum Exp...." || minNum === "Minimum Exp....") {
        setEToast("Please enter a valid number for min and max experience");
      } else if (maxNum < minNum) {
        setEToast(
          "Max value of experience must be greater than or equal to min value."
        );
      } else if (maxNum > 30 || minNum < 0) {
        setEToast("Values must be between 0 and 30.");
      } else {
        setMinValue(minNum);
        setMaxValue(maxNum);
      }
    }
    else {
      setEToast("Please clear Advance Filters")
    }
  };
  const ClearFilter = () => {
    setMinValue(0);
    setMaxValue(30);
    setMinNum("Minimum Exp....");
    setMaxNum("Maximum Exp....");
  };
  const getNotificationsCount = async () => {
    try {
      const response = await getReq(`${url}ResourceAllocProcess/getlistusers`);
      if (response && response.data) {
        const res = response.data.filter(
          (obj) => obj.CreatedBy === select[0].employeeId
        );
        if (res) {
          setNotificationDataCount(res?.filter(item => item?.PmoReadStatus === false));
        } else {
          setNotificationDataCount(0);
        }
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
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


  function HandleSearchClick(searchVal) {
    if (searchVal === "") {
      setGroups(filteredGroups);
      return;
    }
    const filterBySearch = filteredGroups.filter((group) =>
      group.title.toLowerCase().includes(searchVal.toLowerCase())
    );
    setGroups(filterBySearch);
  }

  const HandleInterested = async (EmployeeRow) => {
    if (updateRejected) {
      putReq(`${url}ResourceAllocProcess/update/${rejectedGroup}`, {
        updatedBy: select[0].employeeId,
        processStatus: "Interested",
      }).then((response) => {
        if (response.data) {
          fetchData();
          setTimeout(() => { setSToast("Resource Allocation request submitted successfully."); }, 1000)
        } else {
          setEToast("Resource Allocation request failed.");
        }
      });
    }
    else {
      postReq(`${url}ResourceAllocProcess/create`, {
        createdBy: select[0].employeeId,
        processStatus: "Interested",
        resAllocId: EmployeeRow?.resource?.allocationId,
        silId: EmployeeRow?.resource?.silId,
      }).then((response) => {
        if (response.data) {
          getNotificationsCount();
          fetchData();
          setTimeout(() => { setSToast("Resource is marked as Interested successfully."); }, 1000)
        } else {
          setEToast("Failed to mark resource as Interested.");
        }
      });
    }

    // props.setindication();
    dispatch(changecount())
  };
  const [items, setItems] = useState([]);
  useEffect(() => {
    FilterApi();
  }, [skills, place, min_value, max_value, status]);

  const fetchData = async () => {
    try {
      setLoader(true);
      setCurrentPage(1)
      // console.log(API)
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
          const allocatedProcesses = item?.processes.filter(
            (process) =>
              process.processStatus === "Allocated" ||
              process.processStatus === "Allocation Extension Requested"||
              process.processStatus == "De-Allocation Requested" ||
              process.processStatus == "De-Allocation Rejected"
          );

          const isAllocated = allocatedProcesses?.length > 0;
          // console.log(isAllocated, softBlockProcesses.length);

          if (!isAllocated && softBlockProcesses.length === 0) {
            itemsData.push({
              id: item?.resource?.allocationId,
              group: item?.resource?.allocationId,
              start_time: today,
              end_time: twoMonthsFromNow,
              title: (item?.resource?.status === "Active") ? "Resource Available for Project Allocation" : "On notice",
              canResizeRight: false,
              canMove: false,
              itemProps: {
                style: { background: (item?.resource?.status === "Active") ? "green" : "grey", borderRadius: "8px" },
              },
            })
          }
          else if (isAllocated) {
            console.log(item);
            const heading=`${item?.resource?.clientCode} - ${item?.resource?.projectName}`
            const startDate = new Date(item.processes[0].allocStartDate);
            const endDate = new Date(item?.processes[0]?.allocEndDate);
            itemsData.push({
              id: item?.resource?.allocationId,
              group: item?.resource?.allocationId,
              start_time: startDate,
              end_time: endDate,
              title: heading,
              canResizeRight: false,
              canMove: false,
              itemProps: {
                style: { background: "blue", borderRadius: "8px" },
              },
            });
          }
          else {
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
              // console.log(item?.processes);
              itemsData.push({
                id: item?.resource?.allocationId + softBlockCounter / 10,
                group: item?.resource?.allocationId,
                start_time: startDate,
                end_time: endDate,
                title: `Soft Blocked`,
                canResizeRight: false,
                canMove: false,
                itemProps: {
                  style: { background: color, borderRadius: "8px" },
                },
              });
            });
          }


        });
        setGroups(groupData);
        setFilteredGroups(groupData);
        // console.log(itemsData)
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
    const data = await getReq(`${url}ResourceAllocProcess/getAll`);
    setData(data.data);
  };
  useEffect(() => {
    HandleSearchClick(input);
  }, [input]);
  let last = {
    techGroups: [],
    roles: [],
    skills: [],
    yearsOfExp: [],
    locations: [],
    domains: [],
    availability: [],
    availForeCastWeeks: null
  }
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
  const val = true;
  const handleSkillsChange = async (selectedItems) => {
    if (JSON.stringify(last) === JSON.stringify(API)) {
      setSelectedSkills(selectedItems);
      const selectedSkills = selectedItems.map((item) => item.value);
      setSkills(selectedSkills);
    }
    else {
      // console.log(last, API)
      setEToast("Please clear Advance Filters")
    }
  };
  const handlePlaceChange = async (selectedItems) => {
    if (JSON.stringify(last) === JSON.stringify(API)) {
      setSelectedPlace(selectedItems);
      const selectedSkills = selectedItems.map((item) => item.value);
      setPlace(selectedSkills);
    }
    else {
      setEToast("Please clear Advance Filters")
    }
  };
  const HandleClearFromSideBar = () => {
    setSelectedSkills([]);
    setSelectedPlace([]);
    setMinValue(0);
    setMaxValue(30);
    setSliderValue("Select Experience");

  };
  const getProcessStatus = (item) => {
    const res = item?.find((obj) => obj?.createdBy === select[0].employeeId);
    setResourceStatus(res?.processStatus);
  };
  useEffect(() => {
    fetchData();
    fetchStatus();
    getSkills();
    getLocations();
    getNotificationsCount();
    getProcessStatus();
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
    await getReq(url + "ResAlloc/getLocations").then((data) => {
      const result = data?.data?.map((item) => ({ label: item, value: item }));
      setlocationOptions(result);
    });
  };
  const rejectedparams = (getRejected) => {
    setUpdateRejected(true);
    setRejectedGroup(getRejected?.id);
  };
  const setrejectedparams = () => {
    setUpdateRejected(false);
    setRejectedGroup(null);
  };
  const UnInterest = async (data) => {

    const interestedProcess = data?.group?.item?.processes?.find(
      (process) =>
        (process?.processStatus === "Interested" ||
          process?.processStatus === "SoftBlock Rejected" ||
          process?.processStatus === "Allocation Rejected") &&
        process.createdBy === select[0]?.employeeId
    );
    if (interestedProcess) {
      const processId = interestedProcess.id;
      await deleteReq(url + `ResourceAllocProcess/delete/${processId}`);
      setTimeout(() => { setSToast("Resource UnInterested successfully"); }, 800)
      getNotificationsCount();
    } else {
      // console.log("No process found matching the criteria.");
    }
    fetchData();
    // console.log("unInterest", data);

  };
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(22);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGroups = groups?.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  return (
    <>
      <div style={{marginTop:"-2%"}}>
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
            style={{ display: 'flex' }}
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
          </Row>
        </Col>
      </Row>
      <div className="container-fluid">
        <div className="content-container" style={{ border: "2px" }}>
          <div className="timeline-container">
           
            {items?.length > 0 && groups?.length > 0 && (
              <>
                {loader && <div className="backdrop"><Spinner animation="border" variant="primary" /></div>}
                <Timeline
                  resizeDetector={containerResizeDetector}
                  groups={currentGroups}
                  items={items}
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
                          {item.title}
                        </div>
                        {itemContext.useResizeHandle ? (
                          <div {...rightResizeProps} />
                        ) : (
                          ""
                        )}
                      </div>
                    );
                  }}
                  groupRenderer={({ group, index }) => {
                    const hasShownInterest = group?.item?.processes?.some(
                      (process) =>
                        process?.processStatus &&
                        process.createdBy === select[0]?.employeeId
                    );
                    const benchExit = group?.item?.resource?.status == "Active";
                    const hasRequestedSoftBlock = group?.item?.processes?.some(
                      (process) =>
                        process?.processStatus === "Interested" &&
                        process.createdBy === select[0]?.employeeId
                    );
                    const hasRequest = group?.item?.processes?.some(
                      (process) =>
                        (process?.processStatus === "Interested" ||
                          process?.processStatus === "SoftBlock Rejected" ||
                          process?.processStatus === "Allocation Rejected") &&
                        process.createdBy === select[0]?.employeeId
                    );
                    const softBlockedProcesses = group?.item?.processes?.filter(process => process?.processStatus === "SoftBlocked");
                    const AllocationProcesses = group?.item?.processes?.filter(process => process?.processStatus === "Allocation Requested");



                    const hasRejectedSoftBlock = group?.item?.processes?.some(
                      (process) =>
                        process?.processStatus === "SoftBlock Rejected" &&
                        process.createdBy === select[0]?.employeeId
                    );
                    const hasAllocationRejected = group?.item?.processes?.some(
                      (process) =>
                        process?.processStatus === "Allocation Rejected" &&
                        process.createdBy === select[0]?.employeeId
                    );
                    const hasRejections = group?.item?.processes?.some(
                      (process) =>
                        (process?.processStatus === "SoftBlock Rejected" ||
                          process?.processStatus === "Allocation Rejected") &&
                        process.createdBy === select[0]?.employeeId
                    );
                    const hasRequestedAllocation = group?.item?.processes?.some(
                      (process) =>
                        process?.processStatus === "SoftBlocked" &&
                        process.createdBy === select[0]?.employeeId
                    );
                    const isSoftBlocked = group?.item?.processes?.some(
                      (process) =>
                        (process?.processStatus === "SoftBlocked" ||
                          process?.processStatus === "SoftBlock Requested" || process?.processStatus === "Allocation Requested") &&
                        process.createdBy === select[0]?.employeeId
                    );
                    const isAllocated = group?.item?.processes?.some(
                      (process) =>
                        (process?.processStatus === "Allocated" ||
                          process?.processStatus === "Allocation Extension Requested" ||
                          process?.processStatus === "De-Allocation Requested" ||
                          process?.processStatus === "Allocation Requested") &&
                        process.createdBy === select[0]?.employeeId
                    );
                    const getRejected = group?.item?.processes?.find(
                      (process) =>
                        (process?.processStatus === "SoftBlock Rejected" ||
                          process?.processStatus === "Allocation Rejected") &&
                        process.createdBy === select[0]?.employeeId
                    );
                    const showfilled = group?.item?.processes?.some(
                      (process) =>
                      ((process?.processStatus === "Allocated" ||
                        process?.processStatus === "Allocation Requested" ||
                        process?.processStatus === "SoftBlocked" ||
                        process?.processStatus === "Allocation Extension Requested" ||
                        process?.processStatus ===
                        "De-Allocation Rejected" || process?.processStatus ===
                        "De-Allocation Requested") && (softBlockedProcesses.length > 1) &&
                        process.createdBy !== select[0]?.employeeId)
                    );
                    const showfilled1 = group?.item?.processes?.some(
                      (process) =>
                      (process?.processStatus === "Allocated" ||
                        process?.processStatus === "Allocation Extension Requested" ||
                        process?.processStatus ===
                        "De-Allocation Rejected" || process?.processStatus ===
                        "De-Allocation Requested")
                    );
                    const showfilled2 = group?.item?.processes?.some(
                      (process) =>
                      ((process?.processStatus === "Allocated" ||
                        process?.processStatus === "Allocation Extension Requested" ||
                        process?.processStatus === "Allocation Requested" ||
                        process?.processStatus ===
                        "De-Allocation Rejected" || process?.processStatus ===
                        "De-Allocation Requested") && ((softBlockedProcesses.length > 1) || (AllocationProcesses.length > 1) || (softBlockedProcesses.length === 1 || AllocationProcesses.length === 1)))
                    );

                    return (
                      <div className="custom-group">
                        <div
                          className="title"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <div
                            className="titleDiv"
                            style={{ textAlign: "left", overflowX: "hidden" }}
                          >
                            <a
                              id="clickable"
                              data-tooltip-place="right-end"
                              data-tooltip-position-strategy="fixed"
                              onClick={() => {
                                resource = group?.item?.resource;
                                setactivityid(
                                  group?.item?.resource?.allocationId
                                );
                                setselectedName(group?.title);
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
                                    navigate("/resourceProfile", {
                                      state: resource,
                                    });
                                  }
                                }}
                              >
                                Profile
                              </button>
                              <button
                                onClick={() => {
                                  setactivityhistory(true);
                                }}
                              >
                                History
                              </button>
                            </Tooltip>
                          </div>

                          <div style={{ display: "flex", marginRight: "30px" }}>
                            {showfilled ||
                              hasShownInterest || showfilled1 || showfilled2 ||
                              isSoftBlocked ||
                              isAllocated || !benchExit ? (
                              hasShownInterest &&
                                (hasRequestedSoftBlock ||
                                  hasRejectedSoftBlock ||
                                  hasAllocationRejected ||
                                  showfilled && (softBlockedProcesses.length < 2)) && (benchExit) ? (
                                <i
                                  className="bi bi-hand-thumbs-up-fill green-fill"
                                  id="icon"
                                  title="Interest"
                                  onClick={() => { UnInterest({ group }) }}
                                />
                              ) : (
                                <i
                                  className="bi bi-hand-thumbs-up-fill"
                                  id="icon"
                                  title="Interest"
                                  // onClick={() => // console.log(showfilled, hasShownInterest, isSoftBlocked, isAllocated)}
                                />
                              )
                            ) : (
                              <i
                                id="icon"
                                title="Interest"
                                className={`bi bi-hand-thumbs-up${isProcessing ? ' processing' : ''}`}
                                onClick={() => {
                                  if (hasRejections) {
                                    rejectedparams(getRejected);
                                  } else {
                                    setrejectedparams();
                                  }
                                  setSelectedResourceName(group.title);
                                  HandleInterested(group.item);
                                }}
                              />
                            )}
                            {(((!hasRequest) && (!hasAllocationRejected) && !(softBlockedProcesses.length <= 1)) ||
                              (isSoftBlocked) || (!hasShownInterest) || (showfilled) || (showfilled1) || (showfilled2)) ? (
                              isAllocated || isSoftBlocked || showfilled || showfilled1 || showfilled2 || !benchExit ? (
                                <div style={{ marginLeft: "20%" }}>
                                  <i
                                    class="bi bi-person-fill-lock"
                                    id="icon"
                                    title="Softblock"
                                    // onClick={() => {
                                    //   // console.log(
                                    //     hasRequest,
                                    //     hasAllocationRejected,
                                    //     isSoftBlocked,
                                    //     softBlockedProcesses.length
                                    //   );
                                    // }}
                                  ></i>
                                </div>
                              ) : (
                                <div style={{ marginLeft: "20%" }}>
                                  <i
                                    class="bi bi-person-lock"
                                    id="icon"
                                    title="Softblock"
                                    // onClick={() => {
                                    //   // console.log(
                                    //     hasRequest,
                                    //     hasAllocationRejected,
                                    //     isSoftBlocked,
                                    //     softBlockedProcesses.length,
                                    //     showfilled
                                    //   );
                                    // }
                                  // }
                                  ></i>
                                </div>
                              )
                            ) : (
                              <div style={{ marginLeft: "20%" }}>
                                <i
                                  className="bi bi-person-lock"
                                  id="icon"
                                  title="Softblock"
                                  onClick={() => {
                                    setSoftBlockOpen(true);
                                    setEmployeeRow(group.item);
                                  }}
                                ></i>
                              </div>
                            )}
                            {!hasRequestedAllocation || hasRejections ? (
                              isAllocated || showfilled || showfilled1 || showfilled2 || !benchExit ? (
                                <div style={{ marginLeft: "20%" }}>
                                  <i
                                    className="bi bi-person-fill-add"
                                    id="icon"
                                    title="Allocation"
                                  />
                                </div>
                              ) : (
                                <div style={{ marginLeft: "20%" }}>
                                  <i
                                    className="bi bi-person-add"
                                    id="icon"
                                    title="Allocation"
                                  />
                                </div>
                              )
                            ) : (
                              <div style={{ marginLeft: "20%" }}>
                                <i
                                  className="bi bi-person-add"
                                  id="icon"
                                  title="Allocation"
                                  onClick={() => {
                                    setisResourceBlockOpen(true);
                                    setEmployeeRow(group.item);
                                  }}
                                ></i>
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="tip">{group.tip}</p>
                        {group.rightTitle && (
                          <div className="right-sidebar">
                            {group.rightTitle}
                          </div>
                        )}
                      </div>
                    );
                  }}
                  onItemClick={(itemId) => {
                    const selectedItem = items.find(
                      (item) => item.id === itemId
                    );
                    // console.log(itemId);

                    const res = groups?.find((obj) => obj?.id === itemId);
                    const result = res?.item?.processes?.find(
                      (obj) =>
                        obj.createdBy === select[0].employeeId &&
                        (obj.processStatus === "Allocated" ||
                          obj.processStatus === "De-Allocation Rejected")
                    );
                    const result1 = res?.item?.processes?.find(
                      (obj) =>
                        obj.createdBy === select[0].employeeId &&
                        obj.processStatus === "De-Allocation Requested"
                    );
                    const result2 = res?.item?.processes?.find(
                      (obj) =>
                        obj.processStatus === "Allocation Extension Requested"
                    );
                    // console.log(res, result, result1);
                    if (
                      selectedItem?.title === "Allocated" &&
                      result
                    ) {
                      setIsDeallocation(true);
                      setItemid(itemId);
                    } else if (
                      selectedItem?.title === "Allocated" &&
                      result1
                    ) {
                      setEToast("You Have Already Requested For De-Allocation");
                    }
                    else if(
                      result2
                    )
                    {
                      setEToast("Extension has already requested");
                    }
                      console.log(selectedItem?.title)
                  }}
                >
                  <TimelineHeaders>
                    <SidebarHeader className="sidebar">
                      {({ getRootProps }) => {
                        return (
                          <div className="timeline" {...getRootProps()}>
                            <div>
                              <h5 style={{ color: "white" }}>Resource Name <sup><Badge>{groups.length}</Badge></sup></h5>
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
                    disabled={indexOfLastItem >= groups?.length}
                    onClick={() => paginate(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
            {(items?.length == 0 || groups?.length == 0) && (
              <>

                <Timeline
                  resizeDetector={containerResizeDetector}
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
                              <h5
                                style={{ color: "white", marginRight: "25px" }}
                              >
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
                {loader && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: "5%",
                    }}
                  >
                    <Spinner animation="border" variant="primary" />
                  </div>
                )}

              </>
            )}
          </div>
        </div>
        {isSoftBlockOpen && (
          <SoftBlock
            onClose={closeSoftBlock}
            EmployeeRow={EmployeeRow}
            onRefresh={fetchData}
            SToast={setSToast}
            EToast={setEToast}

          />
        )}
        {isResourceBlockOpen && (
          <Allocation
            onClose={closeResource}
            EmployeeRow={EmployeeRow}
            SToast={setSToast}
            EToast={setEToast}
            onRefresh={fetchData}
          />
        )}
        {showFilterSideBar && (
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
        )}
        {activityhistory && (
          <ActivityHistory
            onClose={closeactivityhistory}
            activityid={activityid}
            name={selectedName}
          />
        )}
        {isExpModal && (
          <ExperienceSelectionModal
            setGroups={setGroups}
            onClose={closeExpModal}
            setSliderValue={setSliderValue}
            min_value={min_value}
            max_value={max_value}
            setMaxValue={setMaxValue}
            setMinValue={setMinValue}
            HandleClearFromSideBar={HandleClearFromSideBar}
          />
        )}
        {isDeallocaion && (
          <Deallocation
            onClose={closeDeallocationModal}
            groups={groups}
            ItemId={itemid}
            onRefresh={fetchData}
            EToast={setEToast}
            SToast={setSToast}
          />
        )}
      </div>
      </div>
    </>
  );
}
export default Resource;
