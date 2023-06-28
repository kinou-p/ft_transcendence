
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

interface UserProps {
	currentUser: User
  }

export default function  Friend({currentUser}: UserProps)
{
	const [profilePicture, setProfilePicture] = useState('');
	const [request, setRequest] = useState<User>();
	const [clickEvent, setClickEvent] = useState(false);

	useEffect(() => {
		const fetchProfilePicture = async () => {
			try {
				const pic = await api.post("/getPicture", {username: currentUser.username})
				const tmpRequest = await api.post("/user", {username: currentUser.username})
				setRequest(tmpRequest.data);
				setProfilePicture(pic.data);
			} catch (error) {
				console.error('Error fetching profile picture:', error);
			}
		  };

		  fetchProfilePicture();
	}, [clickEvent])

	const handleButtonClick = (user: User) => {
		let path = `http://` + process.env.REACT_APP_BASE_URL + `/profile/${user.username}`;
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
		window.location.reload();
	}

	const Refuse = async (request: User) => {
		try{
			await api.post("/refuseInvite", {username: request.username})
			setClickEvent(true);
		} catch(err) {
			console.log(err);
		}
		window.location.reload();
	}

  	if (clickEvent) {
    	return (<></>);
  	}

	return (
		<UserChat className="centermargin">
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
