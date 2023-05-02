import React, { useEffect, useRef, useState } from "react";
import Sidebar from '../components/Messages/Sidebar'
import Chat from "../components/Messages/Chat"
import '../Style/Messages.css'
import {io} from 'socket.io-client'

function Messages(params) {
	const socket = useRef(io("ws://localhost:8900"))

	// useEffect(() => {
	// 	setSocket(io("ws://localhost:8900"))
	// }, [])

	console.log(socket)
	// useEffect(() => {
	// 	socket.current.emit("addUser", user._id);
		// socket.current.on("getUsers", users=>{
		// 	console.log(users)
		// })
	// }, [user])

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