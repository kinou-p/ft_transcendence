import MessageYou from "./MessageYou"
import MessageMe from "./MessageMe"
// import { useRef } from "react";
// import { useEffect } from "react";
import '../../Style/Messages.css'

function Conversation(){
// 	const scrollRef = useRef();

// 	useEffect(() => {
// 	scrollRef.current?.scrollIntoView({ behavior: "smooth"})
// }, [])
	return (
	 	<div className="messages">
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
		</div>
	)
}

export default Conversation