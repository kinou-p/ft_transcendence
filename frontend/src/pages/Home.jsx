import { React, useState } from "react";
import '../styles/Profile.css'
import '../styles/App.css'
import DefaultPicture from "../assets/profile.jpg";
import WinLoss from "../components/Win_Loss";
import { motion, AnimatePresence } from 'framer-motion'
import { AiFillEdit } from 'react-icons/ai'
import { Link } from "react-router-dom";
import Modal from "../components/Sidebar/Modal";
// import {AiOutlineHistory} from 'react-icons/ai'
// import { Link } from "react-router-dom";
// import UserProfile from "../DataBase/DataProfileUser";



function Profile () {
	const [modalOpen, setModalOpen] = useState(false);
	const close = () => setModalOpen(false);
	const open = () => setModalOpen(true);
	return (
		<div className="profile">
			<img className="profile-pic" src={DefaultPicture} alt="Profile pic" />
			<h1>Dipper Ratman</h1>
			{/* <motion.div
				> */}
				<motion.button to="#" className="edit_name" onClick={() => (modalOpen ? close() : open())}>
					<AiFillEdit/>
				</motion.button>
			{/* </motion.div> */}
			<AnimatePresence
			initial={false}
			onExitComplete={() => null}>
				{modalOpen && <Modal modalOpen={modalOpen} handleClose={close}/>}
			</AnimatePresence>
		</div>
	)
}

function Home () {
	const [move, setmove ] = useState(false);
    return (
		<motion.div className="App"
		initial={{opacity: 0}}
		animate={{opacity: 1}}
		exit={{opacity: 0}}>
		<div className="home">
			<motion.div animate={{x: move ? -200: 170}}
				transition={{type: "tween", duration: 0.5}}>
					<Profile/>
			</motion.div>
			<motion.div animate={{opacity: !move ? 0 : 1}}>
				<WinLoss/>
			</motion.div>
			</div>
			<div>
				<button className="history"
				onClick={ () => setmove(!move)}>Match History</button>
			</div>
		</motion.div>
    )
}

export default Home