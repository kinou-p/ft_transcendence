import { React, useState } from "react";
import '../styles/Profile.css'
// import '../styles/App.css'
import DefaultPicture from "../assets/profile.jpg";
import WinLoss from "../components/Win_Loss";
import { motion, AnimatePresence } from 'framer-motion'
import { AiFillEdit } from 'react-icons/ai'
import { Link } from "react-router-dom";
import ModalEdit from "../components/EditName";
import {AiOutlineHistory} from 'react-icons/ai'
// import { Link } from "react-router-dom";
import {UserProfile} from "../DataBase/DataUserProfile";



function Profile () {
	const [modalOpen, setModalOpen] = useState(false);
	const close = () => setModalOpen(false);
	const open = () => setModalOpen(true);
	return (
		<div className="profile">
			<img className="profile-pic" src={DefaultPicture} alt="Profile pic" />
			<h1>{UserProfile.UserName}</h1>
				<motion.div  onClick={() => (modalOpen ? close() : open())}>
					<Link to="#" className="edit_name">
						<AiFillEdit/>
					</Link>
				</motion.div>
			<AnimatePresence
			initial={false}
			onExitComplete={() => null}>
				{modalOpen && <ModalEdit modalOpen={modalOpen} handleClose={close}/>}
			</AnimatePresence>
		</div>
	)
}

function Home () {
	const [move, setmove ] = useState(false);
    return (
		<motion.div className="page"
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
			<motion.div
				className="div_history"
			// className="history"
				onClick={ () => setmove(!move)}>
					<Link to="#" className="history"><AiOutlineHistory/>  Match History</Link>
			</motion.div>
		</motion.div>
    )
}

export default Home