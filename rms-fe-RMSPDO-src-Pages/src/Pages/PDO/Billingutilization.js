import Timeline, {
    DateHeader,
    TimelineHeaders,
    SidebarHeader,
  } from "react-calendar-timeline";
  import { Badge, Button } from "reactstrap";
  import "react-calendar-timeline/lib/Timeline.css";
  import moment from "moment";
  import "../../CSS/PDO/BillingUtilization.css";
  import Pmo_Dashboard from "../../Api/Pmo_Dashboard.js";
  import { useEffect } from "react";
  import { useState } from "react";
  import containerResizeDetector from "react-calendar-timeline/lib/resize-detector/container";
  const Gantt = ({
    multiple,
    employeeId,
    data,
    setEmployeeId,
    yearValue,
    setChartDataarea,
    quarterValue,
    projectFilter,
    clientFilter,
    dates,
    setBillingHoursArea,
  }) => {
    
    const groupData = data?.map((item) => ({
      id: item?.allocationId,
      title: item?.name,
      tip: item?.location,
      item: item,
      silId: item?.silId,
    }));
    groupData?.sort((a, b) => {
      let fa = a?.title?.toLowerCase(),
        fb = b?.title?.toLowerCase();
  
      if (fa < fb) {
        return -1;
      }
      if (fa > fb) {
        return 1;
      }
      return 0;
    });
    console.log(groupData?.length)
    const items = [];
    function days_between(date1, date2) {
      const date_1 = new Date(date1);
      const date_2 = new Date(date2);
      const ONE_DAY = 1000 * 60 * 60 * 24;
      const differenceMs = Math.abs(date_1 - date_2);
      return Math.round(differenceMs / ONE_DAY);
    }
    data?.map((item,index) => {
      item.startDate=item?.projectstartDate?.toString().slice(0,10)  
      item.projectEndDate=item?.projectEndDate?.toString().slice(0,10)
      item.billingStartDate=item?.billingStartDate?.toString().slice(0,10)
      item.billingEndDate=item?.billingEndDate?.toString().slice(0,10)
   
      const nonbilled = days_between(item?.projectstartDate, item?.projectEndDate);
      const billed = days_between(item?.billingStartDate, item?.billingEndDate);
      const billable = Math?.round((billed / nonbilled) * 100);
      const nonbillable = 100 - billable;
      items?.push({
        id: item?.allocationId + "1",
        group: item?.allocationId,
        start_time: new Date(item?.startDate),
        end_time: new Date(item?.projectEndDate),
        title: `Nonbillable(${nonbillable}%)`,
        canResizeRight: false,
        canMove: false,
        itemProps: {
          style: { background: "green", borderRadius: "8px" },
        },
      });
      items?.push({
        id: item?.allocationId + "2",
        group: item?.allocationId,
        start_time: new Date(item?.billingStartDate),
        end_time: new Date(item?.billingEndDate),
        title: `Billable(${billable}%)`,
        canResizeRight: false,
        canMove: false,
        itemProps: {
          style: { background: "blue", borderRadius: "8px" },
        },
      });
    });
    data?.map((item) => {
      const nonbilled = days_between(item?.startDate, item?.projectEndDate);
      const billed = days_between(item?.billingStartDate, item?.billingEndDate);
      const billable = Math?.round((billed / nonbilled) * 100);
      const nonbillable = 100 - billable;
      if(item?.startDate&& item?.projectEndDate){
        items?.push({
          id: item?.allocationId + "1",
          group: item?.allocationId,
          start_time: new Date(item?.startDate),
          end_time: new Date(item?.projectEndDate),
          title: `Nonbillable(${nonbillable}%)`,
          canResizeRight: false,
          canMove: false,
          itemProps: {
            style: { background: "green", borderRadius: "8px" },
          },
        });
      }
      if(item?.billingStartDate&& item?.billingEndDate){
        items?.push({
          id: item?.allocationId + "2",
          group: item?.allocationId,
          start_time: new Date(item?.billingStartDate),
          end_time: new Date(item?.billingEndDate),
          title: `Billable(${billable}%)`,
          canResizeRight: false,
          canMove: false,
          itemProps: {
            style: { background: "blue", borderRadius: "8px" },
          },
        });
      }
     
    });
  
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const sliced = groupData?.slice(indexOfFirstItem, indexOfLastItem);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const fetchIndividual = () => {
      Pmo_Dashboard?.getEmployeeResourceDataWithFilters(employeeId, {
        subsidiaries: [],
        clients: [],
        projects: [],
        year: yearValue ? yearValue : 2024,
        quarter: quarterValue,
      }).then((res) => {
        setChartDataarea(prepareChartData(res?.data?.percentage));
      });
    };
    function formatDate(date) {
      const year = date?.getFullYear();
      const month = String(date?.getMonth() + 1)?.padStart(2, "0");
      const day = String(date?.getDate())?.padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    useEffect(() => {
      setEmployeeId(null);
    }, [projectFilter, clientFilter]);
    useEffect(() => {
      if (employeeId) {
        fetchIndividual();
      }
    }, [yearValue, quarterValue]);
    const prepareChartData = (data) => {
      let quartersOrder;
      if (data?.hasOwnProperty("Quarter-1")) {
        quartersOrder = ["Quarter-1", "Quarter-2", "Quarter-3", "Quarter-4"];
      } else {
        quartersOrder = Object?.keys(data)?.includes("JANUARY")
          ? ["JANUARY", "FEBRUARY", "MARCH"]
          : Object?.keys(data)?.includes("APRIL")
          ? ["APRIL", "MAY", "JUNE"]
          : Object?.keys(data)?.includes("JULY")
          ? ["JULY", "AUGUST", "SEPTEMBER"]
          : ["OCTOBER", "NOVEMBER", "DECEMBER"];
        console?.log(quartersOrder);
      }
      const series = [
        {
          name: "Bench",
          data: quartersOrder?.map((quarter) => data[quarter]?.bench?.toFixed(2)),
        },
        {
          name: "Billing",
          data: quartersOrder?.map((quarter) =>
            data[quarter]?.billing?.toFixed(2)
          ),
        },
        {
          name: "Allocated",
          data: quartersOrder?.map((quarter) =>
            data[quarter]?.utilization?.toFixed(2)
          ),
        },
        // {
        //   name: "Total",
        //   data: quartersOrder.map((quarter) =>
        //     data[quarter]?.totaldays?.toFixed(2)
        //   ),
        // },
      ];
  
      const options = {
        chart: {
          type: "bar",
          height: 270,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded",
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"],
        },
        xaxis: {
          categories: quartersOrder,
        },
        yaxis: {
          title: {
            text: "Percentage",
          },
        },
        fill: {
          opacity: 1,
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + "%";
            },
          },
        },
      };
  
      return { options, series };
    };
    return (
      <div className="timeline-container">
        {groupData?.length > 0 && items?.length && (
          <Timeline
            resizeDetector={containerResizeDetector}
            groups={sliced}
            items={items}
            defaultTimeStart={new Date()}
            defaultTimeEnd={
              new Date(new Date()?.setDate(new Date()?.getDate() + 364))
            }
            itemRenderer={({
              item,
              itemContext,
              getItemProps,
              getResizeProps,
            }) => {
              const { left: leftResizeProps, right: rightResizeProps } =
                getResizeProps();
              return (
                <div {...getItemProps(item?.itemProps)}>
                  {itemContext?.useResizeHandle && <div {...leftResizeProps} />}
                  <div
                    className="rct-item-content"
                    style={{ maxHeight: `${itemContext?.dimensions?.height}` }}
                  >
                    {item?.title}
                  </div>
                  {itemContext?.useResizeHandle && <div {...rightResizeProps} />}
                </div>
              );
            }}
            groupRenderer={({ group }) => {
              return (
                <div className="custom-group">
                  <div
                    className="title"
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div className="titleDiv" style={{ paddingLeft: "14%" }}>
                      <a
                        style={{
                          color: "#0d6efd",
                          textDecoration: "underline",
                        }}
                        id="clickable"
                        data-tooltip-place="right-end"
                        data-tooltip-position-strategy="fixed"
                        onClick={() => {
                          // console.log(group)
                          setEmployeeId(group);
                          Pmo_Dashboard?.getEmployeeResourceDataWithFilters(
                            group?.silId,
                            {
                              subsidiaries: [],
                              clients: [],
                              projects: [],
                              year: yearValue ? yearValue : 2024,
                              quarter: quarterValue,
                            }
                          ).then((res) => {
                            console.log(res?.data);
                            setChartDataarea(
                              prepareChartData(res?.data?.percentage)
                            );
                          });
                          const body = {
                            empCode: "SIL-0925",
                            startDate: formatDate(dates?.startDate),
                            endDate: formatDate(dates?.endDate),
                          };
                          console.log(body);
                          Pmo_Dashboard?.getResourceBillingHours(body)?.then(
                            (res) => {
                              console.log(res?.data);
                              const weeks = res?.data?.employeesReport?.map(
                                (employee) => ({
                                  name: employee?.name,
                                  actualHours: [
                                    employee?.week1?.actual,
                                    employee?.week2?.actual,
                                    employee?.week3?.actual,
                                    employee?.week4?.actual,
                                    employee?.week5?.actual,
                                  ],
                                  billableHours: [
                                    employee?.week1?.billable,
                                    employee?.week2?.billable,
                                    employee?.week3?.billable,
                                    employee?.week4?.billable,
                                    employee?.week5.billable,
                                  ],
                                })
                              );
                              // Extract week names
                              const weekNames = [
                                "Week 1",
                                "Week 2",
                                "Week 3",
                                "Week 4",
                                "Week 5",
                              ];
                              // Update state with the processed data
                              setBillingHoursArea({
                                options: {
                                  chart: {
                                    id: "apexchart-example",
                                  },
                                  xaxis: {
                                    categories: weekNames, // Use week names as categories
                                  },
                                },
                                series: weeks?.map((week) => ({
                                  name: week?.name,
                                  data: week?.actualHours,
                                })),
                              });
                            }
                          );
                        }}
                        className="resource-name"
                      >
                        {group?.title}
                      </a>
                    </div>
                  </div>
                  <p className="tip">{group?.tip}</p>
                  {group?.rightTitle && (
                    <div className="right-sidebar">{group?.rightTitle}</div>
                  )}
                </div>
              );
            }}
            onItemClick={(itemId) => {
              const selectedItem = items?.find((item) => item?.id === itemId);
              // Your item click handler logic
            }}
          >
            <TimelineHeaders>
              <SidebarHeader className="sidebar">
                {({ getRootProps }) => {
                  return (
                    <div className="timeline" {...getRootProps()}>
                      <div style={{ paddingLeft: "15%", paddingTop: "5%" }}>
                        <h5 style={{ color: "white" }}>Resource Name </h5>
                      </div>
                    </div>
                  );
                }}
              </SidebarHeader>
              <DateHeader unit="year" />
              <DateHeader unit="month" />
            </TimelineHeaders>
          </Timeline>
        )}
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
            disabled={indexOfLastItem >= groupData?.length}
            onClick={() => paginate(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    );
  };
  export default Gantt;
  