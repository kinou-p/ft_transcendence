import DefaultPic from '../../assets/profile.jpg'
import api from '../../script/axiosApi';
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

import { ImBlocked } from 'react-icons/im';
import { MdOutlineGroupAdd } from 'react-icons/md';
// import React from "react";

import { useNavigate } from "react-router-dom";

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
const TouchDiv = styled.div`
	margin-left: 10px;
	margin-right: 4px;
	margin-bottom: 21px;
	margin-top: 21px;
	cursor: pointer;
	justify-content: space-around;
	
	&:hover {
		color: #F4F3EF;
	}
`

function Social (){

	const [friends, setFriends] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [user, setUser] = useState(null);

	useEffect(()=> {

		const getFriend = async ()=>{
			try{
				const tmpFriends = await api.get("/friends")
				const tmpUser = await api.get("/profile")
				setUser(tmpUser.data);
				setFriends(tmpFriends.data);
				// return tmpUser;
				console.log(`user= ${tmpUser.data.username}`);
				setIsLoading(false)

			}
			catch(err){
				console.log(err);
			}
		};
		getFriend();

	}, [])

	const handleButtonClick = (user) => {
		let path = `http://localhost/profile/${user.username}`; 
		// history(path, { replace: true });
		// window.location.replace(path);
		window.history.pushState({}, null, path);
		window.location.reload(false);
	};

    return (
        <div>
			<div className='navbar'>
				<img src={DefaultPic} alt="profile" className="pic"/>
				<span>
					{isLoading ? (
        				<h4>Loading...</h4>
      				) : (
        				<h4>{user.nickname}</h4>
      				)}
	  			</span>
				<div className="end">
					<TouchDiv>
						<MdOutlineGroupAdd/>
					</TouchDiv>
					<TouchDiv>
						<ImBlocked/>
					</TouchDiv>
				</div>
			</div>

			{friends.map(c=> (
			<div onClick={() => handleButtonClick(c)}>
			<UserChat>
				<img className="pic-user" src={DefaultPic} alt="User" />
				<div className="infoSideBar">
					<span>{c.nickname}</span>
					<SideP>Desc?</SideP>
				</div>
			</UserChat>
			</div>
			))}
		</div>
    )
}

export default Social