import { motion } from "framer-motion";
import Backdrop from "../Sidebar/Backdrop.tsx";
// import { Rank } from "../../DataBase/DataRank"
import '../../styles/Messages.css'
import { useState, useEffect } from "react";
import { GrAdd } from "react-icons/gr";
import { Link } from "react-router-dom";
import api from "../../script/axiosApi.tsx";
import React from "react";
import {User} from "../../../interfaces.tsx"


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
	convId: string
}

const ModalSetting = ({handleClose, convId}: ModalSettingProps) => {
    const [password, setPassword] = useState(false);
	const [users, setUsers] = useState<User[]>([]);
	const [selectTags, setSelectTag] = useState([{ id: 1, selectedOption: ''}]);
	const [selectedUser, setSelectedUser] = useState("");
	const [newName, setNewName] = useState("");
	const [newPassword, setNewPassword] = useState("");

	useEffect(()=> {

		console.log("convid =", convId)
		const getUsers = async ()=>{
			try {
				const tmpUsers = await api.get("/users");
				console.log("users=", tmpUsers.data);
				setUsers(tmpUsers.data);
			} catch(err){
				console.log(err)
			}
		}
		getUsers();
	}, []);

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
		console.log("password??", e.target.checked)
	}

	const handleCheckPriv = (e: { target: { checked: any; }; }) => {
		// setPassword(e.target.checked);
		if (e.target.checked)
		{
			console.log("chack true", e.target.checked)
			try{
				api.post("/private", {convId: convId})
			} catch(err) {
				console.log(err);
			}
		}
		else
		{
			console.log("chack false", e.target.checked)
			try{
				api.post("/private", {convId: convId})
			} catch(err) {
				console.log(err);
			}
		}
	}

	const handleName = async (e: { key: string; })=>{
		if (e.key !== "Enter")
			return ;
		try{
			api.post("/name", {convId: convId, name: newName})
		} catch(err) {
			console.log(err);
		}
		handleClose();
	}

	const handlePassword = async (e: { key: string; })=>{
		if (e.key !== "Enter")
			return ;
		try{
			api.post("/password", {convId: convId, password: newPassword})
		} catch(err) {
			console.log(err);
		}
		handleClose();
	}

    const handleBan = () => {
		// console.log("ban option= ", selectedUser)
		try{
			// console.log("user select=", selectedUser.length)
			if (!selectedUser.length)
				return ;
			api.post("/ban", {convId: convId, username: selectedUser})
		} catch(err) {
			console.log(err);
		}
		handleClose();
	};

	const handleAdmin = () => {
		if (!selectedUser.length)
			return ;
		try{
			api.post("/admin", {convId: convId, username: selectedUser})
		} catch(err) {
			console.log(err);
		}
		handleClose();
	};

	const handleMute = () => {
		if (!selectedUser.length)
			return ;
		try{
			api.post("/mute", {convId: convId, username: selectedUser})
		} catch(err) {
			console.log(err);
		}
		handleClose();
	};

	const handleInvite = () => {
		try{
			api.post("/invite", {convId: convId, username: selectedUser})
		} catch(err) {
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

{/* First selection  */}
                <div className="settingFirstPart">
                    <div>
                        <p className="checkbox">Private<input className="check"type="checkbox" value="private" onChange={handleCheckPriv}/></p>
                        <p className="checkbox">Password<input type="checkbox" value="password" checked={password} onChange={handleCheckPass}/> </p>
                        
						
						{password ? (
							<input 
								onChange={(e) => setNewPassword(e.target.value)}
								onKeyDown={handlePassword} 
								type="text"
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
					<Link to="#" onClick={handleInvite} className="submit">Send</Link>
                    <Link to="#" onClick={handleBan} className="submit">Ban</Link>
                    <Link to="#" onClick={handleMute} className="submit">Mute</Link>
                    <Link to="#" onClick={handleAdmin} className="submit">Admin</Link>
                </div>

                </div>

            </motion.div>
        </Backdrop>
    )
}

export default ModalSetting