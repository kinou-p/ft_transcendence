import {motion} from "framer-motion"
// import Backdrop from "../Sidebar/Backdrop"
import {Link} from 'react-router-dom';
// import { UserProfile } from "../../DataBase/DataUserProfile";
import {useState} from 'react';
import "../../styles/Profile.css"

import api from '../../script/axiosApi.tsx';
import React from "react";
import RedAlert from "../Alert/RedAlert.tsx";

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
	const [closeModal, setModalClose] = useState(false);
	const [err, setErr] = useState(false);
	const close = () => setErr(false);
	
	const handler = e =>
	{
		setNickname(e.target.value);
		console.log("testeeeee")
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
	
	const handlePostNickname = async () => 
	{
		console.log("nickname=" ,nickname)
		try{
			const ret = await api.post("/nickname", {nickname: nickname});
			// console.log("cest ici = ",ret);
			// if (!ret)
			console.log("test ret =",ret.data);
			if(ret.data)
			{
				console.log ("ici error = ", ret.data);
				// window.location.reload();
			}
			else if (!ret.data)
			{
				console.log ("nickname already set = ", ret.data);

				setErr(true);
				setModalClose(true);
			}
			
			
			// setUser(tmpUser.data);
			// setIsLoading(false)
		}
		catch(err){
			console.log(err);
		}
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
				<input className="text" minLength={2} maxLength={10} type="text" value={nickname} onChange={handler}/>
				<div>
					<div className="button" onClick={handlePostNickname}> 
						change
						{/* <Link className="button" to={""}>change</Link> */}
					</div>
				{
					err ? (
						<RedAlert handleClose={close} text="Nickname already taken"/>
					) : ("")
				}
				</div>
			</motion.div>
			
			
			)
		}
		
		export default ModalEdit