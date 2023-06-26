import { AnimatePresence, motion } from "framer-motion";
import Backdrop from "../Sidebar/Backdrop.tsx";
// import { Rank } from "../../DataBase/DataRank"
import '../../styles/Messages.css'
import { useState, useEffect } from "react";
import { GrAdd } from "react-icons/gr";
import { Link } from "react-router-dom";
import api from "../../script/axiosApi.tsx";
import React from "react";
import {User} from "../../../interfaces.tsx"
import { Socket } from "socket.io-client";
import GreenAlert from "../Alert/GreenAlert.tsx";


const dropIn = {
    hidden:{y:"-100vh",
            opacity: 0,},
    visible:{y: "0",
            opacity: 0,
            transotion:{
                duration:0.1,
                type:"spring",
                damping: 100,
                stiffness: 500,
            }},
    exit:{y: "100vh",
            opacity: 0,},

};

interface ModalSettingProps {
	handleClose: Function,
	convId: string,
	socket: Socket | null,
}

const ModalSetting = ({handleClose, convId,  socket }: ModalSettingProps) => {
    const [password, setPassword] = useState(false);
	const [users, setUsers] = useState<User[]>([]);
	const [selectTags, setSelectTag] = useState([{ id: 1, selectedOption: ''}]);
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


	useEffect(()=> {

		console.log("convid =", convId)
		const getUsers = async ()=>{
			try {
				const currentConv = await api.post("/convId", {convId: convId});
				
				// console.log("conv private =================== ", )
				if (currentConv.data.private)
					setPrivateConv(true);
				const tmpUsers = await api.get("/users");
				console.log("users=", tmpUsers.data);
				setUsers(tmpUsers.data);
				setLoading(false);
			} catch(err){
				console.log(err)
			}
		}
		getUsers();
	}, []);

	useEffect(() => {
		// Function to run when myVariable changes
		const handleVariableChange = () => {
		  console.log('Variable changed:', privateConv);
		  if (privateConv === undefined)
		  {
			console.log("return")
			return ;
		  }
		  try {
			if (privateConv)
				api.post("/private", {convId: convId})
			else
				api.post("/public", {convId: convId})
		  } catch (err){
			console.log(err);
		  }
		};
		if (!loading)
			handleVariableChange();
		// return () => {
		//   handleVariableChange();
		// };
	  }, [privateConv]);

    // const [multi, setMulti] = useState(false);
    // const [selectedOptionArray, setSelectedOptionArray] = useState([]);


    const handleOptionChange = (selectId: number, selectedOption: string) => {
		console.log("tag= ", selectTags)
		console.log("option= ", selectedOption)
        setSelectTag((prevTags) => 
		prevTags.map((tag) =>
		tag.id === selectId ? { ...tag, selectedOption } : tag
		)
        );
		setSelectedUser(selectedOption)
    };

	const handleCheckPass = (e: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
		setPassword(e.target.checked);
		console.log("password??", e.target.checked);
	}

	// const handleCheckPriv = (e: { target: { checked: any; }; }) => {
	// 	// setPassword(e.target.checked);
	// 	if (e.target.checked)
	// 	{
	// 		console.log("chack true", e.target.checked)
	// 		try{
	// 			api.post("/private", {convId: convId})
	// 		} catch(err) {
	// 			console.log(err);
	// 		}
	// 	}
	// 	else
	// 	{
	// 		console.log("chack false", e.target.checked)
	// 		try{
	// 			api.post("/private", {convId: convId})
	// 		} catch(err) {
	// 			console.log(err);
	// 		}
	// 	}
	// }

	const handleName = async (e: { key: string; })=>{
		if (e.key !== "Enter")
			return ;
		try{
			api.post("/name", {convId: convId, name: newName})
			window.location.reload()
		} catch(err) {
			console.log(err);
		}
		handleClose();
	}

	const handlePassword = async (e: { key: string; })=>{
		if (e.key !== "Enter")
			return ;
		try{
			await api.post("/password", {convId: convId, password: newPassword})
		} catch(err) {
			console.log(err);
		}
		handleClose();
	}

	const [unban, setUnban] = useState(false);
	const closeUnban = () => setUnban(false);
    const handleBan = async () => {
		// console.log("ban option= ", selectedUser)
		try{
			// console.log("user select=", selectedUser.length)
			if (!selectedUser.length)
				return ;
			const res = await api.post("/ban", {convId: convId, username: selectedUser})
			if (res.data === 2)
				setUnban(true);

			if (socket)
			{
				console.log("emit to ban server")
				socket.emit("ban", {username: selectedUser})
			}
		} catch(err) {
			console.log(err);
		}
		handleClose();
	};

	const handleAdmin = async () => {
		if (!selectedUser.length)
			return ;
		try{
			await api.post("/admin", {convId: convId, username: selectedUser})
		} catch(err) {
			console.log(err);
		}
		handleClose();
	};

	const handleMute = async (e: { key: string; }) => {
		console.log(`e in press= ${e.key}`)
		if (e.key != "Enter")
			return ;

		// console.log("value mute = ", e.target.value);
		console.log("value mute = ", time);
		try{
			await api.post("/mute", {convId: convId, username: selectedUser, time: time})
		} catch(err) {
			console.log(err);
		}
		handleClose();
	};

	const handleInvite = async () => {
		try{
			await api.post("/invite", {convId: convId, username: selectedUser})
		} catch(err) {
			console.log(err);
		}
		handleClose();
	};

	const handleKeyPress = async (e: { key: string; })=> {
		if (e.key !== "Enter")
			return ;
		try{

		} 
		catch(err){
			
		}
	}

    return (
        <Backdrop onClick={handleClose}>
            <motion.div
                onClick={(e) => e.stopPropagation()}
                className="modalSetting"
                initial="hidden"
                animate="visible"
                exit="exit"
            >

{/* First selection  */}
                <div className="settingFirstPart">
                    <div>
						<div>
                    		<Link to="#" onClick={light} className={ privateConv ?  "submit" : "darkSubmit"}>Public</Link>
							<Link to="#" onClick={dark} className={ privateConv ?  "darkSubmit" : "submit"}>Private</Link>
						</div>
                        {/* <p className="checkbox">Private<input className="check"type="checkbox" value="private" onChange={handleCheckPriv}/></p> */}
                        <p className="checkbox">Password<input className="inside_ckeckbox" type="checkbox" value="password" checked={password} onChange={handleCheckPass}/> </p>
                        
						
						{password ? (
							<input 
								onChange={(e) => setNewPassword(e.target.value)}
								onKeyDown={handlePassword} 
								type="password"
								className="in"
								placeholder="Password"/>
							):
							("")}

                    </div>
                    <div className="forName">
                        <input 
							onChange={(e) => setNewName(e.target.value)}
							onKeyDown={handleName} 
							type="text" 
							className="in" 
							placeholder="New Name"
						/>
                    </div>
                </div>

{/* Second selection  */}
                
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
				          {item.username}
				        </option>
				      ))}
				    </select>
				  </div>
				))}


                <div>
					<Link to="#" onClick={handleInvite} className="submit">Invite</Link>
                    <Link to="#" onClick={handleBan} className="submit">Ban</Link>
                    <Link to="#" onClick={mute ? darkMute : lightMute} className={mute ? "darkSubmit": "submit"}>Mute</Link>
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
					):("")}
					<AnimatePresence initial={false} onExitComplete={() => null}>
			{unban ? (
				<GreenAlert handleClose={closeUnban} text={selectedUser+": was unbanned"} />
			): ("")}
        </AnimatePresence>

            </motion.div>
        </Backdrop>
    )
}

export default ModalSetting