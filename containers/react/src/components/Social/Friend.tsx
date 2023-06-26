/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Friend.tsx                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: apommier <apommier@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/06/09 08:18:58 by apommier          #+#    #+#             */
/*   Updated: 2023/06/23 17:12:07 by apommier         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useEffect, useState } from "react";
import api from '../../script/axiosApi.tsx';
import DefaultPicture from '../../assets/profile.jpg'
import styled from "styled-components";

import { RxCircle } from "react-icons/rx";
import { CgFontSpacing } from "react-icons/cg";
import React from "react";
import {User} from "../../../interfaces.tsx"

const UserChat = styled.div `
	padding: 5px;
	display: flex;
	align-items: center;
	gap: 5px;
	color: white;
	cursor: pointer;
    margin-top: 15px;

	&:hover{
		background-color: #3e3c61;
	}
`

const SideP = styled.p`
	font-size: 14px;
	color: lightgray;
	margin-left: 15px;
`
interface UserProps {
	currentUser: User
  }

//   export default function  Friend({currentUser})
export default function  Friend({currentUser}: UserProps)
{
	const [profilePicture, setProfilePicture] = useState('');

	useEffect(() => {
		const fetchProfilePicture = async () => {
			try {
			//   const user = await api.get("/profile");
				const pic = await api.post("/getPicture", {username: currentUser.username})
				// console.log(`user naem profile pic222= ${currentUser.username}`)
				// console.log(` profile pic222= ${pic.data}`)
				setProfilePicture(pic.data);
			} catch (error) {
				console.error('Error fetching profile picture:', error);
			}
		  };
		  fetchProfilePicture();
	}, []);

	function getStatus(friend: User)
	{
		let status = friend.status		
		let session =friend.sessionNumber
		console.log(`session= ${session}`)
		console.log(`status= ${status}`)
		let statusColor;

		if (status === 0)
			statusColor = 'grey';
		else if (status === 1)
			statusColor = 'green';
		else if (status === 2)
			statusColor = 'blue';
		return statusColor;
	}

	const handleSpectate = (user: User) => {
		//socket connection and add to party with one with username
		console.log(`spectate hehe`)
		console.log(`user= ${user}`)
	};

	const handleButtonClick = (user: User) => {
		let path = `http://` + process.env.REACT_APP_BASE_URL + `/profile/${user.username}`;
		console.log("path= ", path)
		// history(path, { replace: true });
		// window.location.replace(path);
		window.history.pushState({}, '', path);
		window.location.reload();
	};

	return (
		<UserChat className="centermargin">
		{profilePicture ? (
			<img className="pic-user" src={`data:image/jpeg;base64,${profilePicture}`} />
		 ) : (
			 <img className="pic-user" src={DefaultPicture} alt="Default Profile Picture" />
		 )}
		<div className="end">
			<span onClick={() => handleButtonClick(currentUser)}>{currentUser.nickname}</span>
			<div className="end">
			 <RxCircle className="friendRequest" color={getStatus(currentUser)} />
			  </div>
		 </div>
		</UserChat>
	)
}
// spectate visible
// {getStatus(currentUser) !== 'blue' ? (
// 	<></>
// ) : (
// 	<button className="friendRequest" onClick={() => handleSpectate(currentUser)} >Spectate</button>
// )}
