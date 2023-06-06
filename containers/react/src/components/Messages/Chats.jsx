import React, { useState, useEffect, useRef } from "react";
import '../../styles/Messages.css'
import styled from "styled-components";
import DefaultPic from '../../assets/profile.jpg'
import api from '../../script/axiosApi';

import io from 'socket.io-client';
import { TbSend } from 'react-icons/tb';
import MessageYou from "./MessageYou"
import Message from "./Message"
import Input from "./Input";


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
//                                              Socket handler			                                  
//========================================================================================================
//========================================================================================================




//========================================================================================================
//========================================================================================================
//                                              Logical part			                                  
//========================================================================================================
//========================================================================================================


function Chats(){
	
	const [conversations, setConversation] = useState([]);
	const [user, setUser] = useState(null);
	const [currentChat, setCurrentChat] = useState(null);
	const [messages, setMessage] = useState([]);
	const [newMessages, setNewMessage] = useState("");
	const [incomingMessage, setIncomingMessage] = useState("");
	const socket = useRef();
	
	// Socket handler

	// socket.on('message', (data) => { //data should be a message ?
	// 	console.log(`message received data= ${data}`)
	// 	setMessage([...messages, data]);
	// });

	//End of socket handler

	useEffect(()=> {

		const getConv = async ()=>{
			try{
				const convs = await api.get("/conv")
				const tmpUser = await api.get("/profile")
				console.log(convs);
				setUser(tmpUser);
				setConversation(convs.data);
				// return tmpUser;


				console.log(`tmpUser= ${tmpUser.data}`);
				socket.current = io("http://localhost:4001");
				console.log(`connection....`);
				socket.current.emit('connection', {username: tmpUser.data.username})
				// const socket = io("http://localhost:4001", {
				 // 	query: {
				   // 	username: user.data.username,
				  // },});
				socket.current.on('message', (data) => { //data should be a message ?
					console.log(`message received data= ${data.sender}`)
					console.log(`message received data= ${data.convId}`)
					console.log(`message received data= ${data.sender}`)
					console.log(`curretn chat = ${currentChat}`)
					setIncomingMessage(data);
				});

			}
			catch(err){
				console.log(err);
			}
		};
		getConv();

	}, [])

	useEffect(()=> {
		if (currentChat)
		console.log(currentChat.id)
		// console.log(`result1 = ${currentChat.id !== incomingMessage.convId}`)
		if (currentChat !== null && currentChat.id === incomingMessage.convId)
			setMessage((prev) => [...prev, incomingMessage]);
	}, [incomingMessage, currentChat])

	// useEffect(()=> {

	// 	const getConv = async ()=>{
	// 		try{
	// 			const convs = await api.get("/conv")
	// 			const tmpUser = await api.get("/profile")
	// 			console.log(convs);
	// 			setUser(tmpUser);
	// 			setConversation(convs.data);
	// 		}
	// 		catch(err){
	// 			console.log(err);
	// 		}
	// 	};
	// 	getConv();
	// }, [])

	useEffect(()=> { 
		const getMessage = async ()=>
		{
		const data = {
			convId: currentChat.id
		};
		try{
			const res = await api.post('/getMessage', data);
			setMessage(res.data);
		} catch(err){

		}
	}
	getMessage()
	}, [currentChat])



	const handleSubmit = async (e)=>{
		e.preventDefault();
		const message = {
			sender: user.data.username,
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

	return (
		<div className="chat">
			{conversations.map(c=> (
				<div onClick={() => setCurrentChat(c)}>
				<UserChat>
					<img className="pic-user" src={DefaultPic} alt="User" />
					<div className="infoSideBar">
						<span>{c.name}</span>
						<SideP>Desc?</SideP>
					</div>
				</UserChat>
				</div>
			))}

				{
					currentChat ? (
				<>
				 <div className="messages">
					{messages.map(m=>(
						<Message message = {m} own={m.sender === user.data.username}/>
					))}
					{/* <Input/> */}
					<div className="input">
						<input
							type="text"
							placeholder="What do you want to say"
							onChange={(e) => setNewMessage(e.target.value)}
							value={newMessages}
						/>
						<div className="send">
							<TbSend onClick={handleSubmit}></TbSend>
						</div>
					</div>
				</div></>) : (<span className="noConv">Open a conversation</span>)}
			</div>
	);








	
}

export default Chats