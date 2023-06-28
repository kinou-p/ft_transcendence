/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   PartyInvite.tsx                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: apommier <apommier@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/06/19 16:44:29 by apommier          #+#    #+#             */
/*   Updated: 2023/06/20 23:53:01 by apommier         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


import { useEffect, useState } from "react";
import api from '../../script/axiosApi.tsx';
import DefaultPicture from '../../assets/profile.jpg'
import styled from "styled-components";

import {User} from "../../../interfaces.tsx"
import { RxCheckCircled, RxCircleBackslash } from "react-icons/rx";
import React from "react";

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

const SideP = styled.p`
	font-size: 14px;
	color: lightgray;
	margin-left: 15px;
`

interface InviteProps {
	username: string,
	gameId: string
  }

interface UserProps {
	currentInvite: {username: string, gameId: string}
  }

export default function  PartyInvite({currentInvite}: UserProps)
{
	const [profilePicture, setProfilePicture] = useState('');
	const [request, setRequest] = useState<User>(); //user who invite
	const [clickEvent, setClickEvent] = useState(false);
	
	useEffect(() => {
		const fetchProfilePicture = async () => {
			try {
				const pic = await api.post("/getPicture", {username: currentInvite.username})
				const tmpRequest = await api.post("/user", {username: currentInvite.username})
				setRequest(tmpRequest.data);
				setProfilePicture(pic.data);
			} catch (error) {
				console.error('Error fetching profile picture:', error);
			}
		  };
		
		  fetchProfilePicture();
	}, [clickEvent])

	const handleButtonClick = (user: InviteProps) => {
		let path = `http://` + process.env.REACT_APP_BASE_URL + `/profile/${user.username}`; 
		window.history.pushState({}, '', path);
		window.location.reload();
	};
	
	const Accept = async (request: User) => {
		try{
			await api.post("/deleteInvite", {username: request.username})
			let path = `http://` + process.env.REACT_APP_BASE_URL + `/pong/play?` 
			path += 'username=' + request.username;
			path += '&gameId=' + currentInvite.gameId;
			window.history.pushState({}, '', path);
			window.location.reload();
		} catch(err) {
			console.log(err);
		}
	}

	const Refuse = async (request: User) => {
		try{
			await api.post("/deleteInvite", {username: request.username})
			setClickEvent(true);
		} catch(err) {
			console.log(err);
		}
	}

  	if (clickEvent) {
    	return null; // Rendre null pour ne pas afficher le contenu
  	}

	return (
		<UserChat>
		{profilePicture ? (
			<img className="pic-user" src={`data:image/jpeg;base64,${profilePicture}`} />
		 ) : (
			 <img className="pic-user" src={DefaultPicture} alt="Default Profile Picture" />
		 )}
		{request ? (
		<div className="infoSideBar">
			<span onClick={() => handleButtonClick(currentInvite)}>{request.nickname}</span>
			 <RxCheckCircled onClick={() => Accept(request)} color={'green'}/>
			 <RxCircleBackslash onClick={() => Refuse(request)} color={'red'}/>
		</div>
			) : ( "" )}
		</UserChat>
	)
}