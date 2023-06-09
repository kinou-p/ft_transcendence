// import React from "react"
import React, { useState, useEffect, useRef } from "react";
import Rank from './Rank.jsx'
import defaultpic from '../../assets/profile.jpg'
import api from '../../script/axiosApi';

function Ranking(){

	const [isLoading, setIsLoading] = useState(true);
	const [ranking, setRanking] = useState([]);

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
				setIsLoading(false)

			}
			catch(err){
				console.log(err);
			}
		};
		getRanking();

	}, [])

	console.log(`ranking after= ${ranking}`)

	return (
		<div>
			{isLoading ? (
        		<></>
      		) : (
				//   <h1 className='title'>Ranking</h1>
            <div className='scroll'>
                {ranking.map((user, index) => (
					<Rank user={user} index={index}/>
					// return (
						// <div className='rank_elements'>
                        //         <div>
						// 			<p>{index + 1}</p>
                        //             <h4>{user.rank}: {user.nickname} <img className="profilePic" src={defaultpic}/></h4>
                        //         </div>
                        //         <h4 className='content'>{user.opponent}</h4>
                        // </div>
                        // )
                    ))}
            </div>
			)}
		</div>
	)
}

export default Ranking