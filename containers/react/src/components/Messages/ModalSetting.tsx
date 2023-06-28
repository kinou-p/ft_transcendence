import { AnimatePresence, motion } from "framer-motion";
import Backdrop from "../Sidebar/Backdrop.tsx";
import '../../styles/Messages.css'
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../script/axiosApi.tsx";
import React from "react";
import { User } from "../../../interfaces.tsx"
import { Socket } from "socket.io-client";
import GreenAlert from "../Alert/GreenAlert.tsx";

interface ModalSettingProps {
	handleClose: Function,
	convId: string,
	socket: Socket | null,
}

const ModalSetting = ({ handleClose, convId, socket }: ModalSettingProps) => {
	const [password, setPassword] = useState(false);
	const [users, setUsers] = useState<User[]>([]);
	const [selectTags, setSelectTag] = useState([{ id: 1, selectedOption: '' }]);
	const [selectedUser, setSelectedUser] = useState("");
	const [newName, setNewName] = useState("");
	const [time, setTime] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [privateConv, setPrivateConv] = useState<Boolean>();
	const [loading, setLoading] = useState<Boolean>(true);
	const dark = () => setPrivateConv(true);
	const light = () => setPrivateConv(false);
	const [mute, setMute] = useState(false);
	const darkMute = () => setMute(false);
	const lightMute = () => setMute(true);


	useEffect(() => {

		const getUsers = async () => {
			try {
				const currentConv = await api.post("/convId", { convId: convId });
				if (currentConv.data.private)
					setPrivateConv(true);
				const tmpUsers = await api.get("/users");
				setUsers(tmpUsers.data);
				setLoading(false);
			} catch (err) {
				console.log(err)
			}
		}
		getUsers();
	}, []);

	useEffect(() => {
		const handleVariableChange = () => {
			if (privateConv === undefined) {
				return;
			}
			try {
				if (privateConv)
					api.post("/private", { convId: convId })
				else
					api.post("/public", { convId: convId })
			} catch (err) {
				console.log(err);
			}
		};
		if (!loading)
			handleVariableChange();
	}, [privateConv]);

	const handleOptionChange = (selectId: number, selectedOption: string) => {
		setSelectTag((prevTags) =>
			prevTags.map((tag) =>
				tag.id === selectId ? { ...tag, selectedOption } : tag
			)
		);
		setSelectedUser(selectedOption)
	};

	const handleCheckPass = (e: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
		setPassword(e.target.checked);
	}

	const handleName = async (e: { key: string; }) => {
		if (e.key !== "Enter")
			return;
		try {
			api.post("/name", { convId: convId, name: newName })
			window.location.reload()
		} catch (err) {
			console.log(err);
		}
		handleClose();
	}

	const handlePassword = async (e: { key: string; }) => {
		if (e.key !== "Enter")
			return;
		try {
			await api.post("/password", { convId: convId, password: newPassword })
		} catch (err) {
			console.log(err);
		}
		handleClose();
	}

	const [unban, setUnban] = useState(false);
	const closeUnban = () => setUnban(false);
	
	const handleBan = async () => {
		try {
			if (!selectedUser.length)
				return;
			const res = await api.post("/ban", { convId: convId, username: selectedUser })

			if (res.data === 2) {
				setUnban(true);
			}
			if (socket) {
				socket.emit("ban", { username: selectedUser })
			}
		} catch (err) {
			console.log(err);
		}
		setTimeout(handleClose, 1500);
	};

	const handleAdmin = async () => {
		if (!selectedUser.length)
			return;
		try {
			await api.post("/admin", { convId: convId, username: selectedUser })
		} catch (err) {
			console.log(err);
		}
		handleClose();
	};

	const [muteAlert, setMuteAlert] = useState(false);
	const closeMuteAlert = () => setMuteAlert(false);

	const handleMute = async (e: { key: string; }) => {
		if (e.key !== "Enter")
			return;
		try {
			const ret = await api.post("/mute", { convId: convId, username: selectedUser, time: time })
			if (ret.data)
				setMuteAlert(true);
		} catch (err) {
			console.log(err);
		}
		handleClose();
	};

	const handleInvite = async () => {
		try {
			await api.post("/inviteConv", { convId: convId, username: selectedUser });
		} catch (err) {
			console.log(err);
		}
		handleClose();
	};

	return (
		<Backdrop onClick={handleClose}>
			<motion.div
				onClick={(e) => e.stopPropagation()}
				className="modalSetting"
				initial="hidden"
				animate="visible"
				exit="exit"
			>
				<div className="settingFirstPart">
					<div>
						<div>
							<Link to="#" onClick={light} className={privateConv ? "submit" : "darkSubmit"}>Public</Link>
							<Link to="#" onClick={dark} className={privateConv ? "darkSubmit" : "submit"}>Private</Link>
						</div>
						<p className="checkbox">Password<input className="inside_ckeckbox" type="checkbox" value="password" checked={password} onChange={handleCheckPass} /> </p>
						{password ? (
							<input
								onChange={(e) => setNewPassword(e.target.value)}
								onKeyDown={handlePassword}
								type="password"
								className="in"
								placeholder="Password" />
						) :
							("")}

					</div>
					<div className="forName">
						<input
							onChange={(e) => setNewName(e.target.value)}
							onKeyDown={handleName}
							maxLength={20}
							type="text"
							className="in"
							placeholder="New Name"
						/>
					</div>
				</div>

				<div className="settingSecondPart">


					{selectTags.map((selectTag) => (
						<div key={selectTag.id}>
							<select
								value={selectTag.selectedOption}
								onChange={(a) => handleOptionChange(selectTag.id, a.target.value)}
							>
								<option value="">
									{selectTag.selectedOption ? selectTag.selectedOption : "Select an option"}
								</option>
								{users.map((item, index) => (
									<option key={index} value={item.username}>
										{item.nickname}
									</option>
								))}
							</select>
						</div>
					))}

					<div>
						<Link to="#" onClick={handleInvite} className="submit">Invite</Link>
						<Link to="#" onClick={handleBan} className="submit">Ban</Link>
						<Link to="#" onClick={mute ? darkMute : lightMute} className={mute ? "darkSubmit" : "submit"}>Mute</Link>
						<Link to="#" onClick={handleAdmin} className="submit">Admin</Link>
					</div>

				</div>
				{mute ? (
					<input
						onKeyDown={handleMute}
						type="number"
						className="in_howLong"
						placeholder="Time"
						value={time}
						onChange={(e) => setTime(e.target.value)}
					/>
				) : ("")}
				<AnimatePresence initial={false} onExitComplete={() => null}>
					{unban ? (
						<GreenAlert handleClose={closeUnban} text={selectedUser + ": was unbanned"} />
					) : ("")}
					{muteAlert ? (
						<GreenAlert handleClose={closeMuteAlert} text="Mute" />
					) : ("")}
				</AnimatePresence>

			</motion.div>
		</Backdrop>
	)
}

export default ModalSetting