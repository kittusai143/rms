import React, { useEffect, useState } from "react";
import { Input, Row, Col, Container, Button, Badge } from "reactstrap";
import Modal from 'react-bootstrap/Modal';

import { getReq, putReq } from "../Api/api";
import { useSelector } from "react-redux";
// import '../CSS/activity.css';
import '../CSS/activity.css'

import TimeLineComponent from "./TimeLineComponent ";
// import { emplace } from "@reduxjs/toolkit/dist/utils";


const ActivityHistory = ({activityid,onClose,name}) => {
  const url = process.env.REACT_APP_URL;
  const [isModalOpen, setModalOpen] = useState(true);
  const select = useSelector((state) => state?.login?.tasks);
  const[data,setdata]=useState()
 
//  console.log(activityid)

const gethistory=()=>{
    getReq(`${url}notificationHistory/byResAllocid/${activityid}`).then(data=>{
      const history_rev =data?.data?.reverse();
      setdata(history_rev)})

}
  useEffect(() => {
    gethistory();
  }, []);


  return (
    <div className="App">
      <Modal show={isModalOpen} onHide={()=>onClose()} centered>
        <Modal.Header closeButton>
          <div className="notification_header d-flex">
            <h4>
              Activity History{" "}
            </h4>
            <Badge>{data?.length}</Badge>
          </div>
        </Modal.Header>
        <Modal.Body style={{alignContent:'start'}}>
        
  <TimeLineComponent data={data} name={name}/>
        
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ActivityHistory;