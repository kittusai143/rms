import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { Container } from "reactstrap";
import "../../CSS/PDO/Template.css";
import RouterF from "../Routes/Routing";
import TopBars from "./TopBars";
import Pmo_Dashboard from "../../Api/Pmo_Dashboard.js";

const Template = ({ toggleSidebar, sidebarIsOpen }) => {
	const [containerClass, setContainerClass] = useState("");
	useEffect(() => {
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
				<TopBars toggleSidebar={toggleSidebar} />
			</header>
			<main>
			
				<div className="content-wrap">
					<div className="content-area p-4">
						<RouterF />
						
					</div>
					
				</div>
			</main>
		</Container>
	);
};

export default Template;
