import React from "react";
// import Sidebar from '../components/Messages/Sidebar'
import Chats from "../components/Messages/Chats"
import '../styles/Messages.css'
import { motion } from 'framer-motion'

// import {io} from 'socket.io-client'

function Messages() {
	return (
		<div>
		<motion.div className="home"
		initial={{opacity: 0}}
		animate={{opacity: 1}}
		exit={{opacity: 0}}>
			<div className="container">
				{/* <Sidebar/> */}
				<Chats/>
			</div>
		</motion.div>
		</div>
	);
}

export default Messages