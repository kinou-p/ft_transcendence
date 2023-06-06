/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Message.jsx                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: apommier <apommier@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/06/01 18:24:46 by apommier          #+#    #+#             */
/*   Updated: 2023/06/01 18:33:43 by apommier         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import React from "react"
import styled from "styled-components"
import DefaultPic from '../../assets/profile.jpg'
import { useRef } from "react";
import { useEffect } from "react";
import '../../styles/Messages.css'

const MeStyleP = styled.p`
	background-color: lightgray;
	padding 10px 20px;
	border-radius 10px 0px 10px 10px;
	color: black;
	margin-right: 20px;
`

function MessageMe({message, own}){
	const scrollRef = useRef();

	useEffect(() => {
	scrollRef.current?.scrollIntoView({ behavior: "smooth"})
}, [])
	return (
		<div className={own ? "meMessage" : "youMessage"} ref={scrollRef}>
			<div>
				<img className="messageInfo" src={DefaultPic} alt="profile" />
			</div>
			<div className="usernameMesage">{message.sender}</div>	
			<div className="messageContent">
				<MeStyleP>{message.text}</MeStyleP>
			</div>
		</div>
	)
}

export default MessageMe