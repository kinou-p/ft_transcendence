import { AnimatePresence, motion } from "framer-motion"
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

const ModalEdit = () => {
	const [nickname, setNickname] = useState("");
	const [errTaken, setErrTaken] = useState(false);
	const closeTaken = () => setErrTaken(false);
	const [errTooShort, setErrTooShort] = useState(false);
	const closeTooShort = () => setErrTooShort(false);

	const handler = (e: { target: { value: React.SetStateAction<string>; }; }) => {
		setNickname(e.target.value);
	}

	const handlePostNickname = async () => {
		console.log("nickname=", nickname)
		try {
			if (nickname.length > 3) {
				const ret = await api.post("/nickname", { nickname: nickname });
				if (ret.data) {
					window.location.reload();
				}
				else {
					setErrTaken(true);
				}
			}
			else if (nickname.length < 3)
				setErrTooShort(true);
		}
		catch (err) {
			console.log(err);
		}
	}

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