import React, { useState, useEffect, useRef } from 'react';
import { Label, Input, Button, Table, Pagination, PaginationItem, PaginationLink, FormFeedback } from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEdit } from '@fortawesome/free-solid-svg-icons';
import Toast, { handleErrorToast, handleSuccessToast } from "./Toast";
import Pmo_Dashboard from "../../Api/Pmo_Dashboard.js";

import Multiselect from "multiselect-react-dropdown";

import "../../CSS/PDO/TechMasterPage.css";

export default function TechMasterPage() {

    const [techGroup, setTechGroup] = useState("");
    const [groups, setGroups] = useState([]);
    const [techSkill, setTechSkills] = useState("");
    const [techGroupError, setTechGroupError] = useState("");
    const [skillsError, setSkillsError] = useState("");
    const [otherError, setOtherError] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [techData, setTechData] = useState({})
    const [editData, setEditData] = useState({});
    const [editValue, setEditValue] = useState(false);
    const pageSize = 10; // Number of rows per page
    const [data, setData] = useState([{ techGroup: 'Jacob', skills: '' }]);
    const filtered = data
        ?.filter((item) =>
            item.techGroup?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
            item.techSkill?.toLowerCase().includes(searchTerm?.toLowerCase())
        )
    const pageCount = Math.ceil(filtered?.length / pageSize);
    const skillsOptions = [
        { value: "Java", label: "Java" },
        { value: "Python", label: "Python" },
        { value: "JavaScript", label: "JavaScript" },
        { value: "React", label: "React" },
        { value: "Angular", label: "Angular" },
        { value: "Node.js", label: "Node.js" },
        { value: "HTML", label: "HTML" },
        { value: "CSS", label: "CSS" },
        { value: "SQL", label: "SQL" },
        { value: "Git", label: "Git" },
        { value: 'Other', label: 'Other' },
    ];
    const multiselectRef = useRef(null);
    const [customSkill, setCustomSkill] = useState('');
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [showCustomInputLabel, setShowCustomInputLabel] = useState(false);
    const [otherValue, setOther] = useState()

    const [successToast, setSuccessToast] = useState(false);
    const [errorToast, setErrorToast] = useState(false);
    let isValid = false;

    useEffect(() => {
        Pmo_Dashboard.getAllTechData().then((res) => {
            setData(res.data);
        });
        Pmo_Dashboard.getTechGroupData().then((res) => {

            setGroups(res.data.groups);
        })

    }, []);

    const fetchData = () => {

        Pmo_Dashboard.getAllTechData().then((res) => {
            setData(res.data.map((item) => ({ techId: item.techId, techGroup: item.techGroup, techSkill: item.techSkill })))
            setTechData(res.data.map((item) => ({ techId: item.techId, techGroup: item.techGroup, techSkill: item.techSkill })));
        });
    }

    const pages = [...Array(pageCount).keys()];

    const handlePageClick = (pageIndex) => {
        setCurrentPage(pageIndex);
    };

    const startIndex = currentPage * pageSize + 1;
    const endIndex = Math.min((currentPage + 1) * pageSize, filtered?.length);

    const handleSearch = () => { };

    useEffect(() => {
        setCurrentPage(0);
    }, [searchTerm]);


    const handleSubmit = () => {
        if (!techGroup || !techSkill ) {
            setTechGroupError("Please Enter the Tech group");
            setSkillsError("Please Select at least one Skill");
            handleErrorToast("")
        }else if(techSkill=="Other"&&!customSkill){
            isValid=true;

        } else if (techGroup === "Others" && !otherValue) {
            setOtherError("Please enter at least one tech group");
            isValid = true;
        } else {

            let techSkillsArray = techSkill.split(",");
            if (techSkillsArray.includes("Other") && customSkill !== "") {
                techSkillsArray.splice(techSkillsArray.indexOf("Other"), 1, customSkill);
            }
            if (techGroup === "Others" && otherValue) {
                techSkillsArray.push();
            }
            const techSkillsString = techSkillsArray.join(",");

            if (editValue) {
                const data = {
                    techId: editData.techId,
                    techGroup: techGroup === 'Others' ? otherValue : techGroup,
                    techSkill: techSkillsString,
                };
                handleUpdateData(data);
            } else {
                const data = {
                    techGroup: techGroup === 'Others' ? otherValue : techGroup,
                    techSkill: techSkillsString,
                };
                Pmo_Dashboard.addTechData(data).then((res) => {
                    if (res.status === 200) {
                        handleSuccessToast("Data added successfully");

                        fetchData();
                        handleResetFields();
                    }
                });
            }
        }
    };

    const handleUpdateData = (updatedData) => {
        Pmo_Dashboard.updateTechData(updatedData).then((res) => {
            if (res.status === 200) {
                handleSuccessToast("Data updated successfully");
                fetchData();
                handleResetFields();
            }
        });
    };


    const handleEditData = (item) => {
        setEditValue(true);
        setEditData(item);
        setTechGroup(item.techGroup);
        setTechSkills(item.techSkill);
    };

    const handleResetFields = () => {
        setTechGroup("");
        setTechGroupError("");
        setTechSkills("");
        setSkillsError("");
        setEditData({});
        setEditValue(false);
        multiselectRef.current.resetSelectedValues();
        setCustomSkill('');
        setShowCustomInput(false);
        setShowCustomInputLabel(false);
    };

    useEffect(() => { }, [editData]);

    const handleCustomSkillKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <>
            <div class="container card ">
                <span className="tech_heading">TECH MASTER DATA</span>
                <div class="row  mb-3" >
                    <div class="col-3">
                        <Label>Tech Group </Label>
                        <select
                            className='select_dropdown'
                            value={techGroup}
                            onChange={(e) => {
                                setTechGroup(e.target.value);
                                if(e.target.value){
                                    setTechGroupError("")
                                }
                            }}>
                            <option value=''>Select</option>
                            {groups && groups.map((d) => (
                                <option value={d}>{d}</option>

                            ))}
                            <option value="Others">Others</option>
                        </select>
                        {otherError && <FormFeedback>{otherError}</FormFeedback>}
                        {techGroupError && (
                            <div style={{ color: "#dc3545", fontSize: ".875em" }}>
                                {techGroupError}
                            </div>
                        )}
                    </div>
                    {

                        techGroup === "Others" ? (


                            <div className='col-3'>
                                <Label>Custom Tech Group</Label>
                                <Input type="text" onChange={(e) => setOther(e.target.value)} />

                            </div>
                        ) : null
                    }
                    <div class="col-3">
                        <Label>Skills</Label>
                        <Multiselect
                            options={skillsOptions}
                            displayValue="label"
                            value={techSkill ? techSkill.split(",").map((skill) => ({
                                value: skill.trim(),
                                label: skill.trim(),
                            })) : []}
                            selectedValues={techSkill ? techSkill.split(",").map((skill) => ({
                                value: skill.trim(),
                                label: skill.trim(),
                            })) : []}
                            onSelect={(selectedSkills) => {
                                setTechSkills(selectedSkills.map((skill) => skill.value).join(","));
                                if (selectedSkills.length > 0) {
                                    setSkillsError("");
                                }
                                if (selectedSkills.some((skill) => skill.value === "Other")) {
                                    setShowCustomInput(true);
                                    setShowCustomInputLabel(true);
                                } else {
                                    setShowCustomInput(false);
                                    setShowCustomInputLabel(false);
                                }
                            }}
                            onRemove={(selectedSkills) => {
                                setTechSkills(selectedSkills.map((skill) => skill.value).join(","));
                                if (selectedSkills.length === 0) {
                                    setSkillsError("Please select at least one skill");
                                }
                            }}
                            onClose={() => {
                                if (!editValue) {
                                    handleResetFields();
                                }
                            }}
                            ref={multiselectRef}
                            className="tech_multiselect"
                        />
                        {skillsError && (
                            <div style={{ color: "#dc3545", fontSize: ".875em" }}>
                                {skillsError}
                            </div>
                        )}
                    </div>
                    <div class="col-3">
                        <Label style={{ display: showCustomInputLabel ? "block" : "none" }}>Custom Skill</Label>
                        <Input
                            type="text"
                            value={customSkill || ""}
                            onChange={(e) => setCustomSkill(e.target.value)}
                            onKeyPress={handleCustomSkillKeyPress}
                            style={{ display: showCustomInput ? "block" : "none" }}
                        />
                    </div>

                </div>
                <div class="col-3" className="tech_buttons" style={{ marginLeft: "80%" }} >

                    {editValue == true ? <Button
                        style={{
                            backgroundColor: "#535BFF",
                            width: "100px",
                            color: " #fff",
                            border: "none",
                        }}
                        className="save_btn"
                        color="success"
                        onClick={handleSubmit}>
                        Update
                    </Button> : <Button
                        style={{
                            backgroundColor: "#535BFF",
                            width: "100px",
                            color: " #fff",
                            border: "none",
                        }}
                        className="save_btn"
                        color="success"
                        onClick={handleSubmit}>
                        Save
                    </Button>}
                    <Button
                        // style={{
                        //     width: "100px",      
                        // }}
                        className="tech_cancel_btn"
                        color="light"
                        onClick={handleResetFields}>
                        Cancel
                    </Button>
                </div>

            </div>
            <div class="container card " style={{ paddingRight: "17px", paddingLeft: "17px", paddingTop: '80px' }}>
                <span className="tech_heading">RECENTLY ADDED</span>
                <div className="tech_search-container">
                    <div className="tech_search-input">
                        <Input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            outline
                            className="tech_searchbox"
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(0) }}

                        />
                        <FontAwesomeIcon icon={faSearch} className="tech_search-icon" />

                    </div>
                    <div className="tech_search-button"
                        style={{ marginLeft: '20px', marginRight: '20px' }}>
                        <Button outline onClick={handleSearch}>
                            Search
                        </Button>
                    </div>
                </div>
                <Table striped bordered className="tech_tabel_content" hover responsive size="" >
                    <thead style={{ backgroundColor: "#E6E1C1", borderBottom: "none" }}>
                        <tr>
                            <th style={{ backgroundColor: "#535BFF", color: " #fff", border: "none", }}>Actions</th>
                            <th className="tech_tabelHeadings"
                                style={{ backgroundColor: "#535BFF", color: " #fff", border: "none", }}>
                                Tech Group</th>
                            <th className="tech_tableHeadingd"
                                style={{ backgroundColor: "#535BFF", color: " #fff", border: "none", }}>
                                Skills</th>

                        </tr>
                    </thead>
                    <tbody>
                        {filtered
                            ?.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
                            ?.map((item) => (
                                <tr key={item.techId}>
                                    <td>
                                        <FontAwesomeIcon
                                            icon={faEdit}
                                            onClick={() => handleEditData(item)} />
                                    </td>
                                    <td>{item.techGroup}</td>
                                    <td>{item.techSkill}</td>

                                </tr>
                            ))}
                    </tbody>
                </Table>
                <div className="pagination-container">
                    <Pagination>
                        <PaginationItem disabled={currentPage <= 0}>
                            <PaginationLink
                                previous
                                onClick={() => handlePageClick(currentPage - 1)} />
                        </PaginationItem>
                        <div className="pagination-info">
                            {startIndex}-{endIndex} of {filtered?.length}
                        </div>
                        <PaginationItem disabled={currentPage >= pages.length - 1}>
                            <PaginationLink next onClick={() => handlePageClick(currentPage + 1)} />
                        </PaginationItem>
                    </Pagination>
                </div>
            </div>
            <Toast setSuccessToast={setSuccessToast} setErrorToast={setErrorToast} />
        </>
    );
}