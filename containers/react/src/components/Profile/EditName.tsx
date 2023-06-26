import { AnimatePresence, motion } from "framer-motion"
// import Backdrop from "../Sidebar/Backdrop"
import { Link } from 'react-router-dom';
// import { UserProfile } from "../../DataBase/DataUserProfile";
import { useState } from 'react';
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

const ModalEdit = () => {
	// let new_name = "";
	const [nickname, setNickname] = useState("");
	const [errTaken, setErrTaken] = useState(false);
	const closeTaken = () => setErrTaken(false);
	const [errTooShort, setErrTooShort] = useState(false);
	const closeTooShort = () => setErrTooShort(false);

	const handler = (e: { target: { value: React.SetStateAction<string>; }; }) => {
		setNickname(e.target.value);
		console.log("testeeeee")
		const postNickname = async () => {
			// try{
			// 	await api.post("/nickname", {nickname: nickname})
			// 	// setUser(tmpUser.data);
			// 	// setIsLoading(false)
			// }
			// catch(err){
			// 	console.log(err);
			// }
		};
		postNickname();
	}

	const handlePostNickname = async () => {
		console.log("nickname=", nickname)
		try {
			// console.log("cest ici = ",ret);
			// if (!ret)
			// console.log("test ret =", ret.data);
			if (nickname.length > 3) {
				const ret = await api.post("/nickname", { nickname: nickname });
				if (ret.data) {
					console.log("ici error = ", ret.data);
					window.location.reload();
				}
				else {
					console.log("nickname already set = ", ret.data);
	
					setErrTaken(true);
				}
			}
			else if (nickname.length < 3)
			{
				setErrTooShort(true);
			}


			// setUser(tmpUser.data);
			// setIsLoading(false)
		}
		catch (err) {
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
			<h1>Type your new name</h1>
			<input className="text" minLength={2} maxLength={10} type="text" value={nickname} onChange={handler} />
			<div>
				<div className="button" onClick={handlePostNickname}>
					change
					{/* <Link className="button" to={""}>change</Link> */}
				</div>
				<AnimatePresence initial={false} onExitComplete={() => null}>
				{
					errTaken ? (
						<RedAlert handleClose={closeTaken} text="Error: Nickname already taken" />
					) : ("")
				}
				{
					errTooShort ? (
						<RedAlert handleClose={closeTooShort} text="Error: Nickname it too short" />
					) : ("")
				}

				</AnimatePresence>
			</div>
		</motion.div>
	)
}

export default ModalEdit