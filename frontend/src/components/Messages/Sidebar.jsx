import React from "react";
import Navbar from "./Navbar";
import Chats from "./Chats";

function Sidebar(){
	return (
		<div className="sidebar">
			<Navbar/>
			<Chats/>
		</div>
	);
}

export default Sidebar