import api from '../../script/axiosApi.tsx';
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";


import Friend  from './Friend.tsx';
import FriendRequest  from './FriendRequest.tsx';

import {IoMdPeople} from 'react-icons/io'
import {User} from "../../../interfaces.tsx"

function Social (){

	const [friends, setFriends] = useState([]);
	const [invite, setInvite] = useState([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [user, setUser] = useState<User>();

	useEffect(()=> {
		const getFriend = async ()=>{
			try{
				const tmpFriends = await api.get("/friends")
				const tmpUser = await api.get("/profile")
				const tmpInv = await api.get("/inviteRequest")
				const pic = await api.post("/getPicture", {username: tmpUser.data.username})

				setInvite(tmpInv.data);
				setUser(tmpUser.data);
				setFriends(tmpFriends.data);
				console.log(`user= ${tmpUser.data.username}`);
				setIsLoading(false)

			}
			catch(err){
				console.log(err);
			}
		};
		getFriend();

	}, [])

    return (
        <div>
			<div className='navbarSocial'>
				<IoMdPeople className="catchat"/>
				<span>
					{isLoading || !user ? (
        				<h4>Loading...</h4>
      				) : (
        				<h2>Friends</h2>
      				)}
	  			</span>

			</div>

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
