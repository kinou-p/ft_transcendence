import React, { useState, useEffect, useRef } from "react";
import io, { Socket } from 'socket.io-client';
import '../../styles/Messages.css'
import styled from "styled-components";
import DefaultPic from '../../assets/profile.jpg'
import api from '../../script/axiosApi.tsx';
import { motion , AnimatePresence} from "framer-motion";
import Modal from "./Modal.tsx";
import GameModal from "./GameModal.tsx";

import Message from "./Message.tsx"
// import Input from "./Input";

//react icons
import { TbSend } from 'react-icons/tb';
import { ImBlocked } from 'react-icons/im';
import { MdOutlineGroupAdd } from 'react-icons/md';
import { GrAdd } from 'react-icons/gr';
import { RiListSettingsLine } from 'react-icons/ri'

// import { Rank } from "../../DataBase/DataRank";
import GreenAlert from "../Alert/GreenAlert.tsx";
import RedAlert from "../Alert/RedAlert.tsx";
import YellowAlert from "../Alert/YellowAlert";
import ModalSetting from "./ModalSetting.tsx";
import PartyInvite from "./PartyInvite.tsx";

// import {User, Conv, Message} from "../../../interfaces.tsx"
import {User, Conv} from "../../../interfaces.tsx"
import { IoLogoOctocat } from "react-icons/io5";

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

interface MessageProps {
	id: number;
	convId: number;
 	sender: string;
 	text: string;
 	createdAt?: Date;
  }

function Chats(){

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [conversations, setConversation] = useState([]);
	const [partyInvite, setPartyInvite] = useState([]);
	const [user, setUser] = useState<User>();
	const [currentChat, setCurrentChat] = useState<Conv>(); // false is good?
	const [isAdmin, setIsAdmin] = useState<boolean>(false); // false is good?
	// const [currentChat, setCurrentChat] = useState(false); // false is good?
	const [messages, setMessage] = useState<MessageProps[]>([]);
	const [newMessages, setNewMessage] = useState("");
	const [incomingMessage, setIncomingMessage] = useState<MessageProps>();

	// let socket: Socket;
	const socket = useRef<Socket | null>(null);
	// const socket = Socket<DefaultEventsMap, DefaultEventsMap> | null
	// socket = useRef( useRef<SocketIOClient.Socket | null>(null));


	useEffect(()=> {

		const getConv = async ()=>{
			try{
				const convs = await api.get("/conv")
				const tmpInvite = await api.get("/partyInvite")
				const tmpUser = await api.get("/profile")
				const tmpUsers = await api.get("/users");

				console.log(convs);

				// console.log("invite data use effect= ", tmpInvite.data);
				setPartyInvite(tmpInvite.data);
				setUser(tmpUser.data);
				setConversation(convs.data);
				setUsers(tmpUsers.data);

				// console.log(`connection....`);
				socket.current = io('http://' + process.env.REACT_APP_SOCKET_URL + ':4001', { transports: ['polling'] });
				// console.log(`connection done`);
				socket.current.emit('connection', {username: tmpUser.data.username})
				socket.current.on('message', (data) => { //data should be a message ?)
					setIncomingMessage(data);
				});

				socket.current.on('ban', (data) => {
					// setIncomingMessage(data);
					console.log("banned hehe");
					window.location.reload()
				});

				socket.current.on('mute', (data) => {
					console.log("muted hehe");
					//set mute var to true and do nothing
				});

				setIsLoading(false)

			}
			catch(err){
				console.log("ERRORRRRR")
				console.log(err);
			}
		};
		getConv();

		return () => {
			console.log("Cleanup");
			if (socket.current)
				socket.current.disconnect();
		  //   cleanup(); // Call the cleanup function to stop the ongoing process or perform necessary cleanup tasks
				// cleanup();
		  };

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
			if (currentChat && incomingMessage && currentChat.id === incomingMessage.convId)
			{
				console.log("incoming meaasge=",incomingMessage)
				// if (user && !user.blocked.find(incomingMessage.sender))
					// setMessage((prev) => [...prev, incomingMessage, key: incomingMessage.id]);
					// setMessage((prev) => [...prev, { ...incomingMessage, key: incomingMessage.id }]);
					setMessage((prev) => [...prev, incomingMessage]);
			}
		}
		updateChat();

	}, [incomingMessage, currentChat])

	useEffect(()=> {
		const getMessage = async ()=>
		{
			if (!currentChat)
				return ;
			const data = {convId: currentChat.id};

			try {
				const res = await api.post('/getMessage', data);
				console.log("message of conv=", res.data)
				setMessage(res.data);
			} catch(err) {

			}
		}
		getMessage();
	}, [currentChat]);

	const handleSubmit = async (e: { key?: any; preventDefault: any; })=>{
		e.preventDefault();
		// console.log(`e= ${e.key}`)
		// console.log(`name= ${user.username}`)
		// let message;
		console.log("in handle");
		if (!user || !currentChat)
			return ;
		const message = {
			sender: user.username,
			text: newMessages,
			convId: currentChat.id,
			members: null,
			id: null,
		};
		try{
			const allowed = await api.post('/allowed', {convId: currentChat.id});
			console.log("convid:", currentChat.id);
			if (!allowed.data)
			{
				console.log("muted or banned");
				return ;
			}
			console.log("not muted or banned");
			const res = await api.post('/message', message);
			const convMember = await api.post('/member', message);
			message.members = convMember.data.members;
			message.id = res.data.id
			setMessage([...messages, res.data]);
			setNewMessage("");
			if (socket.current)
				socket.current.emit('sendMessage', message);
		}
		catch(err){
			 console.log(err)
		}
	}

	const handleKeyPress = async (e: { key?: any; preventDefault: () => void; })=> {
		// console.log(`e in press= ${e.key}`)
		if (e.key !== "Enter")
			return ;
		handleSubmit(e);
	}



	const [friend, setFriend] = useState("");
	// const [modalOpen, setModalOpen] = useState(false);
	const [addFriend, setAddFriend] = useState(false);
	const [block, setBlock] = useState(false);

	const [showAddFriendAlert, setShowAddFriendAlert] = useState(false);
	const [showBlockAlert, setShowBlockAlert] = useState(false);

	const [setting, setSetting] = useState(false);

	const [newGameModalOpen, setNewGameModalOpen] = useState(false);
	const [newConversationModalOpen, setNewConversationModalOpen] = useState(false);

    const [selectTags, setSelectTag] = useState([{ id: 1, selectedOption: ''}]);
	const [users, setUsers] = useState<User[]>([]);


	const openNewGameModal = () => {
	  setNewGameModalOpen(true);
	};

	const closeNewGameModal = () => {
	  setNewGameModalOpen(false);
	};

	const openNewConversationModal = () => {
	  setNewConversationModalOpen(true);
	};

	const closeNewConversationModal = () => {
	  setNewConversationModalOpen(false);
	};

	// const close = () => setModalOpen(false);
	// const open = () => setModalOpen(true);
	// const closeAddFriend = () => setAddFriend(false);
	// const closeBlock = () => setBlock(false);
	const closeSetting = () => setSetting(false);


	// const closeAddFriend = () => setAddFriend(false);
	// const closeBlock = () => setBlock(false);


	const handleFriend = (event: { target: { value: React.SetStateAction<string>; }; }) => {
		setFriend(event.target.value);
	  };

	  const handleAddFriend = async () => {
		try{
			console.log("friend= ", friend);
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

	  const handleOptionChange = (selectId: number, selectedOption: string) => {
		console.log("selected Option=", selectedOption)
		setFriend(selectedOption);
        setSelectTag((prevTags) =>
            prevTags.map((tag) =>
                tag.id === selectId ? { ...tag, selectedOption } : tag
            )
        );
    };

//========================================================================================================
//========================================================================================================
//                                              HTML
//========================================================================================================
//========================================================================================================


	return (
		<div className="chat">

			<div className='navbar'>
				{/* <img src={DefaultPic} alt="profile" className="pic"/> */}
				<IoLogoOctocat className="catchat"/>
				<span>
					{isLoading || !user ? (
        				<h4>Loading...</h4>
      				) : (
        				<h2>Chat</h2>
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
					{selectTags.map((selectTag) => (
				  <div key={selectTag.id}>
				    <select
				      value={selectTag.selectedOption}
					  className="lookForFriends"
				      onChange={(a) => handleOptionChange(selectTag.id, a.target.value)}
				    >
				      <option value="">{
					selectTag.selectedOption ? selectTag.selectedOption : "Select a user"
					}</option>
				      {users.filter((item) => !selectTags.some((tag) => tag.selectedOption === item.username)).map((item, index) => (
				        <option key={index} value={item.username}>
				          {item.username}
				        </option>
				      ))}
				    </select>
				  </div>
				))}
      	<TouchDiv>
        <motion.div onClick={handleAddFriend}>
          <MdOutlineGroupAdd className="catchat"/>
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
          <ImBlocked  className="block"/>
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
			{setting && <ModalSetting handleClose={closeSetting} convId={currentChat.id.toString()} socket={socket.current}/>}
		</AnimatePresence>
		</motion.div>
		</TouchDiv>
	  ):("")}
    </div>


			</div>
			<div className="messages_box">
				<div className="contact">

	  				<UserChat>
      				  <motion.div className="newMessage" onClick={openNewGameModal}>
      				    <GrAdd />
      				    <span>New Game</span>
      				  </motion.div>
      				  {newGameModalOpen && <GameModal handleClose={closeNewGameModal} />}
      				</UserChat>

      				<UserChat>
      				  <motion.div className="newMessage" onClick={openNewConversationModal}>
      				    <GrAdd />
      				    <span>New Conversation</span>
      				  </motion.div>
      				  {newConversationModalOpen && (
      				    <Modal handleClose={closeNewConversationModal} />
      				  )}
      				</UserChat>


					{/* {partyInvite.map((c) => {
						return (

						)})
					} */}

					{partyInvite.map( i =>(
						<PartyInvite currentInvite={i}/>
					))}

					{conversations.map((c: Conv, index ) => {
						return (
						<div key={index}
							onClick={() => setCurrentChat(c)}>
							<UserChat>
							<img className="pic-user" src={DefaultPic} alt="User" />
							<div className="infoSideBar">
								<span>{c.name}</span>
								{/* <SideP>Desc?</SideP> */}
							</div>
							</UserChat>
						</div>

						)})}
				</div>

				{
					currentChat && user ? (
						<>
					<div className="messages">
						<div className="scroll">
							{messages.map(m=>(
								<Message key={m.id} message= {m} own={m.sender === user.username}/>
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
