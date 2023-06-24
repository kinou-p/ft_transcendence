// import React from "react"
import React, { useState, useEffect, useRef } from "react";
import Rank from './Rank.tsx'
import defaultpic from '../../assets/profile.jpg'
import api from '../../script/axiosApi.tsx';
import {User} from "../../../interfaces.tsx"

function Ranking(){

	const [isLoading, setIsLoading] = useState(true);
	const [ranking, setRanking] = useState<User[]>([]);

	useEffect(()=> {

		const getRanking = async ()=>{
			try{
				// const tmpFriends = await api.get("/friends")
				const Ranking = await api.get("/ranking")
				setRanking(Ranking.data);
				console.log(`ranking= ${Ranking.data}`)
				// setFriends(tmpFriends.data);
				// return tmpUser;
				// console.log(`user= ${tmpUser.data.username}`);
				setIsLoading(false);
			}
			catch(err){
				console.log(err);
			}
		};
		getRanking();
	}, []);
	console.log(`ranking after= ${ranking}`);

	return (
		<div>
			{isLoading ? (
        		<></>
      		) : (
				//   <h1 className='title'>Ranking</h1>
            <div className='scroll'>
                {ranking.map((user, index) => (
					<Rank user={user} index={index} key={user.username}/>
                    ))}
            </div>
			)}
		</div>
	)
}

export default Ranking