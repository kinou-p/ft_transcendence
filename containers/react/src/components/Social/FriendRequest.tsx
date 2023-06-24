
import { useEffect, useState } from "react";
import api from '../../script/axiosApi.tsx';
import DefaultPicture from '../../assets/profile.jpg'
import styled from "styled-components";

import { RxCheckCircled, RxCircleBackslash } from "react-icons/rx";
import React from "react";
import {User} from "../../../interfaces.tsx"

const UserChat = styled.div `
	padding: 5px;
	display: flex;
	align-items: center;
	gap: 5px;
	color: white;
	cursor: pointer;
	margin-top: 10px;
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

export default function  Friend({currentUser}: UserProps)
{
	const [profilePicture, setProfilePicture] = useState('');
	const [request, setRequest] = useState<User>(); //user who invite
	const [clickEvent, setClickEvent] = useState(false);
	// const [user, setUser] = useState(null);

	useEffect(() => {
		const fetchProfilePicture = async () => {
			try {
			//   const user = await api.get("/profile");\
				// const tmpUser = await api.get("/profile")
				const pic = await api.post("/getPicture", {username: currentUser.username})
				const tmpRequest = await api.post("/user", {username: currentUser.username})
				// setUser(tmpUser.data);
				setRequest(tmpRequest.data);
				// console.log(`user naem profile pic222= ${currentUser.username}`)
				// console.log(` profile pic222= ${pic.data}`)
				setProfilePicture(pic.data);
			} catch (error) {
				console.error('Error fetching profile picture:', error);
			}
		  };

		  fetchProfilePicture();
	}, [clickEvent])

	const handleButtonClick = (user: User) => {
		let path = `http://` + process.env.REACT_APP_BASE_URL + `/profile/${user.username}`;
		// history(path, { replace: true });
		// window.location.replace(path);
		window.history.pushState({}, '', path);
		window.location.reload();
	};

	const Accept = async (request: User) => {
		try{
			await api.post("/friend", {username: request.username})
			setClickEvent(true);
		} catch(err) {
			console.log(err);
		}
		console.log("accept")
		console.log(`request = ${request}`)
	}

	const Refuse = async (request: User) => {
		try{
			await api.post("/refuseInvite", {username: request.username})
			setClickEvent(true);
		} catch(err) {
			console.log(err);
		}
		console.log("refuse")
		console.log(`request = ${request}`)
	}

  // Vérifier si le contenu doit être caché
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
			<div className="end">
			<span onClick={() => handleButtonClick(currentUser)}>{currentUser.nickname}</span>
			<div className="end">
			 <RxCheckCircled className="friendRequest" onClick={() => Accept(request)} color={'green'}/>
			 <RxCircleBackslash className="friendRequest" onClick={() => Refuse(request)} color={'red'}/>
			 </div>
		</div>
			) : ( "" )}
		</UserChat>
	)
}
