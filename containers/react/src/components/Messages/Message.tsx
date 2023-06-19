/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Message.tsx                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: apommier <apommier@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/06/01 18:24:46 by apommier          #+#    #+#             */
/*   Updated: 2023/06/19 11:45:54 by apommier         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useEffect, useState, useRef } from "react";
import api from '../../script/axiosApi.tsx';
import styled from "styled-components"
import DefaultPicture from '../../assets/profile.jpg'
// import { useRef } from "react";
// import { useEffect } from "react";
import '../../styles/Messages.css'
import React from "react";

const MeStyleP = styled.p`
	background-color: #5843e4;
	padding 10px 20px;
	border-radius 10px 0px 10px 10px;
	color: white;
	margin-right: 20px;
`

function MessageMe({message, own}){
	
	const [profilePicture, setProfilePicture] = useState('');
	const [sender, setSender] = useState();
	const [conv, setConv] = useState();
	
	const [user, setUser] = useState();
	const scrollRef = useRef();

	useEffect(() => {
		if (scrollRef.current)
		{
			scrollRef.current.scrollIntoView({ behavior: "smooth",})
		}
		const fetchProfilePicture = async () => {
			try {
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
			return;
		let path = `http://` + process.env.REACT_APP_BASE_URL + `/profile/${sender.username}`;
		// console.log("path= ", path)
		// history(path, { replace: true });
		// window.location.replace(path);
		window.history.pushState({}, null, path);
		window.location.reload(false);
	};

	if (!user || !sender || !conv)
		return ;
	// console.log("result includes=", conv.banned.includes(user.username))
	// console.log("result includes=", conv.blocked.includes(user.username))
	if (user.blocked && user.blocked.includes(message.sender))
		return ;
	else if (conv.banned && conv.banned.includes(user.username))
		return ;
	// if (user.blocked.includes(message.sender))/

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