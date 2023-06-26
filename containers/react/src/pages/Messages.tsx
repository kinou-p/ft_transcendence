import React from "react";
import Chats from "../components/Messages/Chats.tsx"
import '../styles/Messages.css'
import { motion } from 'framer-motion'

function Messages() {
	return (
		<>
		<motion.div className="home"
		initial={{opacity: 0}}
		animate={{opacity: 1}}
		exit={{opacity: 0}}>
			<div className="container">
				<Chats/>
			</div>
		</motion.div>
		</>
	);
}

export default Messages