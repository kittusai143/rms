import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Label, Table, Col, Row, Button } from "reactstrap";
import "../../CSS/PDO/Dashboard.css";
import Chart from "react-apexcharts";
import { Input } from "reactstrap";
import Pmo_Dashboard from "../../Api/Pmo_Dashboard.js";
import { useNavigate } from "react-router";
import { IoFilterSharp } from "react-icons/io5";
import moment from 'moment';
export default function PDSDashboard() {
  const [subsidiary, setSubsidiary] = useState("Select");
  const [chartData, setChartData] = useState({
    options: {
      chart: {
        id: "apexchart-example",
      },
      labels: ["Offshore", "Onshore"],
      colors: ["#05796B", "#FA7149"],
    },

    series: [],
  });
  const [clientsChart, setClientsChart] = useState({
    options: {
      chart: {
        id: "apexchart-example",
      },
      labels: [],
      colors: [],
    },
    series: [],
  });
  const [headCountData, setHeadCountData] = useState({
    options: {
      chart: {
        id: "apexchart-example",
      },
      labels: [
        "Billable",
        "Non-Billable",
        "OnShore",
        "OffShore",
        "Employee",
        "Consultant",
      ],
      colors: [
        "#EC4E20",
        "#004e89",
        "#016FB9",
        "#4cadad",
        "#FEC601",
        "#46494C",
      ],
    },
    series: [],
  });
  const [trainingData, setTrainingData] = useState({
    totalTrainees: 0,
    totalTrainingHours: 0,
  });
  const [traineesData, setTrraineesData] = useState([
    {
      totalHoursTrained: 30,
      totalEmployeesTrained: 8,
      totalHoursSpent: 6,
      trainingStartDate: "2024-04-22",
      trainingEndDate: "2024-04-26",
    },

    {
      totalHoursTrained: 20,
      totalEmployeesTrained: 5,
      totalHoursSpent: 3,
      trainingStartDate: "2024-04-13",
      trainingEndDate: "2024-04-23",
    },
    {
      totalHoursTrained: 30,
      totalEmployeesTrained: 6,
      totalHoursSpent: 5,
      trainingStartDate: "2023-07-13",
      trainingEndDate: "2023-07-23",
    },
  ]);

  const [counts, setCounts] = useState({});
  const [yearSelection, setYearSelection] = useState();
  const [flag, setFlag] = useState(false);
  const [chartDataarea, setChartDataarea] = useState({
    options: {
      chart: {
        id: "apexchart-example",
      },
      xaxis: {
        categories: [
          "Billable",
          "Non-Billable",
          "OnShore",
          "OffShore",
          "Employees",
          "Consultant",
        ],
      },
    },
    series: [],
  });
  const [yearDataarea, setYearDataarea] = useState({
    options: {
      chart: {
        id: "apexchart-example",
      },
      xaxis: {
        categories: [],
      },
    },
    series: [],
  });
  const [traineeBarChart, setTraineeBarChart] = useState({
    options: {
      chart: {
        id: "apexchart-example",
      },
      xaxis: {
        categories: ["Apr-June", "July-Sept", "Oct-Dec", "Jan-Mar"],
      },

    },
    series: [],
  });
  const [projectHealthData, setprojectHealthData] = useState({
    options: {
      chart: {
        id: "apexchart-example",
      },
      labels: ["Health", "Moderate", "HighRisk"],
      colors: ["#05796B", "#FFE57C", "#F57059"],
    },
    series: [30, 40, 50],
  });

  const [countData, setCountData] = useState({
    options: {
      chart: {
        id: "apexchart-example",
        type: "donut",
      },
      labels: ["Male", "Female"],
      colors: ["#05796B", "#F57059"],
    },

    series: [],
  });

  const [barChart, setBarChart] = useState({
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: [],
      },
    },
    series: [],
  });

  const [traineeChart, setTraineeChart] = useState({
    options: {
      chart: {
        id: "basic-bar",
        type: "donut",
      },
      labels: ["Technology"],
      // colors: ["#6A9950"],
    },
    series: [],
  });

  const [projectData, setProjectData] = useState({});
  const [projectCount, setProjectCount] = useState();
  const [availableCount, setAvailableCount] = useState();

  const [weeks, setWeeks] = useState();
  const [count, setCount] = useState();
  const [clientCount, setClientCount] = useState();
  const [utilization, setUtilizationValue] = useState();
  const [projectSumData, setProjectHealthSumData] = useState();
  const [traineeData, setTraineeData] = useState({});
  const [projectEndData, setProjectEndData] = useState();
  const [selectyear, setYear] = useState();
  const [selectedValue, setSelectedValue] = useState();
  const [clientData, setClientData] = useState([]);
  const [clientName, setClientName] = useState();
  const [projectName, setProjectName] = useState([]);

  const navigate = useNavigate();

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const numberOfWeeks = Math.ceil(
    (lastDayOfMonth.getDate() + firstDayOfMonth.getDay()) / 7
  );
  const weekNumbers = Array.from(
    { length: numberOfWeeks },
    (_, index) => index + 1
  );
  const [monthValue, setMonthValue] = useState();
  const [filteredData, setFilteredData] = useState([]);
 
  const getDatesForWeek = (weekNumber) => {
    if (monthValue === undefined) {
      const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
      const dayOfWeek =
        firstDayOfMonth.getDay() === 0 ? 7 : firstDayOfMonth.getDay();
      const startDate = new Date(
        currentYear,
        currentMonth,
        (weekNumber - 1) * 7 + 1 - dayOfWeek
      );
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      return { startDate, endDate };
    } else {
      const firstDayOfMonth = new Date(currentYear, monthValue, 1);
      const dayOfWeek =
        firstDayOfMonth.getDay() === 0 ? 7 : firstDayOfMonth.getDay();
      const startDate = new Date(
        currentYear,
        monthValue,
        (weekNumber - 1) * 7 + 1 - dayOfWeek
      );
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      return { startDate, endDate };
    }
  };

  const getDateForWeek = (currentDate) => {
    const dayOfWeek = currentDate.getDay();
    const monday = new Date(currentDate);
    monday.setDate(monday.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);
    return { startDate: monday, endDate: friday };
  };



  const getMonthDates = (year, month) => {
    if(!year ||year=="Select")year=2024
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const startMonth = startDate.getMonth();

    return { startDate, endDate };
  };

  // const getMonthDates = (year, month) => {
  //   if (!year) {
  //     year = new Date().getFullYear(); // use current year by default
  //   }
  //   month = parseInt(month, 10); // Ensure month is an integer
  //   if (!month || month === 'Select' || month < 1 || month > 12) {
  //     throw new Error('Invalid month');
  //   }
  //   const startDate = new Date(year, month - 1, 1);
  //   const endDate = new Date(year, month, 0); // setting day to 0 gets the last day of the previous month, hence the last day of the given month
  
  //   if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
  //     throw new Error('Invalid date range');
  //   }
  
  //   return { startDate, endDate };
  // };
  
  const getCurrentMonthDates = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
  
    const monthstartDate = new Date(year, month, 1);
    const monthendDate = new Date(year, month + 1, 0);
  
    return { monthstartDate, monthendDate };
  };
  
  const getYearDates = (year) => {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    return { startDate, endDate };
  };
  

  function calculateTrainingMetrics(startDate, endDate) {
    let totalTrainingHours = 0;
    let totalTrainees = 0;

    const Start = new Date(startDate);
    const End = new Date(endDate);
    traineesData.forEach((session) => {
      const sessionStartDate = new Date(session.trainingStartDate);
      const sessionEndDate = new Date(session.trainingEndDate);

      if (
        (sessionStartDate >= Start && sessionStartDate <= End) ||
        (sessionEndDate >= Start && sessionEndDate <= End) ||
        (sessionStartDate <= Start && sessionEndDate >= End)
      ) {
        const start = Math.max(sessionStartDate.getTime(), Start.getTime());
        const end = Math.min(sessionEndDate.getTime(), End.getTime());
        const sessionDurationInDays = (end - start) / (1000 * 60 * 60 * 24) + 1;
        const sessionTotalHours =
          sessionDurationInDays * session.totalHoursSpent;

        totalTrainingHours += sessionTotalHours;
        totalTrainees += session.totalEmployeesTrained;
      }
    });

    setTrainingData({ totalTrainees, totalTrainingHours });
    return {
      totalTrainingHours,
      totalTrainees,
    };
  }

  const allocResources = filteredData.filter(
    (item) => item.allocationStatus === "Allocated"
  ).length;
  const availResources = filteredData.filter(
    (item) => item.allocationStatus === "Available"
  ).length;

  const getData = () => {
    const { startDate, endDate } = getDateForWeek(new Date());

    const { monthstartDate, monthendDate } = getCurrentMonthDates();
    calculateTrainingMetrics(
      monthstartDate.toISOString().slice(0, 10),
      monthendDate.toISOString().slice(0, 10)
    );

    Pmo_Dashboard.getProjectEndingData(
      monthstartDate.toISOString().slice(0, 10),
      monthendDate.toISOString().slice(0, 10)
    ).then((res) => {
      setProjectEndData(res.data);
    });
    Pmo_Dashboard.getResourceDataList(
      startDate.toISOString().slice(0, 10),
      endDate.toISOString().slice(0, 10)
    ).then((res) => {
      setFilteredData(res.data);
      setCountData((prevState) => ({
        ...prevState,
        series: [
          res.data.filter((item) => item.gender === "Male").length,
          res.data.filter((item) => item.gender === "Female").length,
        ],
      }));
      setChartData((prevState) => ({
        ...prevState,
        series: [
          res.data.filter((item) => item.location === "Offshore").length,
          res.data.filter((item) => item.location === "Onshore").length,
        ],
      }));
      setHeadCountData((prevState) => ({
        ...prevState,
        series: [
          res.data.filter((item) => item.billability === "Billable").length,
          res.data.filter((item) => item.billability === "Non-Billable").length,
          res.data.filter((item) => item.location === "Onshore").length,
          res.data.filter((item) => item.location === "Offshore").length,
          res.data.filter((item) => item.employeeType === "Employee").length,
          res.data.filter((item) => item.employeeType === "Consultant").length,
        ],
      }));

      setChartDataarea((prevstate) => ({
        ...prevstate,
        series: [
          {
            name: "series-1",
            data: [
              res.data.filter((item) => item.billability === "Billable").length,
              res.data.filter((item) => item.billability === "Non-Billable")
                .length,
              res.data.filter((item) => item.location === "Onshore").length,
              res.data.filter((item) => item.location === "Offshore").length,
              res.data.filter((item) => item.employeeType === "Employee")
                .length,
              res.data.filter((item) => item.employeeType === "Consultant")
                .length,
            ],
          },
        ],
      }));
    });
    const currentYear = new Date();

    Pmo_Dashboard.getQuarterData(currentYear.getFullYear()).then((res) => {
      setBarChart((prevstate) => ({
        ...prevstate,
        options: {
          xaxis: {
            categories: [
              `4Q-${currentYear.getFullYear().toString().slice(-2) - 1}`,
              `1Q-${currentYear.getFullYear().toString().slice(-2)}`,
              `2Q-${currentYear.getFullYear().toString().slice(-2)}`,
              `3Q-${currentYear.getFullYear().toString().slice(-2)}`,
            ],
          },
        },
        series: [
          {
            name: "series-1",
            data: res.data
              .map((item) => item.quater1)
              .concat(res.data.map((item) => item.quater2 + item.quater1))
              .concat(
                res.data.map(
                  (item) => item.quater3 + item.quater2 + item.quater1
                )
              )
              .concat(
                res.data.map(
                  (item) =>
                    item.quater4 + item.quater3 + item.quater2 + item.quater1
                )
              ),
          },
        ],
      }));
    });

    Pmo_Dashboard.getDataOfTheYear().then((res) => {
      const dataBefore2023 = res.data.filter(
        (item) => item.year != null && item.year < 2023
      );
      const totalCountBefore2023 = dataBefore2023.reduce(
        (total, item) => total + item.count,
        0
      )
      const data2023AndBeyond = res.data.filter(
        (item) => item.year !== null && item.year >= 2023
      );
      const count2023 = res.data.find((item) => item.year === 2023)?.count || 0;
      const totalCount2023 = count2023 + totalCountBefore2023;
      const count2024 = res.data.find((item) => item.year === 2024)?.count || 0;

      const totalCount2024 = count2024 + totalCount2023;
      const categories = data2023AndBeyond
        .filter((data) => data.year !== null)
        .map((data) => data.year.toString());
      const seriesData = data2023AndBeyond
        .filter((data) => data.year !== null)
        .map((data) => data.count);
      seriesData.unshift(totalCount2023);

      setYearDataarea((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: ["2023", "2024"],
          },
        },
        series: [
          {
            name: "series-1",
            data: [totalCount2023, totalCount2024],
          },
        ],
      }));
    });

    Pmo_Dashboard.getTotalTrainingHrs(
      startDate.toISOString().slice(0, 10),
      endDate.toISOString().slice(0, 10)
    ).then((res) => {
      res.data.map((data) => {
        setTraineeData(data);
      });
    });
    Pmo_Dashboard.getByTrainingArea(
      startDate.toISOString().slice(0, 10),
      endDate.toISOString().slice(0, 10)
    ).then((res) => { });
    Pmo_Dashboard.getDistinctClientNames().then((res) => {

      setClientData(
        Array.from(new Set(res.data.map(JSON.stringify)), JSON.parse)
      );
    });
    Pmo_Dashboard.getNumberOfClients().then((res) => {
      const label = res.data
        .filter((item) => item.ClientCode !== null && item.ClientCode !== "NA")
        .map((item) => item.ClientCode);

      const series = res.data
        .filter((item) => item.ClientCode !== null && item.ClientCode !== "NA")
        .map((item) => item.Count);
      setClientsChart({
        options: {
          ...clientsChart.options,
          labels: label,
        },
        series: series,
      });
    });

    Pmo_Dashboard.getProjectCounts().then((res) => {
      setProjectData(res.data);
    });
    Pmo_Dashboard.getEmployeesData().then((res) => {
      setProjectCount(res.data);
    });
    Pmo_Dashboard.getResourceCount().then((res) => {
      setCounts(res.data);
      setCountData((prevState) => ({
        ...prevState,
        series: [res.data.Male, res.data.Female],
      }));
    });

    Pmo_Dashboard.getEmployeesAllocatedData().then((res) => {
      setAvailableCount(res.data);
    });
  }

  useEffect(() => {
    getData();
  }, [yearSelection]);

  const handleClearFilter = () => {
    setSubsidiary("Select");
    setClientName("Select"); 
    setWeeks("Select");
    setFlag(false);
    setProjectName([]);
    setMonthValue("Select");
    setYear("Select");
    getData();
  }

  const handleSelectClientName = (e) => {
    setFlag(true);
    setClientName(e.target.value);
    Pmo_Dashboard.getDataForClientName(e.target.value, null).then((res) => {
      const billableData = res.data.filter(
        (data) => data.billability === "Billable"
      );
      const nonBillableData = res.data.filter(
        (data) => data.billability === "Non-Billable"
      );
      const offShoreData = res.data.filter(
        (data) => data.location === "Offshore"
      );
      const EmployeeData = res.data.filter(
        (data) => data.employeeType === "Employee"
      );
      const consultantData = res.data.filter(
        (data) => data.employeeType === "Consultant"
      );
      setCounts({
        Billable: billableData.length,
        NonBillable: nonBillableData.length,
        OnSite: 0,
        OffSite: offShoreData.length,
        FullTime: EmployeeData.length,
        Consultant: consultantData.length,
      });
    });
    Pmo_Dashboard.getDataForProjects(e.target.value).then((res) => {
      setProjectName(res.data);
    });
  };
  const handleSelectProjectName = (e) => {

  };

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
  return (
    <>
      <Row style={{paddingTop:"2%",marginBottom:'1%'}} className="main_card">
        <Col>
          <Row> <Label><b>Subsidiary</b></Label></Row>
          <Row>
            <select
              style={{
                border: "1px solid gray",
                borderRadius: "4px",
                fontWeight: "bold",
                width: "70%"
              }}
              value={subsidiary}
              onChange={(e) => setSubsidiary(e.target.value)}
            >
              <option value="" style={{ fontWeight: "bold" }}>
                Select
              </option>
              <option value="Saplica" style={{ fontWeight: "bold" }}>
                Saplica
              </option>
              <option value="Infoway" style={{ fontWeight: "bold" }}>
                Infoway
              </option>
              <option value="SSInc" style={{ fontWeight: "bold" }}>
                SSInc
              </option>
            </select></Row>
        </Col>
        <Col>
          <Row>
            <Label>
              <b>Account</b>
            </Label>
          </Row>
          <Row>
            <select
              style={{
                border: "1px solid gray",
                borderRadius: "4px",
                fontWeight: "bold",
                width: "70%"
              }}
              value = {clientName}
              onChange={(e) => handleSelectClientName(e)}
            >
              <option value="Select">Select</option>
              {clientData.map((item) => (
                <option key={item[1]} value={item[1]}>
                  {item[0]}
                </option>
              ))}
            </select></Row>
        </Col>
        <Col>
          <Row><Label className="form-label"><b>Project</b></Label></Row>
          <Row>
            <select
              style={{
                border: "1px solid gray",
                borderRadius: "4px",
                fontWeight: "bold",
                width: "70%"
              }}
              onChange={(e) => handleSelectProjectName(e)}
            >
              <option value="Select">Select</option>
              {projectName.map((item) => (
                <option value={item}>{item}</option>
              ))}
            </select></Row>
        </Col>
        <Col>
          <Row><Label className="form-label"><b>Week</b></Label></Row>
          <Row>
            <select
              style={{
                border: "1px solid gray",
                borderRadius: "4px",
                fontWeight: "bold",
                width: "70%"
              }}
              value={weeks}
              onChange={(e) => {
                setWeeks(e.target.value);
                setFlag(true);
                if (e.target.value === "Select") {
                } else {
                  const { startDate, endDate } = getDatesForWeek(
                    e.target.value
                  );
                  if (startDate instanceof Date && endDate instanceof Date &&!isNaN(startDate) &&!isNaN(endDate)) {
                    Pmo_Dashboard.getTotalTrainingHrs(
                      startDate.toISOString().slice(0, 10),
                      endDate.toISOString().slice(0, 10)
                    ).then((res) => {
                      res.data.map((data) => {
                        setTraineeData(data);
                      });
                    });
                    Pmo_Dashboard.getResourceDataList(
                      startDate.toISOString().slice(0, 10),
                      endDate.toISOString().slice(0, 10)
                    ).then((res) => {
                      setFilteredData(res.data);
                      setCountData((prevState) => ({
                        ...prevState,
                        series: [
                          res.data.filter((item) => item.gender === "Male")
                            .length,
                          res.data.filter((item) => item.gender === "Female")
                            .length,
                        ],
                      }));
                      setChartData((prevState) => ({
                        ...prevState,
                        series: [
                          res.data.filter((item) => item.location === "Offshore")
                            .length,
  
                          res.data.filter((item) => item.location === "Onshore")
                            .length,
                        ],
                      }));
                      setHeadCountData((prevState) => ({
                        ...prevState,
                        series: [
                          res.data.filter(
                            (item) => item.billability === "Billable"
                          ).length,
                          res.data.filter(
                            (item) => item.billability === "Non-Billable"
                          ).length,
                          res.data.filter((item) => item.location === "Onshore")
                            .length,
                          res.data.filter((item) => item.location === "Offshore")
                            .length,
                          res.data.filter(
                            (item) => item.employeeType === "Employee"
                          ).length,
                          res.data.filter(
                            (item) => item.employeeType === "Consultant"
                          ).length,
                        ],
                      }));
                      setChartDataarea((prevstate) => ({
                        ...prevstate,
                        series: [
                          {
                            name: "series-1",
                            data: [
                              res.data.filter(
                                (item) => item.billability === "Billable"
                              ).length,
                              res.data.filter(
                                (item) => item.billability === "Non-Billable"
                              ).length,
                              res.data.filter(
                                (item) => item.location === "Onshore"
                              ).length,
                              res.data.filter(
                                (item) => item.location === "Offshore"
                              ).length,
                              res.data.filter(
                                (item) => item.employeeType === "Employee"
                              ).length,
                              res.data.filter(
                                (item) => item.employeeType === "Consultant"
                              ).length,
                            ],
                          },
                        ],
                      }));
                    });
                  } else {

                    console.error("Invalid dates returned from getDatesForWeek");
                    console.error('startDate:', startDate);
                    console.error('endDate:', endDate);
                  }
                }
              }}
            >
              <option value="Select">Select</option>
              {weekNumbers.map((week) => (
                <option value={week}>{"Week" + week}</option>
              ))}
            </select></Row>
        </Col>
        <Col>
          <Row><Label className="form-label"><b>Month</b></Label></Row>
          <Row>
            <select
              style={{
                border: "1px solid gray",
                borderRadius: "4px",
                fontWeight: "bold",
                width: "70%"
              }}
              value={monthValue}
              onChange={(e) => {
                setMonthValue(e.target.value);
                
                setFlag(true);
                if (e.target.value === "Select") {
                } else {
                  var year;
                  if (selectyear === undefined) {
                    year = new Date().getFullYear();
                  } else {
                    year = selectyear;
                  }
                  const { startDate, endDate } = getMonthDates(
                    year,
                    e.target.value
                  );

                  // calculateTrainingMetrics(
                  //   startDate.toISOString().slice(0, 10),
                  //   endDate.toISOString().slice(0, 10)
                  // );
                  Pmo_Dashboard.getTotalTrainingHrs(
                    startDate.toISOString().slice(0, 10),
                    endDate.toISOString().slice(0, 10)
                  ).then((res) => {
                    res.data.map((data) => {
                      setTraineeData(data);
                    });
                  });
                  Pmo_Dashboard.getByTrainingArea(
                    startDate.toISOString().slice(0, 10),
                    endDate.toISOString().slice(0, 10)
                  ).then((res) => { });
                  Pmo_Dashboard.getResourceDataList(
                    startDate.toISOString().slice(0, 10),
                    endDate.toISOString().slice(0, 10)
                  ).then((res) => {
                    setFilteredData(res.data);
                    setCountData((prevState) => ({
                      ...prevState,
                      series: [
                        res.data.filter((item) => item.gender === "Male")
                          .length,
                        res.data.filter((item) => item.gender === "Female")
                          .length,
                      ],
                    }));
                    setChartData((prevState) => ({
                      ...prevState,
                      series: [
                        res.data.filter((item) => item.location === "Offshore")
                          .length,
                        res.data.filter((item) => item.location === "Onshore")
                          .length,
                      ],
                    }));
                    // setTraineesData((prevState) => ({
                    //   ...prevState,
                    // }))
                    setHeadCountData((prevState) => ({
                      ...prevState,
                      series: [
                        res.data.filter(
                          (item) => item.billability === "Billable"
                        ).length,
                        res.data.filter(
                          (item) => item.billability === "Non-Billable"
                        ).length,
                        res.data.filter((item) => item.location === "Onshore")
                          .length,
                        res.data.filter((item) => item.location === "Offshore")
                          .length,
                        res.data.filter(
                          (item) => item.employeeType === "Employee"
                        ).length,
                        res.data.filter(
                          (item) => item.employeeType === "Consultant"
                        ).length,
                      ],
                    }));
                    setChartDataarea((prevstate) => ({
                      ...prevstate,
                      series: [
                        {
                          name: "series-1",
                          data: [
                            res.data.filter(
                              (item) => item.billability === "Billable"
                            ).length,
                            res.data.filter(
                              (item) => item.billability === "Non-Billable"
                            ).length,
                            res.data.filter(
                              (item) => item.location === "Onshore"
                            ).length,
                            res.data.filter(
                              (item) => item.location === "Offshore"
                            ).length,
                            res.data.filter(
                              (item) => item.employeeType === "Employee"
                            ).length,
                            res.data.filter(
                              (item) => item.employeeType === "Consultant"
                            ).length,
                          ],
                        },
                      ],
                    }));
                  });
                  Pmo_Dashboard.getProjectEndingData(
                    startDate.toISOString().slice(0, 10),
                    endDate.toISOString().slice(0, 10)
                  ).then((res) => {
                    setProjectEndData(res.data);
                  });
                  Pmo_Dashboard.getDataBasedOnMonthAndYear(
                    e.target.value,
                    year
                  ).then((res) => {
                    setFilteredData(res.data);
                    setCountData((prevState) => ({
                      ...prevState,
                      series: [
                        res.data.filter((item) => item.gender === "Male")
                          .length,
                        res.data.filter((item) => item.gender === "Female")
                          .length,
                      ],
                    }));
                    setChartData((prevState) => ({
                      ...prevState,
                      series: [
                        res.data.filter((item) => item.location === "Offshore")
                          .length,

                        res.data.filter((item) => item.location === "Onshore")
                          .length,
                      ],
                    }));
                    setHeadCountData((prevState) => ({
                      ...prevState,
                      series: [
                        res.data.filter(
                          (item) => item.billability === "Billable"
                        ).length,
                        res.data.filter(
                          (item) => item.billability === "Non-Billable"
                        ).length,
                        res.data.filter((item) => item.location === "Onshore")
                          .length,
                        res.data.filter((item) => item.location === "Offshore")
                          .length,
                        res.data.filter(
                          (item) => item.employeeType === "Employee"
                        ).length,
                        res.data.filter(
                          (item) => item.employeeType === "Consultant"
                        ).length,
                      ],
                    }));
                    setChartDataarea((prevstate) => ({
                      ...prevstate,
                      series: [
                        {
                          name: "series-1",
                          data: [
                            res.data.filter(
                              (item) => item.billability === "Billable"
                            ).length,
                            res.data.filter(
                              (item) => item.billability === "Non-Billable"
                            ).length,
                            res.data.filter(
                              (item) => item.location === "Onshore"
                            ).length,
                            res.data.filter(
                              (item) => item.location === "Offshore"
                            ).length,
                            res.data.filter(
                              (item) => item.employeeType === "Employee"
                            ).length,
                            res.data.filter(
                              (item) => item.employeeType === "Consultant"
                            ).length,
                          ],
                        },
                      ],
                    }));
                  });
                }
              }}
            >
              <option value="Select">Select</option>
              {monthOptions.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select></Row>
        </Col>
        <Col>
          <Row>
          <Label className="form-label"><b>Year</b></Label>
          </Row>
          <Row>
            <select
              style={{
                border: "1px solid gray",
                borderRadius: "4px",
                fontWeight: "bold",
                width: "70%"
              }}
              value={selectyear}
              onChange={(e) => {
                setYear(e.target.value);
                setWeeks(e.target.value);

                setFlag(true);
                if (e.target.value === "Select") {
                } else {
                  // setYearSelection(e.target.value.toString().slice(-2));
                  const { startDate, endDate } = getYearDates(e.target.value);
                  calculateTrainingMetrics(
                    startDate.toISOString().slice(0, 10),
                    endDate.toISOString().slice(0, 10)
                  );
                  Pmo_Dashboard.getTotalTrainingHrs(
                    startDate.toISOString().slice(0, 10),
                    endDate.toISOString().slice(0, 10)
                  ).then((res) => {
                    res.data.map((data) => {
                      setTraineeData(data);
                    });
                  });
                  Pmo_Dashboard.getQuarterlyData(e.target.value).then(
                    (res1) => {
                      Pmo_Dashboard.getQuarterlyNominatedData(
                        e.target.value
                      ).then((res2) => {
                        Pmo_Dashboard.getQuarterlyTechAreaData(
                          e.target.value
                        ).then((res3) => {
                          setTraineeBarChart((prevState) => ({
                            ...prevState,
                            series: [
                              {
                                name: "Training Hours",
                                data: res1.data
                                  .map((item) => item.quater4)
                                  .concat(res1.data.map((item) => item.quater1))
                                  .concat(res1.data.map((item) => item.quater2))
                                  .concat(
                                    res1.data.map((item) => item.quater3)
                                  ),
                              },
                              {
                                name: "Nominated Trainees",
                                data: res2.data
                                  .map((item) => item.quater4)
                                  .concat(res2.data.map((item) => item.quater1))
                                  .concat(res2.data.map((item) => item.quater2))
                                  .concat(
                                    res2.data.map((item) => item.quater3)
                                  ),
                              },
                              {
                                name: "Training Area",
                                data: res3.data
                                  .map((item) => item.quater4)
                                  .concat(res3.data.map((item) => item.quater1))
                                  .concat(res3.data.map((item) => item.quater2))
                                  .concat(
                                    res3.data.map((item) => item.quater3)
                                  ),
                              },
                            ],
                            options: {
                              chart: {
                                id: "trainee-bar-chart",
                                toolbar: {
                                  show: false,
                                },
                              },
                              xaxis: {
                                categories: [
                                  `4Q-${e.target.value.toString().slice(-2) - 1
                                  }`,
                                  `1Q-${e.target.value.toString().slice(-2)}`,
                                  `2Q-${e.target.value.toString().slice(-2)}`,
                                  `3Q-${e.target.value.toString().slice(-2)}`,
                                ],
                              },
                              tooltip: {
                                enabled: true,
                                custom: function ({
                                  series,
                                  seriesIndex,
                                  dataPointIndex,
                                  w,
                                }) {
                                  return `<div class="custom-tooltip" style = {{color : 'black', width : '100%'}}>${series[seriesIndex][dataPointIndex]}</div>`;
                                },
                              },
                              markers: {
                                size: 10,
                                colors: ["#008FFB", "#00E396", "#FEB019"],
                              },
                              dataLabels: {
                                enabled: true,
                                enabledOnSeries: [0, 1, 2],
                                formatter: function (val) {
                                  return val;
                                },
                                offsetY: -10,
                              },
                            },
                          }));
                        });
                      });
                    }
                  );

                  Pmo_Dashboard.getResourceDataList(
                    startDate.toISOString().slice(0, 10),
                    endDate.toISOString().slice(0, 10)
                  ).then((res) => {
                    setFilteredData(res.data);
                    setCountData((prevState) => ({
                      ...prevState,
                      series: [
                        res.data.filter((item) => item.gender === "Male")
                          .length,
                        res.data.filter((item) => item.gender === "Female")
                          .length,
                      ],
                    }));
                    setChartData((prevState) => ({
                      ...prevState,
                      series: [
                        res.data.filter((item) => item.location === "Offshore")
                          .length,
                        res.data.filter((item) => item.location === "Onshore")
                          .length,
                      ],
                    }));
                    setHeadCountData((prevState) => ({
                      ...prevState,
                      series: [
                        res.data.filter(
                          (item) => item.billability === "Billable"
                        ).length,
                        res.data.filter(
                          (item) => item.billability === "Non-Billable"
                        ).length,
                        res.data.filter((item) => item.location === "Onshore")
                          .length,
                        res.data.filter((item) => item.location === "Offshore")
                          .length,
                        res.data.filter(
                          (item) => item.employeeType === "Employee"
                        ).length,
                        res.data.filter(
                          (item) => item.employeeType === "Consultant"
                        ).length,
                      ],
                    }));
                    const dataBefore2023 = res.data.filter(
                      (item) => item.year != null && item.year < 2023
                    );
                    const totalCountBefore2023 = dataBefore2023.reduce(
                      (total, item) => total + item.count,
                      0
                    );
                    setChartDataarea((prevstate) => ({
                      ...prevstate,
                      series: [
                        {
                          name: "series-1",
                          data: [
                            res.data.filter(
                              (item) => item.billability === "Billable"
                            ).length,
                            res.data.filter(
                              (item) => item.billability === "Non-Billable"
                            ).length,
                            res.data.filter(
                              (item) => item.location === "Onshore"
                            ).length,
                            res.data.filter(
                              (item) => item.location === "Offshore"
                            ).length,
                            res.data.filter(
                              (item) => item.employeeType === "Employee"
                            ).length,
                            res.data.filter(
                              (item) => item.employeeType === "Consultant"
                            ).length,
                          ],
                        },
                      ],
                    }));
                  });
                  Pmo_Dashboard.getProjectEndingData(
                    startDate.toISOString().slice(0, 10),
                    endDate.toISOString().slice(0, 10)
                  ).then((res) => {
                    setProjectEndData(res.data);
                  });

                  Pmo_Dashboard.getQuarterData(e.target.value).then((res) => {
                    setBarChart((prevstate) => ({
                      ...prevstate,
                      options: {
                        xaxis: {
                          categories: [
                            `4Q-${e.target.value.toString().slice(-2) - 1}`,
                            `1Q-${e.target.value.toString().slice(-2)}`,
                            `2Q-${e.target.value.toString().slice(-2)}`,
                            `3Q-${e.target.value.toString().slice(-2)}`,
                          ],
                        },
                      },
                      series: [
                        {
                          name: "series-1",
                          data: res.data
                            .map((item) => item.quater1)
                            .concat(
                              res.data.map(
                                (item) => item.quater2 + item.quater1
                              )
                            )
                            .concat(
                              res.data.map(
                                (item) =>
                                  item.quater3 + item.quater2 + item.quater1
                              )
                            )
                            .concat(
                              res.data.map(
                                (item) =>
                                  item.quater4 +
                                  item.quater3 +
                                  item.quater2 +
                                  item.quater1
                              )
                            ), // Corrected to item.quater4
                        },
                      ],
                    }));
                  });
                  Pmo_Dashboard.getDataBasedOnYear(e.target.value).then(
                    (res) => {
                      setFilteredData(res.data);
                      setCountData((prevState) => ({
                        ...prevState,
                        series: [
                          res.data.filter((item) => item.gender === "Male")
                            .length,
                          res.data.filter((item) => item.gender === "Female")
                            .length,
                        ],
                      }));
                      setChartData((prevState) => ({
                        ...prevState,
                        series: [
                          res.data.filter(
                            (item) => item.location === "Offshore"
                          ).length,

                          res.data.filter((item) => item.location === "Onshore")
                            .length,
                        ],
                      }));
                      setHeadCountData((prevState) => ({
                        ...prevState,
                        series: [
                          res.data.filter(
                            (item) => item.billability === "Billable"
                          ).length,
                          res.data.filter(
                            (item) => item.billability === "Non-Billable"
                          ).length,
                          res.data.filter((item) => item.location === "Onshore")
                            .length,
                          res.data.filter(
                            (item) => item.location === "Offshore"
                          ).length,
                          res.data.filter(
                            (item) => item.employeeType === "Employee"
                          ).length,
                          res.data.filter(
                            (item) => item.employeeType === "Consultant"
                          ).length,
                        ],
                      }));
                      setChartDataarea((prevstate) => ({
                        ...prevstate,
                        series: [
                          {
                            name: "series-1",
                            data: [
                              res.data.filter(
                                (item) => item.billability === "Billable"
                              ).length,
                              res.data.filter(
                                (item) => item.billability === "Non-Billable"
                              ).length,
                              res.data.filter(
                                (item) => item.location === "Onshore"
                              ).length,
                              res.data.filter(
                                (item) => item.location === "Offshore"
                              ).length,
                              res.data.filter(
                                (item) => item.employeeType === "Employee"
                              ).length,
                              res.data.filter(
                                (item) => item.employeeType === "Consultant"
                              ).length,
                            ],
                          },
                        ],
                      }));
                    }
                  );
                }
              }}
            >
              <option value="Select">Select</option>
              {yearOptions.map((year) => (
                <option key={year.value} value={year.value}>
                  {year.label}
                </option>
              ))}
            </select>
          </Row>
        </Col>
        <Col style={{paddingTop:"1%"}} >
          <Button className="btn-danger" onClick = { () => handleClearFilter()}>Clear Filters</Button>
        </Col>
      </Row>

      <div className="row  mb-3 main_card">
        <Card className="overview">
          <CardHeader className="header">
            PROJECTS{" "}
            <span style={{ float: "right" }}>
              <select onChange={(e) => setClientCount(e.target.value)}>
                <option value="Data">Data</option>
                <option value="Chart">Chart</option>
              </select>
            </span>
          </CardHeader>
          {clientCount === "Chart" ? (
            <Chart
              options={clientsChart.options}
              series={clientsChart.series}
              type="donut"
              width={500}
              height={270}
            />
          ) : (
            <CardBody>
              <div class="row">
                <div class="col">
                  <Card className="projects_number">
                    <p className="count">{projectData.TotalProject}</p>
                    <p className="text_name">TOTAL NUMBER OF PROJECTS</p>
                  </Card>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <Card className="projects">
                    <p className="count">09</p>
                    <p className="text_name">RED PROJECTS</p>
                  </Card>
                </div>

                <div class="col">
                  <Card className="active_project">
                    <p className="count">11</p>
                    <p className="text_name">HIGH RISK PROJECTS</p>
                  </Card>
                </div>
              </div>
            </CardBody>
          )}
        </Card>
        <Card className="head_count" inverse>
          <CardHeader className="header">
            HEAD COUNT
            <span style={{ float: "right" }}>
              <select onChange={(e) => setCount(e.target.value)}>
                <option value="Data">Data</option>
                <option value="Chart">Chart</option>
              </select>
            </span>
          </CardHeader>
          {count === "Chart" ? (
            <Chart
              options={headCountData.options}
              series={headCountData.series}
              type="donut"
              width={500}
              height={270}
            />
          ) : (
            <CardBody>
              <div class="row">
                <div class="col">
                  <Card className="inner_card">
                    <p className="count">{counts.Billable}</p>
                    <p className="inner_text_name">BILLABLE</p>
                    <div className="billable-bar"></div>
                  </Card>
                </div>
                <div class="col">
                  <Card className="inner_card">
                    <p className="count">{counts.NonBillable}</p>
                    <p className="inner_text_name">NON-BILLABLE</p>
                    <div className="nonbillable-bar"></div>
                  </Card>
                </div>
                <div class="col">
                  <Card className="inner_card">
                    <p className="count">{counts.OnSite}</p>
                    <p className="inner_text_name">ONSHORE</p>
                    <div className="onsite-bar"></div>
                  </Card>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <Card className="inner_card">
                    <p className="count">{counts.FullTime}</p>
                    <p className="inner_text_name">EMPLOYEES</p>
                    <div className="employees-bar"></div>
                  </Card>
                </div>
                <div class="col">
                  <Card className="inner_card">
                    <p className="count">{counts.Consultant}</p>
                    <p className="inner_text_name">CONSULTANT</p>
                    <div className="consultant-bar"></div>
                  </Card>
                </div>
                <div class="col">
                  <Card className="inner_card">
                    <p className="count">{counts.OffSite}</p>
                    <p className="inner_text_name">OFFSHORE</p>
                    <div className="offsite-bar"></div>
                  </Card>
                </div>

                {/* <div class="col">
                  <Card className="inner_card">
                    <p className="count">12</p>
                    <p className="inner_text_name">ONBOARD</p>
                    <div className="onboard-bar"></div>
                  </Card>
                </div>
                <div class="col">
                  <Card className="inner_card">
                    <p className="count">04</p>
                    <p className="inner_text_name">OFFBOARD</p>
                    <div className="offboard-bar"></div>
                  </Card>
                </div> */}
              </div>
            </CardBody>
          )}
        </Card>
        <Card className="head_count" inverse>
          <CardHeader className="header">
            EMPLOYEES AVAILABLE AND INTERNS
          </CardHeader>
          <CardBody>
            <div class="row">
              {flag === true ? (
                <div class="col">
                  <Card className="inner_card_count">
                    <p className="count">{allocResources}</p>
                    <p className="inner_text_name">ALLOCATED RESOURCES</p>
                  </Card>
                </div>
              ) : null}
              <div class="col">
                <Card className="inner_card_count">
                  <p className="count">
                    {flag === true ? availResources : projectCount}
                  </p>
                  <p className="inner_text_name">AVAILABLE RESOURCES</p>
                </Card>
              </div>
              <div class="col">
                <Card className="inner_card_count">
                  <p className="count">{projectEndData}</p>
                  <p className="inner_text_name">NEARING END OF PROJECT</p>
                </Card>
              </div>
              <div class="col">
                <Card className="inner_card_count">
                  <p className="count">22</p>
                  <p className="inner_text_name">TRAINEES</p>
                </Card>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="head_count" inverse>
          <CardHeader className="header">
            PROJECT HEALTH SUMMARY
            <span style={{ float: "right" }}>
              <select onChange={(e) => setProjectHealthSumData(e.target.value)}>
                <option value="Data">Data</option>
                <option value="Chart">Chart</option>
              </select>
            </span>
          </CardHeader>
          {projectSumData === "Chart" ? (
            <CardBody>
              <Chart
                options={projectHealthData.options}
                series={projectHealthData.series}
                type="donut"
                width={500}
                height={270}
              />
            </CardBody>
          ) : (
            <CardBody>
              <Table
                bordered
                className="tabel_content"
                hover
                responsive
                size=""
                style={{ border: "1px solid #0000001A" }}
              >
                <thead
                  style={{
                    backgroundColor: "#F6F6F6",
                    borderBottom: "none",
                    border: "1px solid white",
                  }}
                >
                  <tr>
                    <th className="tabelHeadings">Project Name</th>
                    <th className="tabelHeadings">RAG</th>
                    <th className="tabelHeadings">Reason For RAG</th>
                  </tr>
                </thead>
                <tbody style={{ border: "1px solid white" }}>
                  <tr>
                    <td>Walmart</td>
                    <td>
                      <span className="circle"></span>
                    </td>
                    <td>Testing Purpose For Walmat Project</td>
                  </tr>
                  <tr>
                    <td>PFV</td>
                    <td>
                      <span className="circle"></span>
                    </td>
                    <td>Testing Purpose For Walmat Project</td>
                  </tr>
                </tbody>
              </Table>
            </CardBody>
          )}
        </Card>
        <Card className="head_count" inverse>
          <CardHeader className="header">
            HEADCOUNT RUNRATE
            <span style={{ float: "right" }}>
              <select
                onChange={(e) => {
                  setUtilizationValue(e.target.value);
                }}
              >
                <option value="Data">Data</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </span>
          </CardHeader>
          {utilization === "Yearly" ? (
            <CardBody>
              <Chart
                options={yearDataarea.options}
                series={yearDataarea.series}
                type="bar"
                width={470}
                height={270}
              />
            </CardBody>
          ) : utilization === "Quarterly" ? (
            <CardBody>
              <Chart
                options={barChart.options}
                series={barChart.series}
                type="bar"
                width={470}
                height={270}
              />
            </CardBody>
          ) : (
            <CardBody>
              <Chart
                options={chartDataarea.options}
                series={chartDataarea.series}
                type="area"
                width={470}
                height={270}
              />
            </CardBody>
          )}
        </Card>
        <Card className="head_count" inverse>
          <CardHeader className="header">
            LEARNING AND DEVELOPMENT
            <span style={{ float: "right" }}>
              <select onChange={(e) => setSelectedValue(e.target.value)}>
                <option value="Data">Data</option>

                <option value="Run-Rate">Run-Rate</option>
              </select>
            </span>
          </CardHeader>
          {selectedValue === "Run-Rate" ? (
            <Chart
              options={traineeBarChart.options}
              series={traineeBarChart.series}
              type="line"
              width={500}
              height={270}
            />
          ) : (
            <CardBody>
              <div class="row">
                <div class="col">
                  <Card className="inner_card_count">
                    <p className="count">
                      {traineeData["sum(NumberOfTrainingHours)"] || 10}
                    </p>
                    <p className="inner_text_name">Total Hours Trained</p>
                    {/* <div className="billable-bar"></div> */}
                  </Card>
                </div>
                <div class="col">
                  <Card className="inner_card_count">
                    <p className="count">
                      {traineeData["Count(NumberOfNominees)"]}
                    </p>
                    <p className="inner_text_name">Employees Trained</p>
                    {/* <div className="billable-bar"></div> */}
                  </Card>
                </div>
              </div>
            </CardBody>
          )}
        </Card>

        <Card className="head_count" inverse>
          <CardHeader className="header">ONSITE VS OFFSITE</CardHeader>
          <CardBody>
            <Chart
              options={chartData.options}
              series={chartData.series}
              type="donut"
              width={500}
              height={270}
            />
          </CardBody>
        </Card>

        <Card className="head_count" inverse>
          <CardHeader className="header">MALE VS FEMALE</CardHeader>
          <CardBody>
            <Chart
              options={countData.options}
              series={countData.series}
              type="donut"
              width={500}
              height={270}
            />
          </CardBody>
        </Card>
        <Card className="resource_count" inverse>
          <CardHeader className="header">
            PROJECT RESOURCES
            <Input
              type="text"
              placeholder="Search"
              // value={searchTerm}
              outline
              className="searchbox"
            // onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CardHeader>

          <CardBody>
            <Card className="resources">
              <p
                style={{
                  color: "#5F5B7E",
                  marginTop: "-2%",
                  marginLeft: "-5%",
                  fontWeight: "500",
                  fontSize: "13px",
                }}
              >
                Roger Korsgaard
              </p>
              <p
                style={{
                  color: "#5F5B7E",
                  marginTop: "0%",
                  marginLeft: "-5%",
                  fontWeight: "400",
                  fontSize: "10px",
                }}
              >
                Project name{" "}
              </p>
            </Card>
            <Card className="resources">
              <p
                style={{
                  color: "#5F5B7E",
                  marginTop: "-2%",
                  marginLeft: "-5%",
                  fontWeight: "500",
                  fontSize: "13px",
                }}
              >
                Roger Korsgaard
              </p>
              <p
                style={{
                  color: "#5F5B7E",
                  marginTop: "0%",
                  marginLeft: "-5%",
                  fontWeight: "400",
                  fontSize: "10px",
                }}
              >
                Project name{" "}
              </p>
            </Card>
            <Card className="resources">
              <p
                style={{
                  color: "#5F5B7E",
                  marginTop: "-2%",
                  marginLeft: "-5%",
                  fontWeight: "500",
                  fontSize: "13px",
                }}
              >
                Roger Korsgaard
              </p>
              <p
                style={{
                  color: "#5F5B7E",
                  marginTop: "0%",
                  marginLeft: "-5%",
                  fontWeight: "400",
                  fontSize: "10px",
                }}
              >
                Project name{" "}
              </p>
            </Card>
            <Card className="resources">
              <p
                style={{
                  color: "#5F5B7E",
                  marginTop: "-2%",
                  marginLeft: "-5%",
                  fontWeight: "500",
                  fontSize: "13px",
                }}
              >
                Roger Korsgaard
              </p>
              <p
                style={{
                  color: "#5F5B7E",
                  marginTop: "0%",
                  marginLeft: "-5%",
                  fontWeight: "400",
                  fontSize: "10px",
                }}
              >
                Project name{" "}
              </p>
            </Card>
            <Card className="resources">
              <span
                style={{
                  color: "#73708E",
                  fontWeight: "500",
                  fontSize: "11px",
                  marginLeft: "-9%",
                  marginTop: "-7px",
                }}
              >
                View All
              </span>
            </Card>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
