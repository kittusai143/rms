import React from "react";
import { Card, CardTitle, Row, Col } from "reactstrap";
import { FlexboxGrid } from "rsuite";
import { useDispatch, useSelector } from "react-redux";
import { changePDSNavigate, changermsNavigate } from "../Store/reducers/Statusstore";
import { useNavigate } from "react-router";
import RMS from "./RMS";

import resource from './../Images/resource management.webp'
import pds from './../Images/pds.png'
const Rmsnavigate = () => {
    const dispatch = useDispatch();
    const status = useSelector(state => state);
    console.log(status)
    const navigate = useNavigate();
    const navigateRms = () => {
        dispatch(changermsNavigate());
    }
    const navigatePds = () => {
        dispatch(changePDSNavigate());
        navigate('')
    }

    return (<>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div>
                <Row >
                    <Col
                    xs='4' mg="4">
                        <Card
                        body
                        className="text-center"
                        onClick={() => { navigateRms() }}
                    // style={{
                    //   width: '18rem'
                    // }}
                    ><div style={{height:"200px"}}><img src={resource} ></img></div>

                        <CardTitle tag="h5">
                            RMS (Resource Management System)
                        </CardTitle>
                        
                    </Card>
                    </Col>
                    <Col xs='4' mg="4">
                        <Card
                            body
                            className="text-center"
                            onClick={() => { navigatePds() }}


                        ><div ><img src={pds}  style={{height:"200px"}} ></img></div>

                            <CardTitle tag="h5">
                                PDS(PMO DashBoard System)
                            </CardTitle>


                        </Card>
                    </Col>
                   
                <Col xs='4' mg="4">
                    <Card
                        body
                        className="text-center"
                    


                    >
                        <CardTitle tag="h5">
                            UPCOMING.......
                        </CardTitle>


                    </Card>
                </Col>
            </Row>
    



        </div>
    </div >
    </>)
}
export default Rmsnavigate;