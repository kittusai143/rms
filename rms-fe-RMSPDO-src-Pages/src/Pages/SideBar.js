// import React from "react";
// import { NavItem, NavLink, Nav } from "reactstrap";
// import classNames from "classnames";
// import { Link, useLocation } from "react-router-dom";
// import { useSelector } from "react-redux";
// const SideBar = ({ isOpen, toggle }) => {
// 	let location = useLocation();

// 	let select = useSelector((state) => state?.login?.tasks);
// 	console.log(select);
// 	let data = select[0].empRoleName;

// 	let HRMenu = [
// 		{
// 			path: "/dashboard",
// 			class: "bi bi-house-door",
// 			title: "Dashboard",
// 		},
// 		{
// 			path: "/parameters",
// 			class: "bi bi-person",
// 			title: "Configuration",
// 		},
// 		{
// 			path: "/workflowconfig",
// 			class: "bi bi-file-text",
// 			title: "Workflow",
// 		},
// 		{
// 			path: "/initialize-appraisal",
// 			class: "bi bi-people",
// 			title: "Initialize Appraisal",
// 		},
// 		{
// 			path: "/self-assessment",
// 			class: "bi bi-file-check",
// 			title: "Self Assessment",
// 		},
// 		{
// 			path: "/team",
// 			class: "bi bi-folder",
// 			title: "Manager Review",
// 		},
// 		{
// 			path: "/teams",
// 			class: "bi bi-people",
// 			title: "Teams",
// 		},
// 		// {
// 		// 	path: "/manager-status",
// 		// 	class: "bi bi-file-person",
// 		// 	title: "Manager Status",
// 		// },
// 		// {
// 		// 	path: "/employee-status",
// 		// 	class: "bi bi-person-vcard",
// 		// 	title: "Employee Status",
// 		// },
// 		// {
// 		// 	path: "/reports",
// 		// 	class: "bi bi-file-text",
// 		// 	title: "Reports",
// 		// },
// 		{
// 			path: "/escalation",
// 			class: "bi bi-file-text",
// 			title: "Escalation List",
// 		},
// 		// {
// 		// 	path: "/my-reports",
// 		// 	class: "bi bi-file-text",
// 		// 	title: "My Reports",
// 		// },
// 	];

// 	let EmployeeMenu = [
// 		{
// 			path: "/self-assessment",
// 			class: "bi bi-file-check",
// 			title: "Resource",
// 		},
// 		// {
// 		// 	path: "/aphistory",
// 		// 	class: "bi bi-folder",
// 		// 	title: "Appraisal History",
// 		// },
// 		// {
// 		// 	path: "/my-reports",
// 		// 	class: "bi bi-file-text",
// 		// 	title: "My Reports",
// 		// },
// 	];

// 	let managerMenu = [
// 		{
// 			path: "/self-assessment",
// 			class: "bi bi-file-check",
// 			title: "Self Assessment",
// 		},
// 		{
// 			path: "/team",
// 			class: "bi bi-folder",
// 			title: "Manager Review",
// 		},
// 		// {
// 		// 	path: "/manager-status",
// 		// 	class: "bi bi-file-person",
// 		// 	title: "Manager Status",
// 		// },
// 		// {
// 		// 	path: "/employee-status",
// 		// 	class: "bi bi-person-vcard",
// 		// 	title: "Employee Status",
// 		// },
// 		// {
// 		// 	path: "/my-reports",
// 		// 	class: "bi bi-file-text",
// 		// 	title: "My Reports",
// 		// },
// 		// {
// 		// 	path: "/reports",
// 		// 	class: "bi bi-file-text",
// 		// 	title: "Reports",
// 		// },
// 	];
// 	let Menu;
// 	console.log(data);
// 	if (data === "Manager") {
// 		Menu = managerMenu;
// 	} else if (data === "Employee") {
// 		Menu = EmployeeMenu;
// 		console.log(Menu);
// 	} else if (data === "HR Manager") {
// 		Menu = HRMenu;
// 	}

// 	const listItems = Menu.map((obj) => (
// 		<NavItem
// 			className={
// 				"menu-item " +
// 				classNames({
// 					active: location.pathname === obj.path,
// 				})
// 			}>
// 			<NavLink tag={Link} to={obj.path}>
// 				<i class={obj.class}></i>
// 				<span className="menu-title">{obj.title}</span>
// 			</NavLink>
// 		</NavItem>
// 	));

// 	return (
// 		<div className={classNames("main-container", { "is-open": isOpen })}>
// 			<div className="sidebar-header">
// 				<span color="info" onClick={toggle} style={{ color: "#fff" }}>
// 					&times;
// 				</span>
// 			</div>
// 			<div className="side-menu">
// 				<Nav vertical className="menu-items">
// 					{listItems}
// 				</Nav>
// 			</div>
// 		</div>
// 	);
// };

// export default SideBar;
