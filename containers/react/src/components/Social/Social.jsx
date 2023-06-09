import DefaultPicture from '../../assets/profile.jpg'
import api from '../../script/axiosApi';
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";


import Friend  from './Friend.jsx';

import { ImBlocked } from 'react-icons/im';
import { MdOutlineGroupAdd } from 'react-icons/md';

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
	const [isLoading, setIsLoading] = useState(true);
	const [user, setUser] = useState(null);
	const [profilePicture, setProfilePicture] = useState('');

	useEffect(()=> {

		const getFriend = async ()=>{
			try{
				const tmpFriends = await api.get("/friends")
				const tmpUser = await api.get("/profile")
				const pic = await api.post("/getPicture", {username: tmpUser.data.username})
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
				{profilePicture ? (
					<img className="pic" src={`data:image/jpeg;base64,${profilePicture}`} />
 				) : (
 					<img className="pic" src={DefaultPicture} alt="Default Profile Picture" />
 				)}
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
				<Friend currentUser={c}/>
			// <UserChat>
			// 	{profilePicture ? (
			// 		<img className="pic-user" src={`data:image/jpeg;base64,${profilePicture}`} />
 			// 	) : (
 			// 		<img className="pic-user" src={DefaultPicture} alt="Default Profile Picture" />
 			// 	)}
			// 	<div className="infoSideBar">
			// 		<span onClick={() => handleButtonClick(c)}>{c.nickname}</span>
			// 		 <RxCircle icon={RxCircle} color={getStatus(c)} />
			// 		 <button onClick={() => handleSpectate(c)} >Invite</button>
			// 		 {getStatus(c) !== 'blue' ? (
			// 			<></>
      		// 		) : (
        	// 			<button onClick={() => handleSpectate(c)} >Spectate</button>
      		// 		)}
			// 	</div>
			// </UserChat>

			// </div>
			
			))}
		</div>
    )
}

export default Social