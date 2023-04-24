import React from "react";
import Sidebar from '../components/Messages/Sidebar'
import Chat from "../components/Messages/Chat";
import '../Style/Messages.css'

function Messages(params) {
	return (
		<>
		{/* <div>
			<h1>Welcome to the messages page</h1>
		</div> */}
		<div className="home">
			<div className="container">
				<Sidebar/>
				<Chat/>
			</div>
		</div>
		</>
	);
}

export default Messages