
import { useEffect, useState } from "react";
import api from '../../script/axiosApi';
import DefaultPicture from '../../assets/profile.jpg'
import styled from "styled-components";

import { RxCheckCircled, RxCircleBackslash } from "react-icons/rx";

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
	const [request, setRequest] = useState(''); //user who invite
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

	const handleButtonClick = (user) => {
		let path = `http://` + process.env.REACT_APP_BASE_URL + `/profile/${user.username}`; 
		// history(path, { replace: true });
		// window.location.replace(path);
		window.history.pushState({}, null, path);
		window.location.reload(false);
	};

	const Accept = async (request) => {
		try{
			await api.post("/friend", {username: request.username})
			setClickEvent(true);
		} catch(err) {
			console.log(err);
		}
		console.log("accept")
		console.log(`request = ${request}`)
	}

	const Refuse = async (request) => {
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
		<div className="infoSideBar">
			<span onClick={() => handleButtonClick(currentUser)}>{currentUser.nickname}</span>
			 <RxCheckCircled onClick={() => Accept(request)} color={'green'}/>
			 <RxCircleBackslash onClick={() => Refuse(request)} color={'red'}/>

		</div>
		</UserChat>
	)
}
	