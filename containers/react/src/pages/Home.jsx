import { React, useState } from "react";
import '../styles/Profile.css'
// import '../styles/App.css'
import DefaultPicture from "../assets/profile.jpg";
import WinLoss from "../components/Profile/Win_Loss";
import { motion, AnimatePresence } from 'framer-motion'
// import { AiFillEdit } from 'react-icons/ai'
// import { GrClose } from 'react-icons/gr'
import { Link } from "react-router-dom";
import ModalEdit from "../components/Profile/EditName";
import {AiOutlineHistory} from 'react-icons/ai'
// import { Link } from "react-router-dom";
import {UserProfile} from "../DataBase/DataUserProfile";
// import axios from "axios";
import api from '../script/axiosApi';
import { CgEditMarkup } from 'react-icons/cg'
import { IoCloseCircleOutline } from "react-icons/io5";


	// axios.get("http://localhost/api")
	// .then((response) => {
	// 	response = response.json()
	// 	response.then((result) => {
	// 		console.log(result)
	// 		console.log("ceci est un test")
	// 	})
	// })


function Profile () {
	const [modalOpen, setModalOpen] = useState(false);
	const close = () => setModalOpen(false);
	const open = () => setModalOpen(true);

	const getConv = async ()=>{
		try{
			const convs = await api.get("/profile")
			// const tmpUser = await api.get("/profile")
			console.log(convs.data);
			// setUser(tmpUser);
			// setConversation(convs.data);
		}
		catch(err){
			console.log(err);
		}
	};
	getConv();
	return (
		<div className="profile">
			<img className="profile-pic" src={DefaultPicture} alt="Profile pic" />
			<h1>{UserProfile.UserName}</h1>
				<motion.div  onClick={() => (modalOpen ? close() : open())}>
					<Link to="#" className="edit_name">
						{modalOpen === true ?  <IoCloseCircleOutline/> : <CgEditMarkup/>}
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
		initial={{opacity: -1}}
		animate={{opacity: 1}}
		exit={{opacity: -1}}>
		<div className="home">
			<motion.div animate={{x: move ? -200: 170}}
				transition={{type: "tween", duration: 0.5}}>
					<Profile/>
			</motion.div>
			<motion.div animate={{opacity: !move ? -1 : 1}}>
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