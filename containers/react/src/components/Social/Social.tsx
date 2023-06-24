import DefaultPicture from '../../assets/profile.jpg'
import api from '../../script/axiosApi.tsx';
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";


import Friend  from './Friend.tsx';
import FriendRequest  from './FriendRequest.tsx';

import {IoMdPeople} from 'react-icons/io'
import { ImBlocked } from 'react-icons/im';
import { MdOutlineGroupAdd } from 'react-icons/md';
import {User} from "../../../interfaces.tsx"

// import React from "react";

import { useNavigate } from "react-router-dom";




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
	const [invite, setInvite] = useState([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [user, setUser] = useState<User>();
	const [profilePicture, setProfilePicture] = useState('');

	useEffect(()=> {
		const getFriend = async ()=>{
			try{
				const tmpFriends = await api.get("/friends")
				const tmpUser = await api.get("/profile")
				const tmpInv = await api.get("/inviteRequest")
				const pic = await api.post("/getPicture", {username: tmpUser.data.username})

				setInvite(tmpInv.data);
				setProfilePicture(pic.data);
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





	// const { status } = this.props;
    // let statusColor = '';
	// // let statusIcon = RxCircle;
	// let status = 0

    // if (status === 0) {
    // //   statusIcon = faCircle;
    //   statusColor = 'green';
    // } else if (status === 1) {
    // //   statusIcon = faCircle;
    //   statusColor = 'red';
    // } else if (status === 2) {
    // //   statusIcon = faCircle;
    //   statusColor = 'blue';
    // }

    return (
        <div>
			<div className='navbar'>
				{/* <img src={DefaultPic} alt="profile" className="pic"/> */}
				<IoMdPeople className="catchat"/>
				<span>
					{isLoading || !user ? (
        				<h4>Loading...</h4>
      				) : (
        				<h2>Social</h2>
      				)}
	  			</span>

			</div>

{/* map with fiend request */}

			{invite.map(c=> (
				<FriendRequest currentUser={c}/>
			))}

			{friends.map(c=> (
				<Friend currentUser={c}/>
			))}

		</div>
    )
}

export default Social
