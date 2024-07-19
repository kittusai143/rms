import React, { useState } from 'react';
//React Suite imports
import { Timeline, TimelineItem } from 'rsuite';
import 'rsuite/Timeline/styles/index.css';
import '../CSS/TimelineComponent.css'

const TimeLineComponent = ({data,name})=> {
    const sortByTime = (a, b) => {
        const timeA = new Date(a.createddate).getTime();
        const timeB = new Date(b.createddate).getTime();

        return timeB-timeA;
      };
      data?.sort(sortByTime);

    // const sortByDate = (a, b) => {
    //     const dateA = new Date(a.createddate);
    //     const dateB = new Date(b.createddate);
    //     if (dateA < dateB) return -1;
    //     if (dateA > dateB) return 1;
    //     return 0;
    //   };
      

    //   data.sort(sortByDate);
    // console.log(data)
    
    
    return (
        <Timeline>
 
            {data&&data?.map(item=>(
               
            <Timeline.Item>{item.createddate.slice(0,10) +" "}{name} {item.Comment+" "}by {item.createdName}</Timeline.Item>))}
            {/* <Timeline.Item>16:27:41 Your order starts processing</Timeline.Item> */}
          
           
        </Timeline>
    )
}
export default TimeLineComponent;