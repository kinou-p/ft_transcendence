/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Message.tsx                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: apommier <apommier@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/06/01 18:24:46 by apommier          #+#    #+#             */
/*   Updated: 2023/06/24 16:00:48 by apommier         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useEffect, useState, useRef } from "react";
import api from '../../script/axiosApi.tsx';
import styled from "styled-components"
import DefaultPicture from '../../assets/profile.jpg'
// import { useRef } from "react";
// import { useEffect } from "react";
import '../../styles/Messages.css'
import {User, Conv, Message} from "../../../interfaces.tsx"
import React from "react";

const MeStyleP = styled.p`
	background-color: #5843e4;
	padding 10px 20px;
	border-radius 10px;
	color: white;
	margin: 10px;
`

interface MessageMeProps {
	message: Message;
	own: boolean;
  }

function MessageMe({message, own}: MessageMeProps){

	const [profilePicture, setProfilePicture] = useState('');
	const [sender, setSender] = useState<User>();
	const [conv, setConv] = useState<Conv>();

	const [user, setUser] = useState<User>();
	const scrollRef = useRef<HTMLDivElement>(null);


	useEffect(() => {
		if (scrollRef.current)
		{
			scrollRef.current.scrollIntoView({ behavior: "smooth"});
		}})
	useEffect(() => {
		const fetchProfilePicture = async () => {
			try {
				console.log("useEffect message")
			//   const user = await api.get("/profile");
				const tmpSender = await api.post("/user", {username: message.sender})
				const tmpConv = await api.post("/convId", {convId: message.convId})
				// const tmpSender = await api.post("/user", {username: message.sender})
				const tmpUser = await api.get("/profile")
				const pic = await api.post("/getPicture", {username: message.sender})
				// console.log(`user naem profile pic222= ${currentUser.username}`)
				// console.log(` profile pic222= ${pic.data}`)
				setConv(tmpConv.data);
				setUser(tmpUser.data);
				setSender(tmpSender.data);
				setProfilePicture(pic.data);
			} catch (error) {
				console.error('Error fetching profile picture:', error);
			}
		  };
		fetchProfilePicture();
	}, [])

	const handleButtonClick = () => {
		if (!sender)
			return ;
		let path = `http://` + process.env.REACT_APP_BASE_URL + `/profile/${sender.username}`;
		// console.log("path= ", path)
		// history(path, { replace: true });
		// window.location.replace(path);
		window.history.pushState({}, '', path);
		window.location.reload();
	};

	// const isAllowed = async () => {
	// 	const ret = await api.post("/allowed", {convId: message.convId});
	// 	return ret.data;
	// }

	if (!user || !sender || !conv)
		return (<></>);
	// console.log("result includes=", conv.banned.includes(user.username))
	// console.log("result includes=", conv.blocked.includes(user.username))
	// const conv2: Conv = getConv();
	// if (!conv)
	// isAllowed().then((ret: number) => {
	// 	if (!ret)
	// 	{
	// 		console.log("return not allowed");
	// 		return ;
	// 	}
	// 	// Use the resolved currentConv here
	//   });

	if (user.blocked && user.blocked.includes(message.sender))
		return (<></>);
	else if (conv.banned && conv.banned.includes(user.username))
		return (<></>);
	else if (conv.muted && conv.muted.includes(user.username))
	{
		// console.log("muted00")
		return (<></>);
	}
	// if (user.blocked.includes(message.sender))/
	console.log("no return message good");
	return (
		<div className={own ? "meMessage" : "youMessage"} ref={scrollRef}>
			<div>
				{profilePicture ? (
					<img className="messageInfo" onClick={() => handleButtonClick()} src={`data:image/jpeg;base64,${profilePicture}`} />
				) : (
					<img className="messageInfo" onClick={() => handleButtonClick()} src={DefaultPicture} alt="Default Profile Picture" />
				)}
			</div>
			{/* <div className="usernameMesage">{message.senderNickname}</div>	 */}
			{sender ? (
			<div className="usernameMesage">{sender.nickname}</div>
			): ""}
			<div className="messageContent">
				<MeStyleP>{message.text}</MeStyleP>
			</div>
		</div>

	)
}

export default MessageMe
