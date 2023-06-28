import React, { useState, useEffect } from "react";
import Rank from './Rank.tsx'
import api from '../../script/axiosApi.tsx';
import {User} from "../../../interfaces.tsx"

function Ranking(){

	const [isLoading, setIsLoading] = useState(true);
	const [ranking, setRanking] = useState<User[]>([]);

	useEffect(()=> {

		const getRanking = async ()=>{
			try{
				const Ranking = await api.get("/ranking")
				setRanking(Ranking.data);
				setIsLoading(false);
			}
			catch(err){
				console.log(err);
			}
		};
		getRanking();
	}, []);

	return (
		<div>
			{isLoading ? (
        		<></>
      		) : (
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