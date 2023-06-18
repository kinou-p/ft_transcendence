/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Rank.jsx                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: apommier <apommier@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/06/09 08:49:24 by apommier          #+#    #+#             */
/*   Updated: 2023/06/09 08:55:22 by apommier         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// import React from "react"
import React, { useState, useEffect, useRef } from "react";
// import {Rank} from '../../DataBase/DataRank.js'
import DefaultPicture from '../../assets/profile.jpg'
import api from '../../script/axiosApi.tsx';

function Rank({user, index}){

	const [profilePicture, setProfilePicture] = useState('');
	
	useEffect(() => {
		const fetchProfilePicture = async () => {
			try {
			//   const user = await api.get("/profile");
				const pic = await api.post("/getPicture", {username: user.username})
				// console.log(`user naem profile pic222= ${currentUser.username}`)
				// console.log(` profile pic222= ${pic.data}`)
				setProfilePicture(pic.data);
			} catch (error) {
				console.error('Error fetching profile picture:', error);
			}
		  };
		
		  fetchProfilePicture();
	})
	
	return (
		<div className='rank_elements'>
			<div>
				<p>{index + 1}</p>
				<h4>{user.rank}: {user.nickname} 
					{profilePicture ? (
						<img className="profilePic" src={`data:image/jpeg;base64,${profilePicture}`} />
					) : (
						<img className="profilePic" src={DefaultPicture} alt="Default Profile Picture" />
					)}
					{/* <img className="profilePic" src={defaultpic}/> */}
				</h4>
			</div>
			<h4 className='content'>{user.opponent}</h4>
		</div>
	)
}

export default Rank