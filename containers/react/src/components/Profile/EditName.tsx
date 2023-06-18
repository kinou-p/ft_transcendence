import {motion} from "framer-motion"
// import Backdrop from "../Sidebar/Backdrop"
import {Link} from 'react-router-dom';
import { UserProfile } from "../../DataBase/DataUserProfile";
import {useState} from 'react';
import "../../styles/Profile.css"

import api from '../../script/axiosApi.tsx';
import React from "react";

const dropIn = {
	hidden: {
		opacity: '0',
	},
	visible: {
		opacity: "1",
	},
	exit: {
		opacity: "0",
	},
}

// const changeName = ({handleclose, name}) => {
// 	return (
// 		UserProfile.UserName = name
// 	)
// }

const ModalEdit = ( handleClose ) => {
	// let new_name = "";
	const [nickname, setNickname] = useState("");
	
	const handler = e =>
	{
		setNickname(e.target.value);
		const postNickname = async ()=>{
			try{
				await api.post("/nickname", {nickname: nickname})
				// setUser(tmpUser.data);
				// setIsLoading(false)
			}
			catch(err){
				console.log(err);
			}
		};
		postNickname();
	}
	// function handleClose(){
	// 	//do nothing
	// }
	return (
			<motion.div 
						className="modal"
						variants={dropIn}
						initial="hidden"
						animate="visible"
						exit="exit">
				<h2>Type your new name</h2>
				<input className="text" type="text" value={nickname} onChange={handler} handleClose/>
				<div onClick={handleClose}>
					<div onClick={() => {UserProfile.UserName = nickname;}}>
						<Link className="button" to={""}>change</Link>
					</div>
				</div>
			</motion.div>
			
		
	)
}

export default ModalEdit