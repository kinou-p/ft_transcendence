/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Message.tsx                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: apommier <apommier@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/06/01 18:24:46 by apommier          #+#    #+#             */
/*   Updated: 2023/06/25 23:24:46 by apommier         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useEffect, useState, useRef } from "react";
import api from '../../script/axiosApi.tsx';
import styled from "styled-components"
import DefaultPicture from '../../assets/profile.jpg'
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
				const tmpSender = await api.post("/user", {username: message.sender})
				const tmpConv = await api.post("/convId", {convId: message.convId})
				const tmpUser = await api.get("/profile")
				const pic = await api.post("/getPicture", {username: message.sender})
				setConv(tmpConv.data);
				setUser(tmpUser.data);
				setSender(tmpSender.data);
				setProfilePicture(pic.data);
			} catch (error) {
				console.error('Error fetching profile picture:', error);
			}
		  };
		fetchProfilePicture();
	}, []);

	const handleButtonClick = () => {
		if (!sender)
			return ;
		let path = `http://` + process.env.REACT_APP_BASE_URL + `/profile/${sender.username}`;
		window.history.pushState({}, '', path);
		window.location.reload();
	};


	if (!user || !sender || !conv)
		return (<></>);

	if (user.blocked && user.blocked.includes(message.sender))
		return (<></>);
	else if (conv.banned && conv.banned.includes(user.username))
		return (<></>);
	else if (conv.muted && conv.muted.includes(user.username))
	{
		return (<></>);
	}
	return (
		<div className={own ? "meMessage" : "youMessage"} ref={scrollRef}>
			<div>
				{profilePicture ? (
					<img className="messageInfo" onClick={() => handleButtonClick()} src={`data:image/jpeg;base64,${profilePicture}`} />
				) : (
					<img className="messageInfo" onClick={() => handleButtonClick()} src={DefaultPicture} alt="Default Profile Picture" />
				)}
			</div>
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
