import React from "react";
import Sidebar from '../components/Messages/Sidebar'
import Chat from "../components/Messages/Chat"
import '../styles/Messages.css'
import { motion } from 'framer-motion'

// import {io} from 'socket.io-client'

function Messages(params) {
	// const socket = useRef(io("ws://localhost:8900"))

	// useEffect(() => {
	// 	setSocket(io("ws://localhost:8900"))
	// }, [])
	// const socket = socketIO.connect('http://localhost:4000');

	// axios.get('http://localhost/api/user/id')
	// 	.then(function());

	// console.log(socket)
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
		<motion.div className="home"
		initial={{opacity: 0}}
		animate={{opacity: 1}}
		exit={{opacity: 0}}>
			<div className="container">
				<Sidebar/>
				<Chat/>
			</div>
		</motion.div>
		</>
	);
}

export default Messages