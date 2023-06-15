/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Friend.jsx                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: apommier <apommier@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/06/09 08:18:58 by apommier          #+#    #+#             */
/*   Updated: 2023/06/15 19:03:01 by apommier         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useEffect, useState } from "react";
import api from '../../script/axiosApi';
import DefaultPicture from '../../assets/profile.jpg'
import styled from "styled-components";

import { RxCircle } from "react-icons/rx";
import { CgFontSpacing } from "react-icons/cg";

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

export default function  Friend({currentUser})
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
	})

	function getStatus(friend)
	{
		let status = friend.status
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

	const handleSpectate = (user) => {
		//socket connection and add to party with one with username
		console.log(`spectate hehe`)
		console.log(`user= ${user}`)
	};

	const handleButtonClick = (user) => {
		let path = `http://` process.env.REACT_APP_BASE_URL `/profile/${user.username}`; 
		// history(path, { replace: true });
		// window.location.replace(path);
		window.history.pushState({}, null, path);
		window.location.reload(false);
	};

	return (
		<UserChat>
		{profilePicture ? (
			<img className="pic-user" src={`data:image/jpeg;base64,${profilePicture}`} />
		 ) : (
			 <img className="pic-user" src={DefaultPicture} alt="Default Profile Picture" />
		 )}
		<div className="infoSideBar">
			<span onClick={() => handleButtonClick(currentUser)}>{currentUser.nickname}</span>
			 <RxCircle icon={RxCircle} color={getStatus(currentUser)} />
			 <button onClick={() => handleSpectate(currentUser)} >Invite</button>
			 {getStatus(currentUser) !== 'blue' ? (
				<></>
			  ) : (
				<button onClick={() => handleSpectate(currentUser)} >Spectate</button>
			  )}
		</div>
		</UserChat>
	)
}
	

