import React, { useState, useEffect } from "react";
import TopBar from "../Pages/TopBar";
import classNames from "classnames";
import { Container } from "reactstrap";
import SideBar from "../Pages/SideBar";
import "../CSS/Template.css";
// import Dashboard from "./Dashboard";
import RouterF from "../Routes/Router";
import Rmsnavigate from "./Rmsnavigate";
import { useSelector } from "react-redux";


const Template = ({ toggleSidebar, sidebarIsOpen }) => {
	const[indication,setindication]=useState(false)
	const [containerClass, setContainerClass] = useState("");
	const rmsnavigate=useSelector((state) => state?.newStore?.rmsNavigate);
	const pdsnavigate=useSelector((state)=>state?.newStore?.PDSNavigate)
	console.log(useSelector((state)=>state))
    const changeIndication=()=>
	{
		setindication(!indication);
	}
	useEffect(() => {
		// Update container class based on sidebarIsOpen
		const sidebarIsOpen = document
			.querySelector(".layout")
			.classList.contains("is-open");
		setContainerClass(sidebarIsOpen ? "aside-open" : "aside-closed");
	}, [sidebarIsOpen]);

	return (
		<Container
			fluid
			className={classNames("layout", { "is-open": sidebarIsOpen })}>
			<header>
				<TopBar  setindication={changeIndication} indication={indication}/>
			</header>
			<main className="template-main" style={{ paddingTop: "6.75rem" }}>
				<div className="content-wrap">
					<div className="content-area">
						<div>
						{/* */}
						{rmsnavigate|| pdsnavigate?( <RouterF  setindication={changeIndication}/>):(<Rmsnavigate/>)}
						</div>
							
					</div>
				</div>
			</main>
		</Container>
	);
};

export default Template;
