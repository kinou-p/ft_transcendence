import React, { useState, useEffect } from "react";
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

const SideSpan = styled.span`
	font-size: 18px;
	font-weight: 500;
`

const SideP = styled.p`
	font-size: 14px;
	color: lightgray;
	margin-left: 15px;
`

function Chats(){

	const [conversations, setConversation] = useState([]);
	const [user, setUser] = useState([]);
	const [currentChat, setCurrentChat] = useState(null);
	const [messages, setMessage] = useState([]);
	const [newMessages, setNewMessage] = useState("");
	const [socket, setSocket] = useState(null);

	useEffect(()=> {
		// setSocket(io("http://localhost:4001"));
	}, [])

	useEffect(()=> {

		const getConv = async ()=>{
			try{
				const convs = await api.get("/conv")
				const tmpUser = await api.get("/profile")
				console.log(convs);
				setUser(tmpUser);
				setConversation(convs.data);
			}
			catch(err){
				console.log(err);
			}
		};
		getConv();
	}, [])

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
			convId: currentChat.id
		};
		try{
			const res = await api.post('/message', message);
			setMessage([...messages, res.data]);
		} catch(err){
			 
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