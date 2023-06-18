import React, { useState, useEffect, useRef } from "react";
import io from 'socket.io-client';
import '../../styles/Messages.css'
import styled from "styled-components";
import DefaultPic from '../../assets/profile.jpg'
import api from '../../script/axiosApi.tsx';
import { motion , AnimatePresence} from "framer-motion";
import Modal from "./Modal.tsx";

import Message from "./Message.tsx"
// import Input from "./Input";

//react icons
import { TbSend } from 'react-icons/tb';
import { ImBlocked } from 'react-icons/im';
import { MdOutlineGroupAdd } from 'react-icons/md';
import { GrAdd } from 'react-icons/gr';
import { RiListSettingsLine } from 'react-icons/ri'

import { Rank } from "../../DataBase/DataRank";
import GreenAlert from "../Alert/GreenAlert.tsx";
import RedAlert from "../Alert/RedAlert.tsx";
import YellowAlert from "../Alert/YellowAlert";
import ModalSetting from "./ModalSetting.tsx";


const TouchDiv = styled.div`
	margin-left: 10px;
	margin-right: 4px;
	margin-bottom: 21px;
	margin-top: 21px;
	cursor: pointer;
	justify-content: space-around;
	
	&:hover {
		color: #F4F3EF;
	}
`

const UserChat = styled.div `
	padding: 5px;
	display: flex;
	align-items: center;
	gap: 5px;
	color: white;
	cursor: pointer;

	&:hover{
		background-color: #3e3c61;
	}
	&:active {
		filter: black;
	}
`

// const SideSpan = styled.span`
// 	font-size: 18px;
// 	font-weight: 500;
// `

const SideP = styled.p`
	font-size: 14px;
	color: lightgray;
	margin-left: 15px;
`

//========================================================================================================
//========================================================================================================
//                                              Logical part			                                  
//========================================================================================================
//========================================================================================================


function Chats(){
	
	const [isLoading, setIsLoading] = useState(true);
	const [conversations, setConversation] = useState([]);
	const [user, setUser] = useState(null);
	const [currentChat, setCurrentChat] = useState(false); // false is good?
	const [isAdmin, setIsAdmin] = useState(false); // false is good?
	// const [currentChat, setCurrentChat] = useState(false); // false is good?
	const [messages, setMessage] = useState([]);
	const [newMessages, setNewMessage] = useState("");
	const [incomingMessage, setIncomingMessage] = useState("");
	const socket = useRef();
	


	useEffect(()=> {

		const getConv = async ()=>{
			try{
				const convs = await api.get("/conv")
				const tmpUser = await api.get("/profile")
				console.log(convs);
				setUser(tmpUser.data);
				setConversation(convs.data);
				socket.current = io('http://' + process.env.REACT_APP_BASE_URL + ':4001');
				console.log(`connection....`);
				socket.current.emit('connection', {username: tmpUser.data.username})
				socket.current.on('message', (data) => { //data should be a message ?
					console.log(`message received data= ${data.sender}`)
					console.log(`message received data= ${data.convId}`)
					console.log(`message received data= ${data.sender}`)
					console.log(`current chat = ${currentChat}`)
					setIncomingMessage(data);
				});
				setIsLoading(false)

			}
			catch(err){
				console.log(err);
			}
		};
		getConv();

	}, [])

	useEffect(()=> {
		
		const updateChat = async ()=> {
			// if (currentChat)
			// 	console.log(currentChat.id)
			if (currentChat)
			{

				try {
					const res = await api.post("/isAdmin", {convId: currentChat.id})
					console.log("isadmin= ", res.data)
					setIsAdmin(res.data);
				} catch (err) {
					console.log(err);
				}
			}
			// console.log(`result1 = ${currentChat.id !== incomingMessage.convId}`)
			if (currentChat !== null && currentChat.id === incomingMessage.convId)
			{
				
				setMessage((prev) => [...prev, incomingMessage]);
			}
		}
		updateChat();

	}, [incomingMessage, currentChat])

	useEffect(()=> { 
		const getMessage = async ()=>
		{
			const data = {convId: currentChat.id};
			
			try {
				const res = await api.post('/getMessage', data);
				setMessage(res.data);
			} catch(err) {

			}
		}
		getMessage();
	}, [currentChat]);

	const handleSubmit = async (e)=>{
		e.preventDefault();
		// console.log(`e= ${e.key}`)
		// console.log(`name= ${user.username}`)
		const message = {
			sender: user.username,
			text: newMessages,
			convId: currentChat.id,
			members: null
		};
		try{
			console.log(`id= ${currentChat.id}`)
			const allowed = await api.post('/allowed', {convId: message.convId, username: user.username});
			console.log("allowed= ", allowed.data)
			if (!allowed.data)
				return ;
			const res = await api.post('/message', message);
			const convMember = await api.post('/member', message);
			message.members = convMember.data.members;
			console.log(convMember);
			// console.log(`currentChat= ${currentChat.id}`)
			
			setMessage([...messages, res.data]);
			setNewMessage("");
			socket.current.emit('sendMessage', message);
		} 
		catch(err){
			 console.log(err)
		}
	}

	const handleKeyPress = async (e)=>{
		// console.log(`e in press= ${e.key}`)
		if (e.key !== "Enter")
			return ;
		// console.log(`name= ${user.username}`)
		const message = {
			sender: user.username,
			text: newMessages,
			convId: currentChat.id,
			members: null
		};
		try{
			console.log(`id= ${currentChat.id}`)
			const res = await api.post('/message', message);
			const convMember = await api.post('/member', message);
			message.members = convMember.data.members;
			console.log(convMember);
			// console.log(`currentChat= ${currentChat.id}`)
			
			setMessage([...messages, res.data]);
			setNewMessage("");
			socket.current.emit('sendMessage', message);
		} 
		catch(err){
			 console.log(err)
		}
	}


	
	const [friend, setFriend] = useState("");
	const [modalOpen, setModalOpen] = useState(false);
	const [addFriend, setAddFriend] = useState(false);
	const [block, setBlock] = useState(false);

	const [showAddFriendAlert, setShowAddFriendAlert] = useState(false);
	const [showBlockAlert, setShowBlockAlert] = useState(false);

	const [setting, setSetting] = useState(false);
	const close = () => setModalOpen(false);
	const open = () => setModalOpen(true);
	// const closeAddFriend = () => setAddFriend(false);
	// const closeBlock = () => setBlock(false);
	const closeSetting = () => setSetting(false);


	// const closeAddFriend = () => setAddFriend(false);
	// const closeBlock = () => setBlock(false);


	const handleFriend = (event) => {
		setFriend(event.target.value);
	  };
	
	  const handleAddFriend = async () => {
		try{
			const res = await api.post("/invite", {username: friend})
			// if (res.data === 1)
			// console.log("res in friend= ", res)
			console.log("res in friend= ", res.data)
			if(res.data === 1)
			{
			  setAddFriend(true);
			  setBlock(false); // Reset block state
			  setShowBlockAlert(false);
			}
			else
				setAddFriend(false);
			setShowAddFriendAlert(true);
		} catch(err) {
			console.log(err)
		}
	  };
	
	  const handleBlockFriend = async () => {
		try{
			const res = await api.post("/block", {username: friend})
			// if(1)
			if (res.data === 1)
			{
				setBlock(true);
				setAddFriend(false); // Reset addFriend state
				setShowAddFriendAlert(false);
			}
			else
				setBlock(false);
			setShowBlockAlert(true);
		} catch(err) {
			console.log(err)
		}
	  };
	
	  const closeAddFriend = () => {
		setAddFriend(false);
		setShowAddFriendAlert(false);
	  };
	
	  const closeBlock = () => {
		setBlock(false);
		setShowBlockAlert(false);
	  };

//========================================================================================================
//========================================================================================================
//                                              HTML			                                  
//========================================================================================================
//========================================================================================================


	return (
		<div className="chat">
		
			<div className='navbar'>
				<img src={DefaultPic} alt="profile" className="pic"/>
				<span>
					{isLoading ? (
        				<h4>Loading...</h4>
      				) : (
        				<h4>{user.nickname}</h4>
      				)}
	  			</span>
				{/* <div className="end">
					<input className="lookForFriends" type="text" value={friend} onChange={handleFriend}/>
					<TouchDiv>
						<motion.div
						onClick={() => (addFriend ? setAddFriend(false) : setAddFriend(true))}>
							<MdOutlineGroupAdd/>
						</motion.div>
						<AnimatePresence
							initial={false}
							onExitComplete={() => null}
						>
							{addFriend && <GreenAlert handleClose={closeAddFriend} text={friend + " was successfuly added"}/>}
						</AnimatePresence>
					</TouchDiv>
					<TouchDiv>
						<motion.div 
						onClick={() => (block ? setBlock(false) : setBlock(true))}
						>
						<ImBlocked/>
						<AnimatePresence
							initial={false}
							onExitComplete={() => null}
							>
							{block && <RedAlert handleClose={closeBlock} text={friend + " was successfuly blocked"}/>}
						</AnimatePresence>
						</motion.div>
					</TouchDiv>
					{currentChat ? (

						<TouchDiv>
						<motion.div 
						onClick={() => (setting ? setSetting(false) : setSetting(true))}
						>
						<RiListSettingsLine/>
						<AnimatePresence
							initial={false}
							onExitComplete={() => null}
							>
							{setting && <ModalSetting handleClose={closeSetting} convId={currentChat.id}/>}
						</AnimatePresence>
						</motion.div>
					</TouchDiv>
					):("")}
				</div> */}

<div className="end">
      <input className="lookForFriends" type="text" value={friend} onChange={handleFriend} />
      <TouchDiv>
        <motion.div onClick={handleAddFriend}>
          <MdOutlineGroupAdd />
        </motion.div>
        <AnimatePresence initial={false} onExitComplete={() => null}>
			{showAddFriendAlert && addFriend && (
				<GreenAlert handleClose={closeAddFriend} text={ 'invitation sent to ' + friend} />
			)}
          {showAddFriendAlert && !addFriend && (
			  <RedAlert handleClose={closeAddFriend} text={friend + ' was not found'} />
			  )}
        </AnimatePresence>
      </TouchDiv>
      <TouchDiv>
        <motion.div onClick={handleBlockFriend}>
          <ImBlocked />
        </motion.div>
        <AnimatePresence initial={false} onExitComplete={() => null}>
          {showBlockAlert && block && (
            <GreenAlert handleClose={closeBlock} text={friend + ' was successfully blocked'} />
          )}
          {showBlockAlert && !block && (
            <RedAlert handleClose={closeBlock} text={friend + ' was not found'} />
          )}
        </AnimatePresence>
      </TouchDiv>
	  {currentChat && isAdmin ? (
		<TouchDiv>
		<motion.div 
		onClick={() => (setting ? setSetting(false) : setSetting(true))}
		>
		<RiListSettingsLine/>
		<AnimatePresence
			initial={false}
			onExitComplete={() => null}
			>
			{setting && <ModalSetting handleClose={closeSetting} convId={currentChat.id}/>}
		</AnimatePresence>
		</motion.div>
		</TouchDiv>
	  ):("")}
    </div>


			</div>
			<div className="messages_box">
				<div className="contact">
					<UserChat>

						<motion.div className="newMessage"
							onClick={() => (modalOpen ? close() : open())}
						>
							<GrAdd/>
							<span>New Conversation</span>
						</motion.div>
						{modalOpen && <Modal modalOpen={modalOpen} handleClose={close}/>}

					</UserChat>
					{conversations.map((c, index ) => {
						return (
						<div key={index}
							onClick={() => setCurrentChat(c)}>
							<UserChat>
							<img className="pic-user" src={DefaultPic} alt="User" />
							<div className="infoSideBar">
								<span>{c.name}</span>
								<SideP>Desc?</SideP>
							</div>
							</UserChat>
						</div>
				
						)})}
				</div>

				{
					currentChat ? (
						<>
					<div className="messages">
						<div className="scroll">
							{messages.map(m=>(
								<Message message = {m} own={m.sender === user.username} user={m}/>
								))}
						</div>
						{/* <Input/> */}
						<div className="input">
							<input
								onKeyDown={handleKeyPress}
								type="text"
								placeholder="What do you want to say"
								onChange={(e) => setNewMessage(e.target.value)}
								value={newMessages}
								/>
							<div className="send">
								<TbSend onClick={handleSubmit}></TbSend>
							</div>
						</div>
					</div>
				</>
				) : (
					<div className="messages">
						<span className="noConv">Open a conversation</span>
					</div>
				)}
			</div>
		</div>
		// </div>
	);	
}

export default Chats