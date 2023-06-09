/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Message.jsx                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: apommier <apommier@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/06/01 18:24:46 by apommier          #+#    #+#             */
/*   Updated: 2023/06/09 09:00:06 by apommier         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useEffect, useState, useRef } from "react";
import api from '../../script/axiosApi';
import styled from "styled-components"
import DefaultPicture from '../../assets/profile.jpg'
// import { useRef } from "react";
// import { useEffect } from "react";
import '../../styles/Messages.css'

const MeStyleP = styled.p`
	background-color: lightgray;
	padding 10px 20px;
	border-radius 10px 0px 10px 10px;
	color: black;
	margin-right: 20px;
`

function MessageMe({message, own}){
	
	const [profilePicture, setProfilePicture] = useState('');
	const scrollRef = useRef();

	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behavior: "smooth"})
		const fetchProfilePicture = async () => {
			try {
			//   const user = await api.get("/profile");
				const pic = await api.post("/getPicture", {username: message.sender})
				// console.log(`user naem profile pic222= ${currentUser.username}`)
				// console.log(` profile pic222= ${pic.data}`)
				setProfilePicture(pic.data);
			} catch (error) {
				console.error('Error fetching profile picture:', error);
			}
		  };
		fetchProfilePicture();
	}, [])

	return (
		<div className={own ? "meMessage" : "youMessage"} ref={scrollRef}>
			<div>
				{/* <img className="messageInfo" src={DefaultPic} alt="profile" />
				 */}
				{profilePicture ? (
					<img className="messageInfo" src={`data:image/jpeg;base64,${profilePicture}`} />
				) : (
					<img className="messageInfo" src={DefaultPicture} alt="Default Profile Picture" />
				)}
			</div>
			{/* <div className="usernameMesage">{message.senderNickname}</div>	 */}
			<div className="usernameMesage">{message.sender}</div>
			<div className="messageContent">
				<MeStyleP>{message.text}</MeStyleP>
			</div>
		</div>
	)
}

export default MessageMe