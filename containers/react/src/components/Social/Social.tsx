import api from '../../script/axiosApi.tsx';
import React, { useState, useEffect} from "react";
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

				setInvite(tmpInv.data);
				setUser(tmpUser.data);
				setFriends(tmpFriends.data);
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

			{invite.map((c: User)=> (
				<FriendRequest currentUser={c} key={c.username}/>
			))}

			{friends.map((c: User)=> (
				<Friend currentUser={c} key={c.username}/>
			))}

		</div>
    )
}

export default Social
