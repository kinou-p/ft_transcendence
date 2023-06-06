import MessageYou from "./MessageYou"
import MessageMe from "./MessageMe"
// import { useRef } from "react";
import { useEffect, useState } from "react";
import '../../styles/Messages.css'
import Input from "./Input";

function Conversation(){

const [currentChat, setCurrentChat] = useState(null);
const [message, setMessage] = useState([]);

	// setCurrentChat(true)
	return (
		<div className="messages">
			{
				currentChat ? (
			<>
		 	<div>
				<MessageYou/>
				<MessageMe/>
				<MessageYou/>
				<MessageMe/>
				<MessageMe/>
				<MessageYou/>
				<MessageMe/>
				<MessageMe/>
				<MessageYou/>
				<MessageYou/>
				<MessageMe/>
				<MessageYou/>
				<MessageMe/>
				<MessageYou/>
				<MessageMe/>
				<MessageMe/>
				<MessageYou/>
				<MessageMe/>
				<MessageMe/>
				<MessageYou/>
				<MessageMe/>
				<Input/>
			</div></>) : (<span className="noConv">Open a conversation</span>)}
		</div>
	
	)
}

export default Conversation