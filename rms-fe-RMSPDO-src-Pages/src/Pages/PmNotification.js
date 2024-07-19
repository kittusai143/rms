import React, { useEffect, useState } from "react";
import { Row, Col, Container, Button, Badge } from "reactstrap";
import Modal from "react-bootstrap/Modal";
import "./Model.css";
import { getReq, putReq } from "../Api/api";
import { useSelector } from "react-redux";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

const PmNotification = (props) => {
  const [isModalOpen, setModalOpen] = useState(true);
  const select = useSelector((state) => state?.login?.tasks);
  const [notificationData, setNotificationData] = useState([]);
  const [info, setInfo] = useState();
  const [clickedinfoItemIndex, setClickedinfoItemIndex] = useState();
  const [allocationNotification, setAllocationNotification] = useState([]);
  const [softBlockNoification, setSoftBlockNotification] = useState([]);
  const [deAllocationNotification, setDeAllocationNotification] = useState([]);

  const url = process.env.REACT_APP_URL;
  // console.log(notificationData);

  const getNotifications = async () => {
    try {
      const response = await getReq(`${url}ResourceAllocProcess/getlistusers`);
      if (response && response.data) {
        const filteredData = response.data.filter(
          (obj) => obj.CreatedBy === select[0].employeeId
        );
        if (filteredData.length > 0) {
          filteredData.sort((a, b) => {
            const dateA = new Date(a.updateddate || a.createddate);
            const dateB = new Date(b.updateddate || b.createddate);
            return dateA - dateB;
          });
          setNotificationData(filteredData);
          // console.log(filteredData)
        } else {
          setNotificationData([]);
        }
        // console.log(response.data, select[0].employeeId)
        // const filteredData = response.data.filter(
        //   (obj) => obj.CreatedBy === select[0].employeeId
        // );
        // if (filteredData > 0) {
        //   filteredData.sort((a, b) => {
        //     const dateA = new Date(a.updateddate || a.createddate);
        //     const dateB = new Date(b.updateddate || b.createddate);
        //     return dateB - dateA; 
        //   });
        //   setNotificationData(filteredData);
        // } else {
        //   setNotificationData([]);
        // }
        const filteredAllocationData = response.data.filter(item =>
          (item.CreatedBy === select[0].employeeId) && (
            item?.ProcessStatus === "Allocated" ||
            item?.ProcessStatus === "Allocation Requested" ||
            item?.ProcessStatus === "Allocation Rejected" ||
            item?.ProcessStatus === "Allocated" ||
            item?.ProcessStatus === "Allocation Requested" ||
            item?.ProcessStatus === "Allocation Rejected")
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
        // console.log("filteredData", filteredData, response.data);

        const filteredSoftBlockData = response.data.filter(
          (obj) => (obj.CreatedBy === select[0].employeeId) && (
            obj?.ProcessStatus === "SoftBlocked" ||
            obj?.ProcessStatus === "SoftBlock Rejected" ||
            obj?.ProcessStatus === "SoftBlock Requested")
        );
        // console.log("hiii", filteredSoftBlockData)
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
        // console.log("filteredData", filteredSoftBlockData);

        const filteredDeAllocationkData = response.data.filter(item =>
          (item.CreatedBy === select[0].employeeId) &&
          (item?.ProcessStatus === "De-Allocated" ||
            item?.ProcessStatus === "De-Allocation Rejected" ||
            item?.ProcessStatus === "De-Allocation Requested")
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
        // console.log("filteredData", filteredDeAllocationkData);

      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };


  useEffect(() => {
    // console.log("hello");
    getNotifications();
    const count = notificationData.filter(item => item.PmReadStatus === false).length;
    // console.log(count, notificationData)
  }, []);
  function getTimeDifference(date) {
    const currentDate = new Date();
    const difference = currentDate - new Date(date);
    const minutesDifference = Math.floor(difference / 60000);

    if (minutesDifference < 60) {
      return `${minutesDifference} min ago`;
    } else if (minutesDifference < 1440) {
      // less than 24 hours
      const hoursDifference = Math.floor(minutesDifference / 60);
      return `${hoursDifference} hours ago`;
    } else {
      const daysDifference = Math.floor(minutesDifference / 1440);
      return `${daysDifference} days ago`;
    }
  }

  return (
    <>
      <div className="App">
        <Modal show={isModalOpen} onHide={() => props.onClose()} centered>
          <Modal.Header closeButton>
            <div className="notification_header d-flex">
              <h4>Notification Center</h4>
            </div>
          </Modal.Header>
          <Modal.Body>
            <Tabs defaultActiveKey="All"
              id="fill-tab-example"
              className="mb-3"
              fill>
              <Tab eventKey="All" title="All">
                {notificationData
                  .slice()
                  .reverse().map((item, index) => (
                    <Container
                      key={index}
                      fluid
                      // className="m-1"
                      className={item.PmReadStatus ? "bg-white" : "bg-secondary bg-opacity-10"}
                      style={{
                        borderBottom: "solid 1px",
                        borderBottomColor: "lightgray",
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
                              style={{
                                fontWeight: (item.PmReadStatus) ? 'none' : 'bold'
                              }}
                            >
                              {
                                (() => {
                                  let message;
                                  switch (item?.ProcessStatus) {
                                    case 'Interested':
                                      message = `You have expressed Interest in ${item.ResourceName}`;
                                      break;
                                    case 'SoftBlocked':
                                      message = `${item.createdByName} has SoftBlocked  ${item.ResourceName}`;
                                      break;
                                    case 'Allocated':
                                      message = `${item.createdByName} has Allocated  ${item.ResourceName}`;
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
                                      message = `You have requested a Softblock for ${item.ResourceName}`;
                                      break;
                                    case 'Allocation Requested':
                                      message = `You have requested an Allocation for ${item.ResourceName}`;
                                      break;
                                    case 'De-Allocation Requested':
                                      message = `You have requested De-Allocation for ${item.ResourceName}`;
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
                          {(select[0]?.empRoleName === "Manager" &&
                            item?.ProcessStatus === "SoftBlock Rejected") ||
                            (select[0]?.empRoleName === "Manager" &&
                              item?.ProcessStatus === "SoftBlock Requested") ||
                            (select[0]?.empRoleName === "Manager" &&
                              item?.ProcessStatus === "Allocation Rejected") ||
                            (select[0]?.empRoleName === "Manager" &&
                              item?.ProcessStatus === "Allocation Rejected") ||
                              (select[0]?.empRoleName === "Manager" &&
                              item?.ProcessStatus === "Allocation Requested")||
                            (select[0]?.empRoleName === "Manager" &&
                              item?.ProcessStatus ===
                              "De-Allocation Rejected")||
                              (select[0]?.empRoleName === "Manager" &&
                              item?.ProcessStatus ===
                              "De-Allocation Requested")
                            ? (
                              <>
                                <Button
                                  className="infoBtn"
                                  onClick={() => {
                                    // console.log(notificationData[notificationData.length - index - 1])
                                    setInfo(!info);
                                    setClickedinfoItemIndex(notificationData.length - index - 1);
                                  }}
                                >
                                  <i class="bi bi-eye-fill"></i>
                                </Button>
                              </>
                            ) : null}
                        </div>
                        
                      </div>
                      {info && clickedinfoItemIndex === notificationData.length - index - 1 && (
                        <div >
                         
                          {notificationData[notificationData.length - index - 1]?.ProcessStatus ===
                            "SoftBlock Requested" && (
                              <div>
                                <p>
                                  SoftBlock requested <span>from</span>{" "}
                                  <b>{new Date(notificationData[notificationData.length - index - 1].SBstartdate)?.toLocaleDateString('en-GB').replace(/\//g, '-')}</b>
                                  <span> to</span>{" "}
                                  <b>{new Date(notificationData[notificationData.length - index - 1]?.SBenddate)?.toLocaleDateString('en-GB').replace(/\//g, '-')}</b>
                                  <p>Requirement Id:{" "} <b>{notificationData[notificationData.length - index - 1]?.RequirementID}</b></p>
                                </p>
                              </div>
                            )}
                          {notificationData[notificationData.length - index - 1]?.ProcessStatus ===
                            "Allocation Requested" && (
                              <div>
                                <p>
                                  <b>Client Name:</b>{" "}
                                  {notificationData[notificationData.length - index - 1]?.ClientName}
                                </p>
                                <p>
                                  <b>Project Name:</b>{" "}
                                  {notificationData[notificationData.length - index - 1]?.ProjectName}
                                </p>

                                <p>
                                  <b>Project Dates :</b>{" "}
                                  {notificationData[notificationData.length - index - 1].allocStartDate?.slice(0, 10)}{" "}
                                  <b>to</b>{" "}
                                  {( notificationData[notificationData.length - index - 1]?.allocEndDate?.slice(0, 10))}
                                </p>
                                <p>
                                  <b>Billability:</b>{" "}
                                  {notificationData[notificationData.length - index - 1]?.Billability}
                                </p>
                                <p>
                                  <b>Requirement Id:</b>{" "}
                                  {notificationData[notificationData.length - index - 1]?.RequirementID}
                                </p>
                              </div>
                            )}
                   
                          {(notificationData[notificationData.length - index - 1]?.ProcessStatus ===
                            "SoftBlock Rejected") && (
                              <div>
                                <p>
                                  Softblock requested <span>from</span>{" "}
                                  <b>{new Date(notificationData[notificationData.length - index - 1].SBstartdate)?.toLocaleDateString('en-GB').replace(/\//g, '-')}</b>
                                  <span> to</span>{" "}
                                  <b>{new Date(notificationData[notificationData.length - index - 1]?.SBenddate)?.toLocaleDateString('en-GB').replace(/\//g, '-')}</b>
                                  <p>Requirement Id:{" "} <b>{notificationData[notificationData.length - index - 1]?.RequirementID}</b></p>
                                </p>
                                <p>
                                  <b>Reason: </b>{" "}
                                  {notificationData[notificationData?.length - index - 1].feedback}{" "}
                                </p>
                              </div>
                            )}
                          {(
                            notificationData[notificationData.length - index - 1]?.ProcessStatus ===
                            "Allocation Rejected") && (
                              <div>
                                <p>
                                  <b>Client Name:</b>{" "}
                                  {notificationData[notificationData.length - index - 1]?.ClientName}
                                </p>
                                <p>
                                  <b>Project Name:</b>{" "}
                                  {notificationData[notificationData.length - index - 1]?.ProjectName}
                                </p>
                                <p>
                                  <b>Project Dates:</b>{" "}
                                  {notificationData[notificationData.length - index - 1].allocStartDate?.slice(0, 10)}{" "}
                                  <b>to</b>{" "}
                                  {(notificationData[notificationData.length - index - 1]?.allocEndDate?.slice(0, 10))}
                                </p>
                                <p>
                                  <b>Billability:</b>{" "}
                                  {notificationData[notificationData.length - index - 1]?.Billability}
                                </p>
                                <p>
                                  <b>Requirement Id:</b>{" "}
                                  {notificationData[notificationData.length - index - 1]?.RequirementID}
                                </p>
                                <p>
                                  <b>Reason: </b>{" "}
                                  {notificationData[notificationData?.length - index - 1].feedback}{" "}
                                </p>
                              </div>
                            )}
                             {(
                          notificationData[notificationData.length - index - 1].ProcessStatus ===
                          "De-Allocation Requested") && (
                            <div>
                              <p>
                                <b>Client Name:</b>{" "}
                                {notificationData[notificationData.length - index - 1]?.ClientName}
                              </p>
                              <p>
                                <b>Project Name:</b>{" "}
                                {notificationData[notificationData.length - index - 1]?.ProjectName}
                              </p>
                              <p>
                                <b>Project Dates:</b>{" "}
                                {notificationData[notificationData.length - index - 1].allocStartDate?.slice(0, 10)}{" "}
                                <b>to</b>{" "}
                                {(notificationData[notificationData.length - index - 1]?.allocEndDate?.slice(0, 10))}
                              </p>
                              <p>
                                <b>Billability:</b>{" "}
                                {notificationData[notificationData.length - index - 1]?.Billability}
                              </p>
                              <p>
                                <b>Requirement Id:</b>{" "}
                                {notificationData[notificationData.length - index - 1]?.RequirementID}
                              </p>
                              <p>
                                <b>Reason:</b>{" "}
                                {notificationData[notificationData.length - index - 1]?.DeAllocReason}
                              </p>
                            </div>
                          )}
                          {(
                            notificationData[notificationData.length - index - 1]?.ProcessStatus ===
                            "De-Allocation Rejected") && (
                              <div>
                                <p>
                                  <b>Client Name:</b>{" "}
                                  {notificationData[notificationData.length - index - 1]?.ClientName}
                                </p>
                                <p>
                                  <b>Project Name:</b>{" "}
                                  {notificationData[notificationData.length - index - 1]?.ProjectName}
                                </p>
                                <p>
                                  <b>Project Dates:</b>{" "}
                                  {notificationData[notificationData.length - index - 1].allocStartDate?.slice(0, 10)}{" "}
                                  <b>to</b>{" "}
                                  {(notificationData[notificationData.length - index - 1]?.allocEndDate?.slice(0, 10))}
                                </p>
                                <p>
                                  <b>Billability:</b>{" "}
                                  {notificationData[notificationData.length - index - 1]?.Billability}
                                </p>
                                <p>
                                  <b>Requirement Id:</b>{" "}
                                  {notificationData[notificationData.length - index - 1]?.RequirementID}
                                </p>
                                <p>
                                  <b>Reason:</b>{" "}
                                  {notificationData[notificationData.length - index - 1]?.feedback}
                                </p>
                              </div>
                            )}
                        </div>
                      )}

                    </Container>
                  ))}</Tab>
              <Tab eventKey="Soft Block" title="Soft Block">
                {softBlockNoification.map((item, index) => (
                  <Container
                    key={index}
                    fluid
                    // className="m-1"
                    className={item.PmReadStatus ? "bg-white" : "bg-secondary bg-opacity-10"}
                    style={{
                      borderBottom: "solid 1px",
                      borderBottomColor: "lightgray",
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
                                    message = `You have requested a Softblock for ${item.ResourceName}`;
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
                        {(select[0]?.empRoleName === "Manager" &&
                          item?.ProcessStatus === "SoftBlock Rejected") || (select[0]?.empRoleName === "Manager" &&
                            item?.ProcessStatus === "SoftBlock Requested")
                          ? (
                            <>
                              <Button
                                className="infoBtn"
                                onClick={() => {

                                  setInfo(!info);
                                  setClickedinfoItemIndex(index);
                                  setClickedinfoItemIndex(index);
                                }}
                              >
                                <i class="bi bi-eye-fill"></i>
                              </Button>
                            </>
                          ) : null}
                      </div>
                    </div>
                    {info && clickedinfoItemIndex === index && (
                      <div >
                       

                        {softBlockNoification[index]?.ProcessStatus ===
                          "SoftBlock Requested" && (
                            <div>
                              <p>
                                SoftBlock requested <span>from</span>{" "}
                                <b>{new Date(softBlockNoification[index]?.SBstartdate)?.toLocaleDateString('en-GB').replace(/\//g, '-')}</b>
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
                                Softblock requested <span>from</span>{" "}
                                <b>{new Date(softBlockNoification[index]?.SBstartdate)?.toLocaleDateString('en-GB').replace(/\//g, '-')}</b>
                                <span> to</span>{" "}
                                <b>{new Date(softBlockNoification[index]?.SBenddate)?.toLocaleDateString('en-GB').replace(/\//g, '-')}</b>
                                <p>Requirement Id:{" "} <b>{softBlockNoification[index]?.RequirementID}</b></p>
                              </p>
                              <p>
                                <b>Reason: </b>{" "}
                                {softBlockNoification[index].feedback}{" "}
                              </p>
                            </div>
                          )}
                      </div>
                    )}


                  </Container>
                ))}</Tab>
              <Tab eventKey="Allocation" title="Allocation">  {allocationNotification.map((item, index) => (
                <Container
                  key={index}
                  fluid
                  // className="m-1"
                  className={item.PmReadStatus ? "bg-white" : "bg-secondary bg-opacity-10"}
                  style={{
                    borderBottom: "solid 1px",
                    borderBottomColor: "lightgray",
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
                        >
                          {
                            (() => {
                              let message;
                              switch (item?.ProcessStatus) {
                                case 'Allocated':
                                  message = `${item.createdByName} has Allocated ${item.ResourceName}`;
                                  break;
                                case 'Allocation Rejected':
                                  message = `${item?.updatedByName} has rejected the Allocation request for ${item.ResourceName}`;
                                  break;
                                case 'Allocation Requested':
                                  message = `You have requested an Allocation for ${item.ResourceName}`;
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
                      {(select[0]?.empRoleName === "Manager" &&
                        item?.ProcessStatus === "Allocation Rejected") ||
                        (select[0]?.empRoleName === "Manager" &&
                          item?.ProcessStatus === "Allocation Requested")
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
                  </div>
                  {info && clickedinfoItemIndex === (index) && (
                    <div >
                      {allocationNotification[index]?.ProcessStatus ===
                        "Allocation Requested" && (
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
                          </div>
                        )}


                      {(
                        allocationNotification[index]?.ProcessStatus ===
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
                              <b>Reason: </b>{" "}
                              {allocationNotification[index].feedback}{" "}
                            </p>
                          </div>
                        )}

                    </div>
                  )}
                </Container>
              ))}</Tab>
              <Tab eventKey="De Allocation" title="De Allocation">
                {deAllocationNotification.map((item, index) => (
                  <Container
                    key={index}
                    fluid
                    // className="m-1"
                    className={item.PmReadStatus ? "bg-white" : "bg-secondary bg-opacity-10"}
                    style={{
                      borderBottom: "solid 1px",
                      borderBottomColor: "lightgray",
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
                          >
                            {
                              (() => {
                                let message;
                                switch (item?.ProcessStatus) {

                                  case 'De-Allocated':
                                    message = `${item?.updatedByName} has De-Allocated ${item.ResourceName}`;
                                    break;

                                  case 'De-Allocation Rejected':
                                    message = `${item?.updatedByName} has rejected De-Allocation request for ${item.ResourceName}`;
                                    break;

                                  case 'De-Allocation Requested':
                                    message = `You has requested a De-Allocation request for ${item.ResourceName}`;
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
                        {(select[0]?.empRoleName === "Manager" &&
                          item?.ProcessStatus === "De-Allocation Rejected") ||
                          (select[0]?.empRoleName === "Manager" &&
                            item?.ProcessStatus === "De-Allocation Requested")
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
                    </div>
                    {info && clickedinfoItemIndex === index && (
                      <div >
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
                                {deAllocationNotification[index]?.DeAllocReason}
                              </p>
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
                                {deAllocationNotification[index]?.feedback}
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
    </>
  );
};

export default PmNotification;
