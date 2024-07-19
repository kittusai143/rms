import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { IoFilterSharp } from "react-icons/io5";
import { MultiSelect } from "react-multi-select-component";
import {
  Col,
  Label,
  Button,
  Row,
  Card,
  CardTitle,
  CardText,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink,
  Container,
  CardBody,
  CardHeader,
} from "reactstrap";
import Gantt from "./Billingutilization";
import "../../CSS/PDO/Utilization.css";
import Pmo_Dashboard from "../../Api/Pmo_Dashboard.js";
import ShadowResource from "../../Images/shadow.jpg";
import AvailableResource from "../../Images/employees.png";
import ReactSpeedometer from "react-d3-speedometer";
import BenchResource from "../../Images/Bench-Employees.png";
import Select from "react-select";
export default function UtilizationData() {
  const [gantt, setGantt] = useState([]);
  const [projectFilter, setProjectFilter] = useState([]);
  const [clientFilter, setClientFilter] = useState([]);
  const [clientData, setClientData] = useState([]);
  const [allocatedData, setAllocatedData] = useState();
  const [benchData, setBenchData] = useState();
  const [shadowData, setShadowData] = useState([]);
  const [monthValue, setMonthValue] = useState();
  const [yearValue, setYearValue] = useState(2024);
  const [data, setData] = useState([]);
  const [employeeId, setEmployeeId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [clientId, setClientId] = useState();
  const [billableHours, setTotalBillableHours] = useState();
  const pageSize = 5;
  const startIndex = currentPage * pageSize + 1;
  const endIndex = Math.min((currentPage + 1) * pageSize, data?.length);
  const pageCount = Math.ceil(data?.length / pageSize);
  const [quarterValue, setQuarterValue] = useState(0);
  const [subsidiaries, setSubsidiaries] = useState([]);
  const [billingHoursArea, setBillingHoursArea] = useState({
    options: {
      chart: {
        id: "apexchart-example",
      },
      xaxis: {
        categories: [],
      },
    },
    series: [
      {
        name: "Actual Hours",
        data: [],
      },
      {
        name: "Billable Hours",
        data: [],
      },
    ],
  });
  const [chartDataarea, setChartDataarea] = useState({
    options: {
      chart: {
        id: "apexchart-example",
      },
      xaxis: {
        categories: ["Project Utilization", "Billing Utilization", "Bench "],
      },
    },
    series: [
      {
        name: "Utilization",
        data: [],
      },
    ],
  });
  const yearOptions = [
    {
      value: 2023,
      label: "2023",
    },
    {
      value: 2024,
      label: "2024",
    },
  ];
  const monthOptions = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];
  const quarterOptions = [
    { value: null, label: "Select" },
    { value: 1, label: "Q1(Apr-Jun)" },
    { value: 2, label: "Q2(Jul-Sep)" },
    { value: 3, label: "Q3(Oct-Dec)" },
    { value: 4, label: "Q4(Jan-Mar)" },
  ];
  const subsidaryOptions = [
    { value: "", label: "Select" },
    { value: "Saplica", label: "Saplica" },
    { value: "Infoway", label: "Infoway" },
    { value: "SSInc", label: "SSInc" },
  ];
  const handlePageClick = (pageIndex) => {
    setCurrentPage(pageIndex);
  };
  const [projectName, setProjectName] = useState([]);
  useEffect(() => {
    Pmo_Dashboard.getEmployeesAllocatedData().then((res) => {
      setAllocatedData(res.data);
    });
    Pmo_Dashboard.getEmployeesData().then((res) => {
      setBenchData(res.data);
    });
    Pmo_Dashboard.getNonBillableData().then((res) => {
      setShadowData(res.data.length);
    });
    Pmo_Dashboard.getDistinctClientNames().then((res) => {
      setClientData(res.data);
    });
  }, [yearValue]);

  console.log(yearValue);

  console.log(clientFilter);

  const [currentPages, setCurrentPages] = useState(0);
  const [categories, setCategories] = useState([]);
  const [percentages, setPercentages] = useState([]);
  const itemsPerPage = 5;
  const paginate = (array, pageNumber) => {
    return array.slice(
      pageNumber * itemsPerPage,
      (pageNumber + 1) * itemsPerPage
    );
  };

  const updateChartData = (categories, percentages, pageNumber) => {
    const paginatedCategories = paginate(categories, pageNumber);
    const paginatedPercentages = paginate(percentages, pageNumber).map(
      (percentage) => parseFloat(percentage.toFixed(2))
    );
    setProjectChartData({
      options: {
        chart: {
          id: "apexchart-example",
          type: "bar",
        },
        plotOptions: {
          bar: {
            horizontal: true,
          },
        },
        xaxis: {
          categories: paginatedCategories,
        },
      },
      series: [
        {
          name: "Billing %",
          data: paginatedPercentages,
        },
      ],
    });
  };

  useEffect(() => {
    if (categories.length > 0 && percentages.length > 0) {
      updateChartData(categories, percentages, currentPage);
    }
  }, [currentPage, categories, percentages]);


  const handleSelectClientName = (selectedOptions) => {
    console.log(selectedOptions);

    if (selectedOptions.length === 0) {
      setClientFilter([]);
      setProjectFilter([]);
      setProjectChartData({
        options: {
          chart: {
            id: "apexchart-example",
            type: "bar",
          },
          plotOptions: {
            bar: {
              horizontal: true,
            },
          },
          xaxis: {
            categories: "",
          },
        },
        series: [],
      });
      setClientId(null);
      setTotalBillableHours(null);
      setProjectName([]);
      return;
    }

    setClientFilter(selectedOptions?.map((option) => option?.value));
    setProjectFilter([]);

    selectedOptions.map((option) => {
      Pmo_Dashboard.getClientNameAndId().then((res) => {
        res.data.Data.map((data) => {
          if (data.ClientName === option.label) {
            console.log(data.ClientID);

            const clientReportData = {
              clientID: data.ClientID,
              year: yearValue,
            };

            Pmo_Dashboard.getClientReport(clientReportData)
              .then((res) => {
                console.log(res.data.totalassignedhours);
                const data = res.data;
                setClientId(res.data.totalassignedhours);

                const overallBillablePercentage =
                  (res.data.totalbillablehours / res.data.totalassignedhours) *
                  100;
                setTotalBillableHours(overallBillablePercentage);

                const categories = data.empList.map((emp) => emp.name);
                const assignedHours = data.empList.map(
                  (emp) => emp.assignedhours
                );
                const billableHours = data.empList.map(
                  (emp) => emp.billablehours
                );
                const percentages = billableHours.map(
                  (bh, index) => (bh / assignedHours[index]) * 100
                );

                setCategories(categories);
                setPercentages(percentages);
                setCurrentPage(0); // Reset to the first page
                updateChartData(categories, percentages, 0); 

                setProjectChartData({
                  options: {
                    chart: {
                      id: "apexchart-example",
                      type: "bar",
                    },
                    plotOptions: {
                      bar: {
                        horizontal: true,
                      },
                    },
                    xaxis: {
                      categories: categories,
                    },
                  },
                  series: [
                    {
                      name: "Billable %",
                      data: percentages,
                    },
                  ],
                });
              })
              .catch((err) => {
                console.error(err);
              });
          }
        });
      });
    });

    Pmo_Dashboard.getMultipleDataForProjects(
      selectedOptions.map((option) => option.value)
    ).then((res) => {
      setProjectName(res.data);
    });
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => {
      const maxPage = Math.ceil(categories.length / itemsPerPage) - 1;
      return prevPage < maxPage ? prevPage + 1 : prevPage;
    });
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => (prevPage > 0 ? prevPage - 1 : 0));
  };

  

  const handleGetData = (type) => {
    if (type === "AllocatedData") {
      Pmo_Dashboard.getAllocatedResources().then((res) => {
        setData(res.data);
        setCurrentPage(0);
      });
    }
    if (type === "BenchResource") {
      Pmo_Dashboard.getAvailableResources().then((res) => {
        setData(res.data);
        setCurrentPage(0);
      });
    }
    if (type === "ShadowResource") {
      Pmo_Dashboard.getNonBillableData().then((res) => {
        setData(res.data);
        setCurrentPage(0);
      });
    }
  };
  const fetch = () => {
    Pmo_Dashboard.filt({
      subsidiaries: subsidiaries,
      clients: clientFilter,
      projects: projectFilter,
      year: yearValue ? yearValue : 2024,
      quarter: quarterValue,
    }).then((res) => {
      setGantt(res.data.list);
      setMulitple(res.data.multiple);
    });
  };
  const fetchCollective = () => {
    Pmo_Dashboard.filt({
      subsidiaries: subsidiaries,
      clients: clientFilter,
      projects: projectFilter,
      year: yearValue ? yearValue : 2024,
      quarter: quarterValue,
    }).then((res) => {
      setChartData(prepareChartData(res.data.percentage));
    });
  };

  useEffect(() => {
    fetch();
  }, [clientFilter, projectFilter]);
  useEffect(() => {
    fetchCollective();
  }, [yearValue, quarterValue, clientFilter, projectFilter]);
  const prepareChartData = (data) => {
    let quartersOrder;
    if (data.hasOwnProperty("Quarter-1")) {
      quartersOrder = ["Quarter-1", "Quarter-2", "Quarter-3", "Quarter-4"];
    } else {
      quartersOrder = Object.keys(data).includes("JANUARY")
        ? ["JANUARY", "FEBRUARY", "MARCH"]
        : Object.keys(data).includes("APRIL")
        ? ["APRIL", "MAY", "JUNE"]
        : Object.keys(data).includes("JULY")
        ? ["JULY", "AUGUST", "SEPTEMBER"]
        : ["OCTOBER", "NOVEMBER", "DECEMBER"];
      console.log(quartersOrder);
    }
    const series = [
      {
        name: "Bench",
        data: quartersOrder.map((quarter) => data[quarter]?.bench?.toFixed(2)),
      },
      {
        name: "Billing",
        data: quartersOrder.map((quarter) =>
          data[quarter]?.billing?.toFixed(2)
        ),
      },
      {
        name: "Allocated",
        data: quartersOrder.map((quarter) =>
          data[quarter]?.utilization?.toFixed(2)
        ),
      },
      // {
      //   name: 'Total',
      //   data: quartersOrder.map(quarter => data[quarter]?.totaldays?.toFixed(2))
      // }
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
  const [chartData, setChartData] = useState({
    options: {
      chart: {
        id: "apexchart-example",
      },
      xaxis: {
        categories: ["Project Utilization", "Billing Utilization", "Bench "],
      },
    },
    series: [
      {
        name: "Utilization",
        data: [],
      },
    ],
  });
  const [projectChartData, setProjectChartData] = useState({
    options: {
      chart: {
        id: "apexchart-example",
        type: "bar",
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      xaxis: {
        categories: [],
      },
    },
    series: [
      {
        name: "Assigned Hours",
        data: [],
      },
      {
        name: "Billable Hours",
        data: [],
      },
    ],
  });
  const currentYear = new Date().getFullYear();
  const currentMonthIndex = new Date().getMonth();
  const currentMonthOption = monthOptions[currentMonthIndex];
  const [multiple, setMulitple] = useState();
  const [individualYear, setIndividualYear] = useState(2024);
  const [individualMonth, setIndividualMonth] = useState(currentMonthOption);
  const [individualQuarter, setIndividualQuarter] = useState(0);
  const [dates, setDates] = useState({ startDate: null, endDate: null });
  const quarterStarts = [4, 7, 10, 1];
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  const getMonthDates = (year, month) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    return { startDate, endDate };
  };
  useEffect(() => {
    const { startDate, endDate } = getMonthDates(
      currentYear,
      individualMonth.value
    );
    gantt.filter((item) => {
      if(item.billability === 'Billable') {
        // console.log(item);
      }
    })
    console.log(startDate,endDate)
    setDates({ startDate, endDate });
  }, [individualMonth]);

  gantt.filter((item) => {
    if(item.Billability === 'Billable') {
      console.log(item);
    }
  })
  return (
    <>
      {/* <div className="container mt-4"> */}
      {/* <Row> */}
      {/* <Col >
            {" "}
            <Row>
              <Label>
                <b>Subsidary</b>
              </Label>
            </Row>
            <Row>
              {" "}
              <MultiSelect
                    id="client"
                    options={ subsidaryOptions?.map((item) => ({
                      value: item[1],
                      label: item[0],
                    }))}
                    value={subsidiaries?.map((item) => ({
                      value: item[1],
                      label: item[0],
                    }))}
                    onChange={(selectedOptions) =>
                      setClientFilter(
                        selectedOptions.map((option) => option.value)
                      )
                    }
                    labelledBy="Filter by Client"
                    overrideStrings={{ selectSomeItems: "Clients" }}
                  />
            </Row>
          </Col> */}

      {/* </Row> */}

      {/* </div> */}
      <div>
        <Row className="mt-3 px-3" style={{ height: "14%" }}>
          <Col>
            <Card
              body
              style={{ borderRadius: "2rem" }}
              className="card-item A"
              onClick={(e) => handleGetData("AllocatedData")}
            >
              <CardTitle tag="h5">Allocated Resources</CardTitle>
              <CardText
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <h2>{allocatedData}</h2>
                <img
                  className="card-img"
                  src={AvailableResource}
                  alt="All Employees"
                />
              </CardText>
            </Card>
          </Col>
          <Col>
            <Card
              style={{ borderRadius: "2rem" }}
              body
              className="card-item B"
              onClick={(e) => handleGetData("BenchResource")}
            >
              <CardTitle tag="h5">Bench Resources</CardTitle>
              <CardText
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <h2>{benchData}</h2>
                <img
                  className="card-img"
                  src={BenchResource}
                  alt="Bench Employees"
                />
              </CardText>
            </Card>
          </Col>
          <Col>
            <Card
              style={{ borderRadius: "2rem" }}
              body
              className="card-item C"
              onClick={(e) => handleGetData("ShadowResource")}
            >
              <CardTitle tag="h5">Shadow Resources</CardTitle>
              <CardText
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <h2>{shadowData}</h2>
                <img
                  className="card-img bench-resource"
                  src={ShadowResource}
                  alt="Bench Exit"
                />
              </CardText>
            </Card>
          </Col>
          <Col style={{ marginTop: "-1%" }}>
            <Row className="mt-5">
              <Col>
                <MultiSelect
                  id="client"
                  options={clientData?.map((item) => ({
                    value: item[1],
                    label: item[0],
                  }))}
                  value={clientFilter?.map((item) => ({
                    value: item,
                    label: item,
                  }))}
                  selected={clientFilter}
                  onChange={handleSelectClientName}
                  labelledBy="Filter by Client"
                  overrideStrings={{ selectSomeItems: "Clients" }}
                />
              </Col>
              <Col>
                <MultiSelect
                  id="project"
                  options={projectName?.map((item) => ({
                    value: item,
                    label: item,
                  }))}
                  value={projectFilter?.map((item) => ({
                    value: item,
                    label: item,
                  }))}
                  onChange={(selectedOptions) =>
                    setProjectFilter(
                      selectedOptions.map((option) => option.value)
                    )
                  }
                  labelledBy="Filter by Project"
                  overrideStrings={{ selectSomeItems: "Projects" }}
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col>
                <Select
                  placeholder="Year"
                  value={{ value: yearValue, label: yearValue }}
                  style={{
                    border: "1px solid gray",
                    borderRadius: "4px",
                    fontWeight: "bold",
                    width: "70%",
                  }}
                  onChange={(e) => {
                    setYearValue(e.value);
                    setQuarterValue("");
                  }}
                  defaultValue={{ value: yearValue, label: yearValue }}
                  options={yearOptions}
                ></Select>
              </Col>
              <Col>
                <Select
                  placeholder="Quarter"
                  value={{
                    value: quarterValue,
                    label: quarterOptions[quarterValue]?.label,
                  }}
                  style={{
                    border: "1px solid gray",
                    borderRadius: "4px",
                    fontWeight: "bold",
                    width: "70%",
                  }}
                  onChange={(e) => {
                    setQuarterValue(e.value);
                  }}
                  defaultValue={{
                    value: quarterValue,
                    label: quarterOptions[quarterValue]?.label,
                  }}
                  options={quarterOptions}
                  isOptionDisabled={(option) =>
                    new Date(
                      yearValue,
                      quarterStarts[option.value - 1] - 1,
                      1
                    ) > new Date() ||
                    (new Date().getFullYear() <= yearValue && option.value === 4)
                  }
                ></Select>
              </Col>
              {/* <Col>
                <Button className="btn" onClick={() => {
                  setYearValue("")
                  setQuarterValue("")
                }}>Clear Filters</Button>
              </Col> */}
            </Row>
            <Row className="mt-3 ">
              <Col>
                <Select
                  placeholder="Month"
                  value={individualMonth}
                  style={{
                    border: "1px solid gray",
                    borderRadius: "4px",
                    fontWeight: "bold",
                    width: "70%",
                  }}
                  onChange={(selectedOption) => {
                    console.log(dates.startDate)
                    console.log(dates.endDate)
                    const body = {
                      empCode: "SIL-0925",
                      startDate: formatDate(dates.startDate),
                      endDate: formatDate(dates.endDate),
                    };
                    // console.log(body);


                    Pmo_Dashboard.getResourceBillingHours(body).then((res) => {
                      // console.log(res.data);
                      const weeks = res.data.employeesReport.map(
                        (employee) => ({
                          name: employee.name,
                          actualHours: [
                            employee.week1.actual,
                            employee.week2.actual,
                            employee.week3.actual,
                            employee.week4.actual,
                            employee.week5.actual,
                          ],
                          billableHours: [
                            employee.week1.billable,
                            employee.week2.billable,
                            employee.week3.billable,
                            employee.week4.billable,
                            employee.week5.billable,
                          ],
                        })
                      );
                     console.log(res.data.employeesReport) 
                     
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
                        series: weeks.map((week) => ({
                          name: week.name,
                          data: week.actualHours,
                        })),
                      });
                    });
                    setIndividualMonth(selectedOption);
                  }}
                  options={monthOptions}
                />
              </Col>
              <Col
                className="justify-content-center"
                style={{ display: "flex" }}
              >
                <Button
                  className="btn-danger"
                  onClick={() => {
                    setClientFilter([]);
                    setDates({ startDate: null, endDate: null });
                    setProjectFilter([]);
                    setYearValue(2024);
                    setQuarterValue(0);
                    setIndividualMonth(currentMonthOption);
                    Pmo_Dashboard.getAllResources().then((res) =>
                      setGantt(res.data)
                    );
                  }}
                >
                  Clear Filters
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col sm="4">
            <Card className="graph" style={{ borderRadius: "2rem" }}>
              <CardBody>
                <CardHeader>
                  Billing Vs Allocated Hours Percentage : {clientFilter}
                </CardHeader>
                <Col>
                  <Chart
                    options={projectChartData?.options}
                    series={projectChartData?.series}
                    type="bar"
                    height={200}
                  />
                   <Button onClick={handlePrevPage} disabled={currentPage === 0}>
                  Previous
                </Button>
                <Button
                  onClick={handleNextPage}
                  disabled={
                    (currentPage + 1) * itemsPerPage >= categories.length
                  }
                  style={{ float: "right" }}
                >
                  Next
                </Button>
                </Col>
              </CardBody>
            </Card>
          </Col>
          <Col sm="4">
            <Card className="graph" style={{ borderRadius: "2rem" }}>
              <CardBody style={{ marginBottom: "-17%" }}>
                <CardHeader>Client Billing Utilization Percentage</CardHeader>
                <Col style={{ marginTop: "2%", marginLeft: "15%" }}>
                  <ReactSpeedometer
                    style={{ marginTop: "4%" }}
                    maxValue={120}
                    value={billableHours}
                    needleColor="red"
                    startColor="green"
                    segments={10}
                    endColor="blue"
                    height={200}
                  />
                </Col>
              </CardBody>
            </Card>
          </Col>
          <Col sm="4">
            <Card className="graph" style={{ borderRadius: "2rem" }}>
              <CardBody>
                <CardHeader>Utilization </CardHeader>
                <Chart
                  options={chartData?.options}
                  series={chartData?.series}
                  type="bar"
                  height={200}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col style={{ padding: "2% 1%", width: "100%" }} sm="6" xl="8">
            <Gantt
              multiple={multiple}
              projectFilter={projectFilter}
              clientFilter={clientFilter}
              data={gantt}
              setEmployeeId={setEmployeeId}
              employeeId={employeeId}
              yearValue={yearValue}
              quarterValue={quarterValue}
              setChartDataarea={setChartDataarea}
              setBillingHoursArea={setBillingHoursArea}
              monthValue={monthValue}
              dates={dates}
              style={{ height: "50%", overflow: "scroll" }}
              className="gantt"
            />
          </Col>
        </Row>
        <Row className="mt-3 utilization_percentage">
          <Col sm="4" style={{ width: "50%" }}>
            <Card className="graph-2" style={{ borderRadius: "2rem" }}>
              <CardBody>
                <CardHeader>
                  Resource Billing Percentage : {employeeId?.title}
                </CardHeader>
                <Chart
                  options={billingHoursArea.options}
                  series={billingHoursArea.series}
                  type="bar"
                  height={200}
                />
              </CardBody>
            </Card>
          </Col>
          <Col sm="4" style={{ width: "50%" }}>
            <Card className="graph-2" style={{ borderRadius: "2rem" }}>
              <CardBody>
                <CardHeader>
                  Resource Utilization-{employeeId?.title}
                </CardHeader>
                <Chart
                  options={chartDataarea.options}
                  series={chartDataarea.series}
                  type="bar"
                  height={200}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>

  <div style={{ marginTop: "3%" }}>
  <Table
    striped
    bordered
    className="tabel_content"
    hover
    responsive
    size=""
  >
    <thead style={{ backgroundColor: "#E6E1C1", borderBottom: "none" }}>
      <tr>
        <th
          style={{
            backgroundColor: "#535BFF",
            color: " #fff",
            border: "none",
          }}
        >
          Emp ID
        </th>
        <th
          style={{
            backgroundColor: "#535BFF",
            color: " #fff",
            border: "none",
          }}
        >
          Emp Name
        </th>
        <th
          style={{
            backgroundColor: "#535BFF",
            color: " #fff",
            border: "none",
          }}
        >
          Allocation Status
        </th>
        <th
          style={{
            backgroundColor: "#535BFF",
            color: " #fff",
            border: "none",
          }}
        >
          Client Name
        </th>
        <th
          style={{
            backgroundColor: "#535BFF",
            color: " #fff",
            border: "none",
          }}
        >
          Project Name
        </th>
        <th
          style={{
            backgroundColor: "#535BFF",
            color: " #fff",
            border: "none",
          }}
        >
          Billability
        </th>
        <th
          style={{
            backgroundColor: "#535BFF",
            color: " #fff",
            border: "none",
          }}
        >
          Billing Start Date
        </th>
        <th
          style={{
            backgroundColor: "#535BFF",
            color: " #fff",
            border: "none",
          }}
        >
          Billing End Date
        </th>
        <th
          style={{
            backgroundColor: "#535BFF",
            color: " #fff",
            border: "none",
          }}
        >
          Tech Group
        </th>
        <th
          style={{
            backgroundColor: "#535BFF",
            color: " #fff",
            border: "none",
          }}
        >
          Skillset
        </th>
        <th
          style={{
            backgroundColor: "#535BFF",
            color: " #fff",
            border: "none",
          }}
        >
          Experience (in Years)
        </th>
        <th style={{ border: "none" }} />
      </tr>
    </thead>
    <tbody>
      {data
        .slice(currentPage * pageSize, (currentPage + 1) * pageSize)
        .map((item) => (
          <tr key={item.id}>
            <td>{item.silId}</td>
            <td>{item.name}</td>
            <td>{item.allocationStatus}</td>
            <td>{item.clientCode}</td>
            <td>{item.projectCode}</td>
            <td>{item.billability}</td>
            <td>{item.billingStartDate}</td>
            <td>{item.billingEndDate}</td>
            <td>{item.technologydivision}</td>
            <td>{item.skillset}</td>
            <td>{item.yearsofExp}</td>
            <td />
          </tr>
        ))}
    </tbody>
  </Table>
</div>

      <div className="pagination-container">
        <Pagination>
          <PaginationItem disabled={currentPage <= 0}>
            <PaginationLink
              previous
              onClick={() => handlePageClick(currentPage - 1)}
            />
          </PaginationItem>
          <div className="pagination-info" style={{ marginTop: "7%" }}>
            {startIndex}-{endIndex} of {data.length}
          </div>
          <PaginationItem disabled={currentPage >= pageCount - 1}>
            <PaginationLink
              next
              onClick={() => handlePageClick(currentPage + 1)}
            />
          </PaginationItem>
        </Pagination>
      </div>
    </>
  );
}
