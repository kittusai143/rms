import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Row, Col } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import { getReq, postReq } from "../Api/api";
import "../CSS/FiltersSideBar.css"; // Import custom CSS file for styling
import { MultiSelect } from "react-multi-select-component";
import MultiRangeSlider from "multi-range-slider-react";
import Select from 'react-select'

function FiltersSideBar(props) {
  const url = process.env.REACT_APP_URL;
  const [techGroups, setTechGroups] = useState([]);
  const [skills, setSkills] = useState([]);
  const [domain, setDomain] = useState([]);
  const [locations, setlocations] = useState();
  const [role, setroles] = useState();
  const today = new Date();
  const twoMonthsFromNow = new Date(
    new Date().setDate(new Date().getDate() + 90)
  );
  const available = [
    { label: "Available", value: "Available" },
    { label: "Allocated", value: "Allocated" },
  ];
  const [minValue, set_minValue] = useState(
    props.lastAppliedFilters.yearsOfExp[0] || 0
  );
  const [maxValue, set_maxValue] = useState(
    props.lastAppliedFilters.yearsOfExp[1] || 30
  );
  const handleInput = (e) => {
    const { minValue, maxValue } = e;
    set_minValue(minValue);
    set_maxValue(maxValue);
    handleMInputChange([minValue, maxValue], "yearsOfExp");
  };
  const subFilters = [
    { label: "1 Week Nearby", value: 1 },
    { label: "2 Weeks Nearby", value: 2 },
    { label: "3 Weeks Nearby", value: 3 }
  ];

  const [optionsSelected, setOptionsSelected] = useState(
    props.lastAppliedFilters
  );

  useEffect(() => {
    getReq(url + "techgroup/getDistinctGroups").then((data) => {
      setTechGroups(
        data?.data?.length > 0 &&
        data?.data?.map((d) => {
          return { label: d, value: d };
        })
      );
    });

    getReq(url + "techgroup/getAll").then((data) => {
      setSkills(
        data?.data?.length > 0 &&
        data?.data?.map((d) => {
          return { label: d.techSkill, value: d.techSkill, techGroup: d.techGroup };
        })
      );
    });

    getReq(url + "domain/getAll").then((data) => {
      setDomain(
        data.data?.length > 0 &&
        data.data?.map((d) => {
          return { label: d.domainName, value: d.domainId };
        })
      );
    });

    getReq(url + "ResAlloc/getRoles").then((data) => {
      setroles(
        data.data?.length > 0 &&
        data.data?.map((d) => {
          return { label: d, value: d };
        })
      );
    });

    getReq(url + "ResAlloc/getLocations").then((data) => {
      setlocations(
        data.data?.length > 0 &&
        data.data?.map((d) => {
          return { label: d, value: d };
        })
      );
    });

    if (props.lastAppliedFilters) {
      setOptionsSelected(props.lastAppliedFilters);
    }
  }, []);

  const filteredSkills = skills.filter((skill) => {
    const selectedTechGroups = optionsSelected.techGroups.map(
      (group) => group.value
    );
    return selectedTechGroups.includes(skill.techGroup);
  });


  const skillOptions = filteredSkills.map((skill) => ({
    label: skill.value,
    value: skill.value,
  }));

  // const handleMInputChange = (selectedOptions, fieldName) => {
  //   // console.log(selectedOptions);
  //   if (fieldName !== "yearsOfExp") {
  //     setOptionsSelected((prevCycle) => ({
  //       ...prevCycle,
  //       [fieldName]: selectedOptions?.map((option) => ({
  //         label: option.value,
  //         value: option.value,
  //       })),
        
  //     }));
  //     // console.log(selectedOptions);
  //     props.setLastAppliedFilters(optionsSelected);
  //     // console.log(selectedOptions);

  //     props.setAPI((prevCycle) => ({
  //       ...prevCycle,
  //       [fieldName]: selectedOptions.map((option) => option.value),
  //     }));

  //     return;
  //   }
  //   setOptionsSelected((prevCycle) => ({
  //     ...prevCycle,
  //     [fieldName]: selectedOptions.map((option) => option),
  //   }));
  //   props.setLastAppliedFilters(optionsSelected);

  //   props.setAPI((prevCycle) => ({
  //     ...prevCycle,
  //     [fieldName]: selectedOptions.map((option) => option),
  //   }));
  // };

  const handleMInputChange = (selectedOptions, fieldName) => {
   
    if (fieldName === "availForeCastWeeks") {
      // console.log(selectedOptions);
      setOptionsSelected((prevCycle) => ({
        ...prevCycle,
        [fieldName]: selectedOptions?.map((option) => ({
          label: option.label,
          value: option.value,
        })),
      }));
      // console.log(optionsSelected)
      props.setLastAppliedFilters((prevFilters) => ({
        ...prevFilters,
        [fieldName]: selectedOptions[0].value,
      }));
      props.setAPI((prevCycle) => ({
        ...prevCycle,
        [fieldName]: selectedOptions[0].value,
      }));
      return;
    }
    if (fieldName !== "yearsOfExp") {
      setOptionsSelected((prevCycle) => ({
        ...prevCycle,
        [fieldName]: selectedOptions?.map((option) => ({
          label: option.value,
          value: option.value,
        })),
        
      }));
      // console.log(selectedOptions);
      props.setLastAppliedFilters(optionsSelected);
      // console.log(selectedOptions);

      props.setAPI((prevCycle) => ({
        ...prevCycle,
        [fieldName]: selectedOptions.map((option) => option.value),
      }));

      return;
    }
  
    setOptionsSelected((prevCycle) => ({
      ...prevCycle,
      [fieldName]: selectedOptions.map((option) => option),
    }));
    props.setLastAppliedFilters(optionsSelected);

    props.setAPI((prevCycle) => ({
      ...prevCycle,
      [fieldName]: selectedOptions.map((option) => option),
    }));
  };
  

  const handleApplyFilters = async () => {
    props.clearExternalFilters();
    props.setLastAppliedFilters(optionsSelected);
    // console.log(props.lastAppliedFilters);
    props.onRefresh();
    handleClose();

  };

  const handleClearFilters = async () => {
    handleClose();
    props.setLoader(true);
    props.setCurrentPage(1);
    set_minValue(0);
    set_maxValue(30);
    setOptionsSelected({
      techGroups: [],
      roles: [],
      skills: [],
      yearsOfExp: [],
      locations: [],
      domains: [],
      availability: [],
      availForeCastWeeks: null
    });
    let clearApi = {
      techGroups: [],
      roles: [],
      skills: [],
      yearsOfExp: [],
      locations: [],
      domains: [],
      availability: [],
      availForeCastWeeks: null,
    };
    props.setAPI(clearApi);
    props.setLastAppliedFilters({
      techGroups: [],
      roles: [],
      skills: [],
      yearsOfExp: [],
      locations: [],
      domains: [],
      availability: [],
      availForeCastWeeks: null,
    });
    const response = await postReq(`${url}ResAlloc/filter`, clearApi);
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
          const startDate = new Date(item?.processes[0]?.allocStartDate);
          const endDate = (new Date(item?.processes[0]?.allocEndDate));
          // console.log(startDate);
          // console.log(endDate);
          itemsData.push({
            id: item?.resource?.allocationId,
            group: item?.resource?.allocationId,
            start_time: startDate,
            end_time: endDate,
            title: "Allocated",
            canResizeRight: false,
            canMove: false,
            itemProps: {
              style: { background: "blue", borderRadius: "8px" },
            },
          });
        }
      });
      props.SetGroups(groupData);
      props.setItems(itemsData);
      props.setLoader(false);
    } else {
      props.setLoader(false);
      console.error("Unexpected response format or empty data:", response);
    }
    props.HandleClearFromSideBar();
  };
  const handleClose = () => {
    props.setModal(false);
  };
  const isAllocatedSelected = optionsSelected?.availability?.some(option => option.value === "Allocated");

  return (
    <Offcanvas show={props.modal} onHide={handleClose} placement="end">

      <Offcanvas.Header
        style={{ backgroundColor: "#004e89", color: "white" }}
        closeButton
      >
        <Offcanvas.Title>Advanced Filters</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Row className="mb-3 filter-row">
          <Col sm={4}>
            <Form.Label className="form-label">Availability</Form.Label>
          </Col>
          <Col sm={6}>
            <MultiSelect
              options={available?.length > 0 ? available : []}
              value={optionsSelected.availability}
              selected={optionsSelected.availability}
              placeholderText="Select Availaility"
              onChange={(selectedOptions) =>
                handleMInputChange(selectedOptions || [], "availability")
              }
            />
          </Col>

        </Row>
        {isAllocatedSelected && (<Row className="mb-3 filter-row">
          <Col sm={4}>
            <Form.Label className="form-label">Availability Forecast</Form.Label>
          </Col>
          <Col sm={6}>
            <Select
              styles={{zIndex:'10000'}}
              options={subFilters?.length > 0 ? subFilters : []}
              value={optionsSelected?.availForeCastWeeks}
              selected={optionsSelected?.availForeCastWeeks}
              placeholderText="Select Availability Forecast"
              onChange={(selectedOptions) =>
                handleMInputChange([selectedOptions] || [], "availForeCastWeeks")
              }
            />
          </Col>

        </Row>)}

        <Row className="mb-3 filter-row">
          <Col sm={4}>
            <Form.Label className="form-label">Work Locations</Form.Label>
          </Col>
          <Col sm={6}>
            <MultiSelect
              options={locations?.length > 0 ? locations : []}
              value={optionsSelected.locations}
              selected={optionsSelected.locations}
              placeholderText="Select Locations"
              onChange={(selectedOptions) =>
                handleMInputChange([selectedOptions] || [], "locations")
              }
            />
          </Col>
        </Row>
        <Row className="mb-3 filter-row">
          <Col sm={4}>
            <Form.Label className="form-label">Exp</Form.Label>
          </Col>
          <Col sm={6}>
            <MultiRangeSlider
              min={0}
              max={30}
              step={3}
              minValue={minValue}
              maxValue={maxValue}
              canMinMaxValueSame={true}
              barLeftColor='red'
              barInnerColor='#fec601'
              barRightColor='red'
              thumbLeftColor='lightseagreen'
              thumbRightColor='lightseagreen'
              onChange={(e) => {
                handleInput(e);
              }}
              style={{
                border: "none",
                boxShadow: "none",
                padding: "15px 10px",
              }}
            />
          </Col>
        </Row>

        <Row className="mb-3 filter-row">
          <Col sm={4}>
            <Form.Label className="form-label">Tech Groups</Form.Label>
          </Col>
          <Col sm={6}>
            <MultiSelect
              options={techGroups?.length > 0 ? techGroups : []}
              value={optionsSelected.techGroups}
              selected={optionsSelected.techGroups}
              placeholderText="Select techGroups"
              onChange={(selectedOptions) =>
                handleMInputChange(selectedOptions || [], "techGroups")
              }
            />
          </Col>
        </Row>
        <Row className="mb-3 filter-row">
          <Col sm={4}>
            <Form.Label className="form-label">Tech Skills</Form.Label>
          </Col>
          <Col sm={6}>
            <MultiSelect
              options={skillOptions}
              value={optionsSelected.skills}
              selected={optionsSelected.skills}
              placeholderText="Select skills"
              onChange={(selectedOptions) =>
                handleMInputChange(selectedOptions || [], "skills")
              }
            />

            {/* <MultiSelect
              options={skills?.length > 0 ? skills : []}
              value={optionsSelected.skills}
              selected={optionsSelected.skills}
              placeholderText="Select skills"
              onChange={(selectedOptions) =>
                handleMInputChange(selectedOptions || [], "skills")
              }
            /> */}
          </Col>
        </Row>
        <Row className="mb-3 filter-row">
          <Col sm={4}>
            <Form.Label className="form-label">Role</Form.Label>
          </Col>
          <Col sm={6}>
            <MultiSelect
              options={role?.length > 0 ? role : []}
              value={optionsSelected.roles}
              selected={optionsSelected.roles}
              placeholderText="Select Roles"
              onChange={(selectedOptions) =>
                handleMInputChange(selectedOptions || [], "roles")
              }
            />
          </Col>
        </Row>
        {/* <Row className="mb-3 filter-row">
          <Col sm={4}>
            <Form.Label className="form-label">Domain</Form.Label>
          </Col>
          <Col sm={6}>
            <MultiSelect
              options={domain?.length > 0 ? domain : []}
              value={optionsSelected.domains}
              selected={optionsSelected.domains}
              placeholderText="Select domains"
              onChange={(selectedOptions) =>
                handleMInputChange(selectedOptions || [], "domains")
              }
            />
          </Col>
        </Row> */}
        <Row className="mt-5">
          <Col>
            <Button
              variant="primary"
              className="me-3"
              onClick={() => {
                handleApplyFilters();
              }}
            >
              Apply Filters
            </Button>
          </Col>
          <Col>
            <Button
              variant="secondary"
              onClick={() => {
                handleClearFilters();
              }}
            >
              Clear Filters
            </Button>
          </Col>
        </Row>
      </Offcanvas.Body>
    </Offcanvas >
  );
}

export default FiltersSideBar;
