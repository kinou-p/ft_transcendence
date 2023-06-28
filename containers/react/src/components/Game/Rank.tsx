/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Rank.tsx                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: apommier <apommier@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/06/09 08:49:24 by apommier          #+#    #+#             */
/*   Updated: 2023/06/23 17:16:40 by apommier         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// import React from "react"
import React, { useState, useEffect, useRef } from "react";
// import {Rank} from '../../DataBase/DataRank.js'
import DefaultPicture from '../../assets/profile.jpg'
import api from '../../script/axiosApi.tsx';
import {Matchlog, User} from "../../../interfaces.tsx"
// import { Match } from "@testing-library/react";

interface RankProps {
	user: User
	index: number
}

function Rank({user, index}: RankProps){

	const [profilePicture, setProfilePicture] = useState('');
	
	useEffect(() => {
		const fetchProfilePicture = async () => {
			try {
				const pic = await api.post("/getPicture", {username: user.username})
				setProfilePicture(pic.data);
			} catch (error) {
				console.error('Error fetching profile picture:', error);
			}
		  };
		
		  fetchProfilePicture();
	}, [])
	
	return (
		<div className='rank_elements'>
			<div >
				<p>{(index + 1)}</p> 
				<h4>{user.rank}: {user.nickname} 
					{profilePicture ? (
						<img className="profilePic" src={`data:image/jpeg;base64,${profilePicture}`} />
					) : (
						<img className="profilePic" src={DefaultPicture} alt="Default Profile Picture" />
					)}
				</h4>
			</div>
		</div>
	)
}

export default Rank