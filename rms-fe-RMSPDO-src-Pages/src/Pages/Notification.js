import React, { useEffect, useState } from "react";
import { Row, Col, Container, Button, Badge } from "reactstrap";
import Modal from "react-bootstrap/Modal";
import "./Model.css";
import { getReq, putReq } from "../Api/api";
import { useSelector } from "react-redux";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useDispatch } from "react-redux";
import { changestate } from "../Store/reducers/Statusstore";

const Notification = (props) => {
  const url = process.env.REACT_APP_URL;
  const dispatch = useDispatch();
  const status = useSelector((state) => state?.newStore.indication)
  const [isModalOpen, setModalOpen] = useState(true);
  const select = useSelector((state) => state?.login?.tasks);
  const [notificationData, setNotificationData] = useState([]);
  const [clickedItemIndex, setClickedItemIndex] = useState();
  const [clickedinfoItemIndex, setClickedinfoItemIndex] = useState();
  const [allocationNotification, setAllocationNotification] = useState([]);
  const [softBlockNoification, setSoftBlockNotification] = useState([]);
  const [deAllocationNotification, setDeAllocationNotification] = useState([]);
  const [info, setInfo] = useState(false);
  const [reject, setreject] = useState(false);
  const [errors, setErrors] = useState({});
  const [feedbackText, setFeedbackText] = useState("");
  // console.log(useSelector((state) => state?.newStore))
  const handleAccept = (notificationData, item, on) => {


    // console.log(item.SilId);
    const hasRequestedSoftBlock = (notificationData?.filter(
      (process) =>
        process?.ProcessStatus === "SoftBlocked" && process?.SilId == item.SilId
    )).length

    if (hasRequestedSoftBlock >= 2) {
      props.setEToast("Resource is already softBlock");
      // console.log("SoftBlock ------------------------");
    } else {
      // console.log(item?.ProcessStatus, on, item.Id);
      let newStatus = "";
      if (item?.ProcessStatus === "SoftBlock Requested") {
        newStatus = on ? "SoftBlocked" : "SoftBlock Rejected";
      } else if (item?.ProcessStatus === "Allocation Requested") {
        newStatus = on ? "Allocated" : "Allocation Rejected";
      } else if (item?.ProcessStatus === "De-Allocation Requested") {
        newStatus = on ? "Deallocated" : "De-Allocation Rejected";
      }
      // console.log(newStatus);
      // console.log(feedbackText);
      if (newStatus) {

        putReq(`${url}ResourceAllocProcess/update/${item.Id}`, {
          projectCode: item.ProjectCode,
          updatedBy: select[0].employeeId,
          processStatus: newStatus,
          feedback: feedbackText,
        }).then((response) => {
          if (response.data) {
           
            if (newStatus === "SoftBlocked") {
              props.setSToast(`Resource Softblock request approved successfully`);
            }
            else if (newStatus === "Allocated") {
              props.setSToast(`Resource  Allocation request approved successfully`);
            }
            else if (newStatus === "Allocation Requested") {
              props.setSToast(`Resource  Allocation request approved successfully`);
            }
            else if (newStatus === "SoftBlock Rejected") {
              props.setSToast(`You have successfully rejected the SoftBlock request`);
            }
            else if (newStatus === "Allocation Rejected") {
              props.setSToast(`You have successfully rejected the Allocation request`);
            }
            else if (newStatus === "De-Allocation Rejected") {
              props.setSToast(`You have successfully rejected the De-Allocation request`);
            }
            else {
              props.setSToast(`Resource  De-Allocation request approved successfully`);
            }
            props.onRefresh();
            props.onClose();
          } else {
            props.setEToast("Resource failed");
          }
        });
      }
    }
    dispatch(changestate())
    // console.log(status)
  };

  const handleFeedbackSubmit = (item) => {
    const errors = {};
    // console.log("Feedback submitted:", feedbackText);
    if (feedbackText.trim() === "") {
      errors["text"] = 'Enter the feedback';
      setErrors(errors);
    }
    else {
      handleAccept(notificationData, item, false);
      setClickedItemIndex();
      setErrors({});
    }
  };

  const getNotifications = async () => {
    try {
      const response = await getReq(`${url}ResourceAllocProcess/getlistusers`);
      // console.log(response.data);
      if (response && response.data) {
        const filteredAllocationData = response.data.filter(item =>
          item?.ProcessStatus === "Allocated" ||
          item?.ProcessStatus === "Allocation Requested" ||
          item?.ProcessStatus === "Allocation Rejected"
        );
        if (filteredAllocationData.length > 0) {
          filteredAllocationData.sort((a, b) => {
            const dateA = new Date(a.updateddate || a.createddate);
            const dateB = new Date(b.updateddate || b.createddate);
            return dateB - dateA;
          });
          setAllocationNotification(filteredAllocationData);
        } else {
          setAllocationNotification([]);
        }
        // console.log("filteredAllocationData", filteredAllocationData);

        const filteredSoftBlockData = response.data.filter(item =>
          item?.ProcessStatus === "SoftBlocked" ||
          item?.ProcessStatus === "SoftBlock Rejected" ||
          item?.ProcessStatus === "SoftBlock Requested"
        );
        if (filteredSoftBlockData.length > 0) {
          filteredSoftBlockData.sort((a, b) => {
            const dateA = new Date(a.updateddate || a.createddate);
            const dateB = new Date(b.updateddate || b.createddate);
            return dateB - dateA;
          });
          setSoftBlockNotification(filteredSoftBlockData);
        } else {
          setSoftBlockNotification([]);
        }
        // console.log("filteredAllocationData", filteredSoftBlockData);

        const filteredDeAllocationkData = response.data.filter(item =>
          item?.ProcessStatus === "De-Allocated" ||
          item?.ProcessStatus === "De-Allocation Rejected" ||
          item?.ProcessStatus === "De-Allocation Requested"
        );
        if (filteredDeAllocationkData.length > 0) {
          filteredDeAllocationkData.sort((a, b) => {
            const dateA = new Date(a.updateddate || a.createddate);
            const dateB = new Date(b.updateddate || b.createddate);
            return dateB - dateA;
          });
          setDeAllocationNotification(filteredDeAllocationkData);
        } else {
          setDeAllocationNotification([]);
        }
        // console.log("filteredAllocationData", filteredDeAllocationkData);
        if (response.data.length > 0) {
          response.data.sort((a, b) => {
            const dateA = new Date(a.updateddate || a.createddate);
            const dateB = new Date(b.updateddate || b.createddate);
            return dateB - dateA;
          });
          // console.log(response.data)
          setNotificationData(response.data);
        } else {
          setNotificationData([]);
        }


      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    getNotifications();
    // console.log(select[0]?.empRoleName);
  }, []);

  function getTimeDifference(createdDate) {
    const currentDate = new Date();
    const difference = currentDate - new Date(createdDate);
    const minutesDifference = Math.floor(difference / 60000);

    if (minutesDifference < 60) {
      return `${minutesDifference} min ago`;
    } else if (minutesDifference < 1440) { // less than 24 hours
      const hoursDifference = Math.floor(minutesDifference / 60);
      return `${hoursDifference} hours ago`;
    } else {
      const daysDifference = Math.floor(minutesDifference / 1440);
      return `${daysDifference} days ago`;
    }
  }

  return (
    <div className="App">
      <Modal show={isModalOpen} onHide={() => props.onClose()} centered>
        <Modal.Header closeButton>
          <div className="notification_header d-flex">
            <h4>Notification Center</h4>
          </div>
        </Modal.Header>
        <Modal.Body>
          <Tabs
            defaultActiveKey="All"
            id="fill-tab-example"
            className="mb-3"
            fill
          >
            <Tab eventKey="All" title="All">
              {notificationData?.map((item, index) => (
                <Container
                  key={index}
                  fluid
                  // className="m-1"
                  className={item.PmoReadStatus || item.RmReadStatus ? "bg-white bold" : "bg-secondary bg-opacity-10"}
                  style={{
                    borderBottom: "solid 1px",
                    paddingBottom: "3%",
                    paddingTop: "3%",

                  }}

                >
                  <div className="d-flex justify-content-between">
                    <div>
                      <Row className="notify " >
                        <Col className="col" xs={2} md={2} lg={2} style={{ width: "50px" }}>
                          <img
                            src="https://i.imgur.com/bDLhJiP.jpg"
                            width="40"
                            className="rounded-circle"
                            alt="avatar"
                          />
                        </Col>
                        <Col
                          className="col align-content-center"
                          xs={10}
                          md={10}
                          lg={10}
                          display="flex"
                          style={{
                            fontWeight: (item.PmoReadStatus || item.RmReadStatus) ? 'none' : 'bold'
                          }}
                        >
                          {
                            (() => {
                              let message;
                              switch (item?.ProcessStatus) {
                                case 'Interested':
                                  message = `${item.createdByName} has expressed Interest in ${item.ResourceName}`;
                                  break;
                                case 'SoftBlocked':
                                  message = `${item.createdByName} has SoftBlocked ${item.ResourceName}`;
                                  break;
                                case 'Allocated':
                                  message = `${item.createdByName} has Allocated ${item.ResourceName}`;
                                  break;
                                case 'De-Allocated':
                                  message = `${item.createdByName} has De-Allocated ${item.ResourceName}  `;
                                  break;
                                case 'SoftBlock Rejected':
                                  message = `${item?.updatedByName} has rejected the Softblock request for ${item.ResourceName}`;
                                  break;
                                case 'Allocation Rejected':
                                  message = `${item?.updatedByName} has rejected Allocation request for ${item.ResourceName}`;
                                  break;
                                case 'De-Allocation Rejected':
                                  message = `${item?.updatedByName} has rejected De-Allocation request for ${item.ResourceName}`;
                                  break;
                                case 'SoftBlock Requested':
                                  message = `${item.createdByName} has requested a Softblock for ${item.ResourceName}`;
                                  break;
                                case 'Allocation Requested':
                                  message = `${item.createdByName} has requested an Allocation for ${item.ResourceName}`;
                                  break;
                                case 'De-Allocation Requested':
                                  message = `${item.createdByName} has requested De-Allocation for ${item.ResourceName}`;
                                  break;
                                default:
                                  message = '';
                                  break;
                              }
                              return (
                                <>
                                  {message}
                                  <div style={{ color: "orange", fontSize: '12px' }}>
                                    {(!item.updateddate) ? getTimeDifference(item?.createddate) : getTimeDifference(item?.updateddate)}
                                  </div>
                                </>
                              );
                            })()
                          }
                        </Col>
                      </Row>
                    </div>
                    <div>
                      {(select[0]?.empRoleName === "PMO Analyst" &&
                        item?.ProcessStatus === "SoftBlock Rejected") ||
                        (select[0]?.empRoleName === "Resource Manager" &&
                          item?.ProcessStatus === "Allocation Rejected") ||
                        (select[0]?.empRoleName === "Resource Manager" &&
                          item?.ProcessStatus === "De-Allocation Rejected") ? (
                        <>
                          <Button
                            className="infoBtn"
                            onClick={() => {
                              setInfo(!info);
                              setClickedinfoItemIndex(index);
                            }}
                          >
                            <i class="bi bi-eye-fill"></i>
                          </Button>
                        </>
                      ) : null}
                    </div>
                    <div>
              
                      {(select[0]?.empRoleName === "PMO Analyst" &&
                        item?.ProcessStatus === "SoftBlock Requested") ||
                        (select[0]?.empRoleName === "Resource Manager" &&
                          item?.ProcessStatus === "Allocation Requested") ||
                        (select[0]?.empRoleName === "Resource Manager" &&
                          item?.ProcessStatus === "De-Allocation Requested")
                        ? (
                          <div className="d-flex gap-1">
                            <Col>
                              <Button
                                className="infoBtn"
                                onClick={() => {
                                  setInfo(!info);
                                  setClickedinfoItemIndex(index);
                                }}
                              >
                                <i class="bi bi-eye-fill"></i>
                              </Button>
                            </Col>
                            <Col>
                              <Button
                                className="approveBtn"
                                onClick={() => {
                                  handleAccept(notificationData, item, true);
                                }}
                              >
                                {" "}
                                <i className="bi bi-check-lg"> </i>
                              </Button>
                            </Col>
                            <Col>
                              <Button
                                className="crossBtn"
                                onClick={() => {
                                  setreject(true);
                                  setClickedItemIndex(index);
                                }}
                              >
                                {" "}
                                <i className="bi bi-x-lg"></i>{" "}
                              </Button>
                            </Col>
                          </div>
                        ) : null}
                    </div>
                  </div>
                  {/* Feedback form */}

                  {reject && clickedItemIndex === index && (
                    <div style={{ padding: "2%", border: "2px solid gray" }}>
                      <div
                        className="feedback-form"
                        style={{ display: "flex", marginTop: "1%" }}
                      >
                        <div style={{ width: "30%" }}>
                          <label>Reason: </label>
                        </div>
                        <div style={{ width: "100%" }}>
                          <textarea
                            style={{ width: "100%" }}
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            placeholder="Enter your feedback..."
                          />
                          {errors["text"] && (<p style={{
                            width: '100%',
                            marginTop: '0.20rem',
                            fontSize: '0.800em',
                            color: 'var(--bs-form-invalid-color)'
                          }}>{errors["text"]}</p>
                          )}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "end",
                          gap: "1em",
                        }}
                      >
                        <Button onClick={() => handleFeedbackSubmit(item)}>
                          Submit
                        </Button>
                        <Button
                          onClick={() => {
                            setErrors({});
                            setClickedItemIndex();
                          }}
                        >
                          close
                        </Button>
                      </div>
                    </div>
                  )}
                  {info && clickedinfoItemIndex === index && (
                    <div style={{ padding: "2%" }}>
                      
                      {notificationData[index]?.ProcessStatus ===
                        "SoftBlock Requested" && (
                          <div>
                            <p>
                              SoftBlock requested <span>from</span>{" "}
                              <b>{new Date(notificationData[index].SBstartdate)?.toLocaleDateString('en-GB').replace(/\//g, '-')}</b>
                              <span> to</span>{" "}
                              <b>{new Date(notificationData[index]?.SBenddate)?.toLocaleDateString('en-GB').replace(/\//g, '-')}</b>
                              <p>Requirement Id:{" "} <b>{notificationData[index]?.RequirementID}</b></p>
                            </p>
                          </div>
                        )}
                      {(notificationData[index]?.ProcessStatus ===
                        "Allocation Requested" ||
                        notificationData[index]?.ProcessStatus ===
                        "De-Allocation Requested") && (
                          <div>
                            <p>
                              <b>Client Name:</b>{" "}
                              {notificationData[index]?.ClientName}
                            </p>
                            <p>
                              <b>Project Name:</b>{" "}
                              {notificationData[index]?.ProjectName}
                            </p>
                            <p>
                              <b>Project Dates:</b>{" "}
                              {new Date(notificationData[index].allocStartDate)?.toLocaleDateString('en-GB').replace(/\//g, '-')}{" "}
                              <b>to</b>{" "}
                              {(new Date(notificationData[index]?.allocEndDate))?.toLocaleDateString('en-GB').replace(/\//g, '-')}
                            </p>
                            <p>
                              <b>Billability:</b>{" "}
                              {notificationData[index]?.Billability}
                            </p>
                            <p>
                              <b>Requirement Id:</b>{" "}
                              {notificationData[index]?.RequirementID}
                            </p>
                            {notificationData[index]?.ProcessStatus ===
                              "De-Allocation Requested" &&
                              <p>
                                <b>Reason:</b>{" "}
                                {notificationData[index]?.DeAllocReason}
                              </p>
                            }
                          </div>
                        )}
                  
                      {(notificationData[index]?.ProcessStatus ===
                        "SoftBlock Rejected") && (
                          <div>
                            <p>
                              SoftBlock requested <span>from</span>{" "}
                              <b>{new Date(notificationData[index].SBstartdate)?.toLocaleDateString('en-GB').replace(/\//g, '-')}</b>
                              <span> to</span>{" "}
                              <b>{new Date(notificationData[index]?.SBenddate)?.toLocaleDateString('en-GB').replace(/\//g, '-')}</b>
                              <p>Requirement Id:{" "} <b>{notificationData[index]?.RequirementID}</b></p>
                            </p>
                            <p>
                              <b>Reason: </b>
                              {notificationData[index].feedback}{" "}
                            </p>
                          </div>
                        )}
                      {(
                        notificationData[index]?.ProcessStatus ===
                        "Allocation Rejected" ||
                        notificationData[index]?.ProcessStatus ===
                        "De-Allocation Rejected") && (
                          <div>
                            <p>
                              <b>Client Name:</b>{" "}
                              {allocationNotification[index]?.ClientName}
                            </p>
                            <p>
                              <b>Project Name:</b>{" "}
                              {allocationNotification[index]?.ProjectName}
                            </p>
                            <p>
                              <b>Project Dates:</b>{" "}
                              {allocationNotification[index].allocStartDate?.slice(0, 10)}{" "}
                              <b>to</b>{" "}
                              {(allocationNotification[index]?.allocEndDate?.slice(0, 10))}
                            </p>
                            <p>
                              <b>Billability:</b>{" "}
                              {notificationData[index]?.Billability}
                            </p>
                            <p>
                              <b>Requirement Id:</b>{" "}
                              {notificationData[index]?.RequirementID}
                            </p>
                            <p>
                              <b>Reason:</b>{" "}
                              {notificationData[index].feedback}{" "}
                            </p>


                          </div>
                        )}
                    </div>
                  )}
                </Container>
              ))}
            </Tab>
            <Tab eventKey="soft-block" title="Soft Block">
              {softBlockNoification.map((item, index) => (
                <Container
                  key={index}
                  fluid
                  // className="m-1"
                  className={item.PmoReadStatus || item.RmReadStatus ? "bg-white" : "bg-secondary bg-opacity-10"}
                  style={{
                    borderBottom: "solid 1px",
                    // borderBottomColor: "lightgray",
                    paddingBottom: "3%",
                    paddingTop: "3%",
                  }}
                >
                  <div className="d-flex justify-content-between">
                    <div>
                      <Row className="notify " >
                        <Col className="col" xs={2} md={2} lg={2} style={{ width: "50px" }}>
                          <img
                            src="https://i.imgur.com/bDLhJiP.jpg"
                            width="40"
                            className="rounded-circle"
                            alt="avatar"
                          />
                        </Col>
                        <Col
                          className="col align-content-center"
                          xs={10}
                          md={10}
                          lg={10}
                          display="flex"
                        >
                          {
                            (() => {
                              let message;
                              switch (item?.ProcessStatus) {

                                case 'SoftBlocked':
                                  message = `${item.createdByName} has SoftBlocked  ${item.ResourceName}`;
                                  break;

                                case 'SoftBlock Rejected':
                                  message = `${item?.updatedByName} has rejected the Softblock request for ${item.ResourceName}`;
                                  break;

                                case 'SoftBlock Requested':
                                  message = `${item.createdByName} has requested a Softblock for ${item.ResourceName}`;
                                  break;

                                default:
                                  message = '';
                                  break;
                              }
                              return (
                                <>
                                  {message}
                                  <div style={{ color: "orange", fontSize: '12px' }}>
                                    {(!item.updateddate) ? getTimeDifference(item?.createddate) : getTimeDifference(item?.updateddate)}
                                  </div>
                                </>
                              );
                            })()
                          }
                        </Col>
                      </Row>
                    </div>
                    <div>
                      {(select[0]?.empRoleName === "PMO Analyst" &&
                        item?.ProcessStatus === "SoftBlock Rejected")
                        ? (
                          <>
                            <Button
                              className="infoBtn"
                              onClick={() => {
                                setInfo(!info);
                                setClickedinfoItemIndex(index);
                              }}
                            >
                              <i class="bi bi-eye-fill"></i>
                            </Button>
                          </>
                        ) : null}
                    </div>
                    <div>
                      {(select[0]?.empRoleName === "PMO Analyst" &&
                        item?.ProcessStatus === "SoftBlock Requested") ? (
                        <div className="d-flex gap-1">
                          <Col>
                            <Button
                              className="infoBtn"
                              onClick={() => {
                                setInfo(!info);
                                setClickedinfoItemIndex(index);
                              }}
                            >
                              <i class="bi bi-eye-fill"></i>
                            </Button>
                          </Col>
                          <Col>
                            <Button
                              className="approveBtn"
                              onClick={() => {
                                handleAccept(softBlockNoification, item, true);
                              }}
                            >
                              {" "}
                              <i className="bi bi-check-lg"> </i>
                            </Button>
                          </Col>
                          <Col>
                            <Button
                              className="crossBtn"
                              onClick={() => {
                                setreject(true);
                                setClickedItemIndex(index);
                              }}
                            >
                              {" "}
                              <i className="bi bi-x-lg"></i>{" "}
                            </Button>
                          </Col>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  {/* Feedback form */}

                  {reject && clickedItemIndex === index && (
                    <div style={{ padding: "2%", border: "2px solid gray" }}>
                      <div
                        className="feedback-form"
                        style={{ display: "flex", marginTop: "1%" }}
                      >
                        <div style={{ width: "30%" }}>
                          <label>Reason: </label>
                        </div>
                        <div style={{ width: "100%" }}>
                          <textarea
                            style={{ width: "100%" }}
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            placeholder="Enter your feedback..."
                          />
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "end",
                          gap: "1em",
                        }}
                      >
                        <Button onClick={() => handleFeedbackSubmit(item)}>
                          Submit
                        </Button>
                        <Button
                          onClick={() => {
                            setClickedItemIndex();
                          }}
                        >
                          close
                        </Button>
                      </div>
                    </div>
                  )}
                  {info && clickedinfoItemIndex === index && (
                    <div style={{ padding: "2%" }}>
                      {softBlockNoification[index]?.ProcessStatus ===
                        "SoftBlock Requested" && (
                          <div>
                            <p>
                              SoftBlock requested <span>from</span>{" "}
                              <b>{new Date(softBlockNoification[index].SBstartdate)?.toLocaleDateString('en-GB').replace(/\//g, '-')}</b>
                              <span> to</span>{" "}
                              <b>{new Date(softBlockNoification[index]?.SBenddate)?.toLocaleDateString('en-GB').replace(/\//g, '-')}</b>
                              <p>Requirement Id:{" "} <b>{softBlockNoification[index]?.RequirementID}</b></p>
                            </p>
                          </div>
                        )}
                      {(softBlockNoification[index]?.ProcessStatus ===
                        "SoftBlock Rejected") && (
                          <div>
                            <p>
                              SoftBlock requested <span>from</span>{" "}
                              <b>{new Date(softBlockNoification[index].SBstartdate)?.toLocaleDateString('en-GB').replace(/\//g, '-')}</b>
                              <span> to</span>{" "}
                              <b>{new Date(softBlockNoification[index]?.SBenddate)?.toLocaleDateString('en-GB').replace(/\//g, '-')}</b>
                              <p>Requirement Id:{" "} <b>{notificationData[index]?.RequirementID}</b></p>
                            </p>
                            <p>
                              <b>Reason: </b>
                              {softBlockNoification[index].feedback}{" "}
                            </p>
                          </div>
                        )}

                    </div>
                  )}
                </Container>
              ))}
            </Tab>
            <Tab eventKey="Allocation" title="Allocation">
              {allocationNotification.map((item, index) => (
                <Container
                  key={index}
                  fluid
                  // className="m-1"
                  className={item.PmoReadStatus || item.RmReadStatus ? "bg-white" : "bg-secondary bg-opacity-10"}
                  style={{
                    borderBottom: "solid 1px",
                    // borderBottomColor: "lightgray",
                    paddingBottom: "3%",
                    paddingTop: "3%",
                  }}
                >
                  <div className="d-flex justify-content-between">
                    <div>
                      <Row className="notify " >
                        <Col className="col" xs={2} md={2} lg={2} style={{ width: "50px" }}>
                          <img
                            src="https://i.imgur.com/bDLhJiP.jpg"
                            width="40"
                            className="rounded-circle"
                            alt="avatar"
                          />
                        </Col>
                        <Col
                          className="col align-content-center"
                          xs={10}
                          md={10}
                          lg={10}
                          display="flex"
                        >
                          {
                            (() => {
                              let message;
                              switch (item?.ProcessStatus) {
                                case 'Allocated':
                                  message = `${item.createdByName} has Allocated ${item.ResourceName}`;
                                  break;
                                case 'Allocation Rejected':
                                  message = `${item?.updatedByName} has rejected Allocation request for ${item.ResourceName}`;
                                  break;
                                case 'Allocation Requested':
                                  message = `${item.createdByName} has requested an Allocation for ${item.ResourceName}`;
                                  break;
                                default:
                                  message = '';
                                  break;
                              }
                              return (
                                <>
                                  {message}
                                  <div style={{ color: "orange", fontSize: '12px' }}>
                                    {(!item.updateddate) ? getTimeDifference(item?.createddate) : getTimeDifference(item?.updateddate)}
                                  </div>
                                </>
                              );
                            })()
                          }
                        </Col>
                      </Row>
                    </div>
                    <div>
                      {
                        (select[0]?.empRoleName === "Resource Manager" &&
                          item?.ProcessStatus === "Allocation Rejected") ? (
                          <>
                            <Button
                              className="infoBtn"
                              onClick={() => {
                                setInfo(!info);
                                setClickedinfoItemIndex(index);
                              }}
                            >
                              <i class="bi bi-eye-fill"></i>
                            </Button>
                          </>
                        ) : null}
                    </div>
                    <div>
                      {
                        (select[0]?.empRoleName === "Resource Manager" &&
                          item?.ProcessStatus === "Allocation Requested") ? (
                          <div className="d-flex gap-1">
                            <Col>
                              <Button
                                className="infoBtn"
                                onClick={() => {
                                  setInfo(!info);
                                  setClickedinfoItemIndex(index);
                                }}
                              >
                                <i class="bi bi-eye-fill"></i>
                              </Button>
                            </Col>
                            <Col>
                              <Button
                                className="approveBtn"
                                onClick={() => {
                                  handleAccept(allocationNotification, item, true);
                                }}
                              >
                                {" "}
                                <i className="bi bi-check-lg"> </i>
                              </Button>
                            </Col>
                            <Col>
                              <Button
                                className="crossBtn"
                                onClick={() => {
                                  setreject(true);
                                  setClickedItemIndex(index);
                                }}
                              >
                                {" "}
                                <i className="bi bi-x-lg"></i>{" "}
                              </Button>
                            </Col>
                          </div>
                        ) : null}
                    </div>
                  </div>
                  {/* Feedback form */}

                  {reject && clickedItemIndex === index && (
                    <div style={{ padding: "2%", border: "2px solid gray" }}>
                      <div
                        className="feedback-form"
                        style={{ display: "flex", marginTop: "1%" }}
                      >
                        <div style={{ width: "30%" }}>
                          <label>Reason: </label>
                        </div>
                        <div style={{ width: "100%" }}>
                          <textarea
                            style={{ width: "100%" }}
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            placeholder="Enter your feedback..."
                          />
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "end",
                          gap: "1em",
                        }}
                      >
                        <Button onClick={() => handleFeedbackSubmit(item)}>
                          Submit
                        </Button>
                        <Button
                          onClick={() => {
                            setClickedItemIndex();
                          }}
                        >
                          close
                        </Button>
                      </div>
                    </div>
                  )}
                  {info && clickedinfoItemIndex === index && (
                    <div style={{ padding: "2%" }}>
                   
                      {(allocationNotification[index].ProcessStatus ===
                        "Allocation Requested") && (
                          <div>
                            <p>
                              <b>Client Name:</b>{" "}
                              {notificationData[index]?.ClientName}
                            </p>
                            <p>
                              <b>Project Name:</b>{" "}
                              {notificationData[index]?.ProjectName}
                            </p>
                            <p>
                              <b>Project Dates:</b>{" "}
                              {new Date(notificationData[index].allocStartDate)?.toLocaleDateString('en-GB').replace(/\//g, '-')}{" "}
                              <b>to</b>{" "}
                              {(new Date(notificationData[index]?.allocEndDate))?.toLocaleDateString('en-GB').replace(/\//g, '-')}
                            </p>
                            <p>
                              <b>Billability:</b>{" "}
                              {allocationNotification[index]?.Billability}
                            </p>
                            <p>
                              <b>Requirement Id:</b>{" "}
                              {allocationNotification[index]?.RequirementID}
                            </p>
                            {notificationData[index]?.ProcessStatus ===
                              "De-Allocation Requested" &&
                              <p>
                                <b>Reason:</b>{" "}
                                {notificationData[index]?.DeAllocReason}
                              </p>
                            }
                          </div>
                        )}
                      {(
                        allocationNotification[index].ProcessStatus ===
                        "Allocation Rejected") && (
                          <div>
                            <p>
                              <b>Client Name:</b>{" "}
                              {allocationNotification[index]?.ClientName}
                            </p>
                            <p>
                              <b>Project Name:</b>{" "}
                              {allocationNotification[index]?.ProjectName}
                            </p>
                            <p>
                              <b>Project Dates:</b>{" "}
                              {allocationNotification[index].allocStartDate?.slice(0, 10)}{" "}
                              <b>to</b>{" "}
                              {(allocationNotification[index]?.allocEndDate?.slice(0, 10))}
                            </p>
                            <p>
                              <b>Billability:</b>{" "}
                              {allocationNotification[index]?.Billability}
                            </p>
                            <p>
                              <b>Requirement Id:</b>{" "}
                              {allocationNotification[index]?.RequirementID}
                            </p>
                            <p>
                              <b>Reason:</b>{" "}
                              {allocationNotification[index].feedback}{" "}
                            </p>


                          </div>
                        )}
                    </div>
                  )}
                </Container>
              ))}
            </Tab>
            <Tab eventKey="deallocation" title="De Allocation">
              {deAllocationNotification.map((item, index) => (
                <Container
                  key={index}
                  fluid
                  // className="m-1"
                  className={item.PmoReadStatus || item.RmReadStatus ? "bg-white" : "bg-secondary bg-opacity-10"}
                  style={{
                    borderBottom: "solid 1px",
                    // borderBottomColor: "lightgray",
                    paddingBottom: "3%",
                    paddingTop: "3%",
                  }}
                >
                  <div className="d-flex justify-content-between">
                    <div>
                      <Row className="notify " >
                        <Col className="col" xs={2} md={2} lg={2} style={{ width: "50px" }}>
                          <img
                            src="https://i.imgur.com/bDLhJiP.jpg"
                            width="40"
                            className="rounded-circle"
                            alt="avatar"
                          />
                        </Col>
                        <Col
                          className="col align-content-center"
                          xs={10}
                          md={10}
                          lg={10}
                          display="flex"
                        >
                          {
                            (() => {
                              let message;
                              switch (item?.ProcessStatus) {

                                case 'De-Allocated':
                                  message = `${item?.updatedByName} has De-Allocated ${item.ResourceName}`;
                                  break;

                                case 'De-Allocation Rejected':
                                  message = `${item?.updatedByName} has rejected the De-Allocation request for ${item.ResourceName}`;
                                  break;

                                case 'De-Allocation Requested':
                                  message = `${item.createdByName} has requested a De-Allocation  request for ${item.ResourceName}`;
                                  break;

                                default:
                                  message = '';
                                  break;
                              }
                              return (
                                <>
                                  {message}
                                  <div style={{ color: "orange", fontSize: '12px' }}>
                                    {(!item.updateddate) ? getTimeDifference(item?.createddate) : getTimeDifference(item?.updateddate)}
                                  </div>
                                </>
                              );
                            })()
                          }
                        </Col>
                      </Row>
                    </div>
                    <div>
                      {(select[0]?.empRoleName === "Resource Manager" &&
                        item?.ProcessStatus === "De-Allocation Rejected")
                        ? (
                          <>
                            <Button
                              className="infoBtn"
                              onClick={() => {
                                setInfo(!info);
                                setClickedinfoItemIndex(index);
                              }}
                            >
                              <i class="bi bi-eye-fill"></i>
                            </Button>
                          </>
                        ) : null}
                    </div>
                    <div>
                      {(select[0]?.empRoleName === "Resource Manager" &&
                        item?.ProcessStatus === "De-Allocation Requested") ? (
                        <div className="d-flex gap-1">
                          <Col>
                            <Button
                              className="infoBtn"
                              onClick={() => {
                                setInfo(!info);
                                setClickedinfoItemIndex(index);
                              }}
                            >
                              <i class="bi bi-eye-fill"></i>
                            </Button>
                          </Col>
                          <Col>
                            <Button
                              className="approveBtn"
                              onClick={() => {
                                handleAccept(deAllocationNotification, item, true);
                              }}
                            >
                              {" "}
                              <i className="bi bi-check-lg"> </i>
                            </Button>
                          </Col>
                          <Col>
                            <Button
                              className="crossBtn"
                              onClick={() => {
                                setreject(true);
                                setClickedItemIndex(index);
                              }}
                            >
                              {" "}
                              <i className="bi bi-x-lg"></i>{" "}
                            </Button>
                          </Col>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  {/* Feedback form */}

                  {reject && clickedItemIndex === index && (
                    <div style={{ padding: "2%", border: "2px solid gray" }}>
                      <div
                        className="feedback-form"
                        style={{ display: "flex", marginTop: "1%" }}
                      >
                        <div style={{ width: "30%" }}>
                          <label>Reason: </label>
                        </div>
                        <div style={{ width: "100%" }}>
                          <textarea
                            style={{ width: "100%" }}
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            placeholder="Enter your feedback..."
                          />
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "end",
                          gap: "1em",
                        }}
                      >
                        <Button onClick={() => handleFeedbackSubmit(item)}>
                          Submit
                        </Button>
                        <Button
                          onClick={() => {
                            setClickedItemIndex();
                          }}
                        >
                          close
                        </Button>
                      </div>
                    </div>
                  )}
                  {info && clickedinfoItemIndex === index && (
                    <div style={{ padding: "2%" }}>
                      {(
                        deAllocationNotification[index].ProcessStatus ===
                        "De-Allocation Requested") && (
                          <div>
                            <p>
                              <b>Client Name:</b>{" "}
                              {deAllocationNotification[index]?.ClientName}
                            </p>
                            <p>
                              <b>Project Name:</b>{" "}
                              {deAllocationNotification[index]?.ProjectName}
                            </p>
                            <p>
                              <b>Project Dates:</b>{" "}
                              {new Date(deAllocationNotification[index].allocStartDate)?.toLocaleDateString('en-GB').replace(/\//g, '-')}{" "}
                              <b>to</b>{" "}
                              {(new Date(deAllocationNotification[index]?.allocEndDate))?.toLocaleDateString('en-GB').replace(/\//g, '-')}
                            </p>
                            <p>
                              <b>Billability:</b>{" "}
                              {deAllocationNotification[index]?.Billability}
                            </p>
                            <p>
                              <b>Requirement Id:</b>{" "}
                              {deAllocationNotification[index]?.RequirementID}
                            </p>
                            {deAllocationNotification[index].ProcessStatus ===
                              "De-Allocation Requested" &&
                              <p>
                                <b>Reason:</b>{" "}
                                {deAllocationNotification[index]?.DeAllocReason}
                              </p>
                            }
                          </div>
                        )}
                      {(
                        deAllocationNotification[index].ProcessStatus ===
                        "De-Allocation Rejected") && (
                          <div>
                            <p>
                              <b>Client Name:</b>{" "}
                              {deAllocationNotification[index]?.ClientName}
                            </p>
                            <p>
                              <b>Project Name:</b>{" "}
                              {deAllocationNotification[index]?.ProjectName}
                            </p>
                            <p>
                              <b>Project Dates:</b>{" "}
                              {deAllocationNotification[index].allocStartDate?.slice(0, 10)}{" "}
                              <b>to</b>{" "}
                              {(deAllocationNotification[index]?.allocEndDate?.slice(0, 10))}
                            </p>
                            <p>
                              <b>Billability:</b>{" "}
                              {deAllocationNotification[index]?.Billability}
                            </p>
                            <p>
                              <b>Requirement Id:</b>{" "}
                              {deAllocationNotification[index]?.RequirementID}
                            </p>
                            <p>
                              <b>Reason:</b>{" "}
                              {deAllocationNotification[index].feedback}{" "}
                            </p>


                          </div>
                        )}
                    </div>
                  )}
                </Container>
              ))}
            </Tab>
          </Tabs>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Notification;
