import { motion } from "framer-motion";
import Backdrop from "../Sidebar/Backdrop.tsx";
// import { Rank } from "../../DataBase/DataRank"
import '../../styles/Messages.css'
import { useState, useEffect } from "react";
import { GrAdd } from "react-icons/gr";
import { Link } from "react-router-dom";
import api from "../../script/axiosApi.tsx";
import React from "react";
import {User, Conv} from "../../../interfaces.tsx"

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

interface ModalProps {
	handleClose: Function,
  }

const Modal = ({handleClose}: ModalProps) => {
    const [selectTags, setSelectTag] = useState([{ id: 1, selectedOption: ''}]);
    const [selectedOptionArray, setSelectedOptionArray] = useState<string[]>([]);
	const [users, setUsers] = useState<User[]>([]);
	const [user, setUser] = useState<User>();
	const [convs, setConvs] = useState<Conv[]>([]);

	const [channel, setChannel] = useState('');

	useEffect(()=> {
		const getConv = async ()=>{
			try {
				const tmpUsers = await api.get("/users");
				const tmpUser = await api.get("/profile");
				const tmpConvs = await api.get("/convs");
				console.log("users=", tmpUsers.data);
				console.log("convs=", tmpConvs.data);
				setUsers(tmpUsers.data);
				setUser(tmpUser.data);
				setConvs(tmpConvs.data);
			} catch(err) {
				console.log(err)
			}
		}
		getConv();
	}, []);

	const [askPass, setAskPass] = useState(false);
	const [PassWord, setPassWord] = useState('');
	useEffect(()=> {

		const getConv = async ()=>{
			console.log("chan changed")
			console.log("chan = ", channel);
			try{

				const tmpConv = await api.post("/convId", {convId: channel});
				if (tmpConv.data.password)
					setAskPass(true);
			}
			catch(err){
				console.log(err);
			}
			// if (channel.password)
			// 	console.log("password true")
			// else 
			// 	console.log("password false")
		}
		getConv();
	}, [channel]);

	const handlePassword = async (e: { key: string; }) => {
		if (e.key !== "Enter")
			return;
		try {
			const ret = await api.post("/verifyPassword", {convId: channel, password: PassWord})
			if (ret)
				console.log("ici ret password", ret);

				// window.location.reload();
		} catch (err) {
			console.log(err);
		}
		handleClose();
	}

    const handleOptionChange = (selectId: number, selectedOption: string) => {
		console.log("selected Option=", selectedOption)
        setSelectTag((prevTags) =>
            prevTags.map((tag) =>
                tag.id === selectId ? { ...tag, selectedOption } : tag
            )
        );
    };

    const addNewSelectedTag = () => {
        const newSelectedId = Math.max (...selectTags.map((tag) => tag.id)) + 1;
        setSelectTag([...selectTags, { id: newSelectedId, selectedOption: ''}]);
		console.log(selectTags)
    };

	const joinChannel = async () => {
		try {
			console.log("channel= ", channel)
			console.log("ici test channel= ", channel)

			await api.post("/join", {convId: channel})
			window.location.reload();
		} catch(err) {
			console.log(err);
		}
    };

    const saveSelectedOptions = async () => {
		const selectedOptions = selectTags.map((tag) => tag.selectedOption).filter((option) => option !== '');

		console.log("selected= ", selectedOptions);
		const data = {
			members: selectedOptions,
		}
		try{
			// test
			await api.post("/conv", data);
			handleClose();
			window.location.reload();
		} catch(err) {
			console.log(err);
		}
        setSelectedOptionArray(selectedOptions);

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
			  <div className="settingFirstPart2">

				{selectTags.map((selectTag) => (
					<div key={selectTag.id}>
				    <select
				      value={selectTag.selectedOption}
				      onChange={(a) => handleOptionChange(selectTag.id, a.target.value)}
					  >
				      <option value="">{
						  selectTag.selectedOption ? selectTag.selectedOption : "Select a user"
						}</option>
				      {users.filter((item) => !selectTags.some((tag) => tag.selectedOption === item.nickname)).map((item, index) => (
						  <option key={index} value={item.username}>
				          {item.nickname}
				        </option>
				      ))}
				    </select>
				  </div>
				))}
            	<div>
            	    <GrAdd onClick={addNewSelectedTag}/>
            	</div>
				<div className="div_submit">
					<Link to='#' className="submit" onClick={saveSelectedOptions}>Submit</Link>
				</div>
				</div>


				<div className="settingSecondPart">

				{convs.length > 0 && (
					<select
					value={channel}
					onChange={(event) => setChannel(event.target.value)}

        			>
        			  <option value="">Select a channel</option>
        			  {convs.map((conv) => (
						  !(!conv.group || conv.private || (conv.banned && user && conv.banned.includes(user.username)) || (conv.members && user && conv.members.includes(user.username))) && (
							  <option key={conv.id} value={conv.id}>
        			        {conv.name}
        			      </option> 
        			    )
						))}
        			</select>
      			)}
 				
				<div>

				  {askPass ? (
					  <input className="mdp" placeholder="password" type="password" onChange={(e) => setPassWord(e.target.value)} onKeyDown={handlePassword}/>
					  ):("") }
					  </div>

				<div className="div_submit">
					<Link to='#' className="submit" onClick={ joinChannel }>Join</Link>
				</div>
			  </div>
            </motion.div>
        </Backdrop>
    )
}

export default Modal
