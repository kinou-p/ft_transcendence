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
			await api.post("/join", {convId: channel})
			window.location.reload();
		} catch(err) {
			console.log(err);
		}
    };

    const saveSelectedOptions = async () => {
        // const selectedOptions = selectTags.map((tag) => tag.selectedOption);
		const selectedOptions = selectTags.map((tag) => tag.selectedOption).filter((option) => option !== '');

		console.log("selected= ", selectedOptions);
		//do db stuff here
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
    // let new_name;

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
					// {/* {channel.private ? (
                    //   <input className="mdp" placeholder="passdddddword" type="text" />
                    //   ):("")} */}
      			)}
				<div className="div_submit">
					<Link to='#' className="submit" onClick={ joinChannel }>Join</Link>
				</div>
			  </div>
            </motion.div>
        </Backdrop>
    )
}

export default Modal
