import '../../styles/Win_Loss.css'
import { User, Matchlog } from "../../../interfaces.tsx"  
import React, { useState, useEffect, useRef } from "react";
import { useParams } from 'react-router-dom';
import api from '../../script/axiosApi.tsx';

function WinLoss() {
	
	const [user, setUser] = useState<User>();
	const [history, setHistory] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	
	const { username } = useParams();

	useEffect(()=> {
		const getUser = async ()=>{
			try{
				let tmpUser;
				let tmpHistory;

				if (username)
				{
					tmpUser = await api.post("/user", {username: username});
					tmpHistory = await api.post("/history", {username: username})
				}
				else
				{
					tmpUser = await api.get("/profile");
					tmpHistory = await api.post("/history", {username: tmpUser.data.username})
				}
				setHistory(tmpHistory.data);
				setUser(tmpUser.data);
				setIsLoading(false)
			}
			catch(err){
				console.log(err);
			}
		};
		getUser();
	}, [])

    return (
        <div className='tab'>
		{isLoading || !history || !user ? (
			<h1>Loading...</h1>
		  ) : (
			  <div className='scroll'>
				 <h2 className='title'>Match history {user.win}/{user.loss}</h2>
                {history.map((c: Matchlog, index) => {
                    return (
                        <div key={index} className='elements'>
                        <li key={index}>
                                <div className='content2nd'>
                                    <h4 className='me'>{user.username}</h4>  <h4 className='score'>{c.myScore} - {c.opScore} </h4>  <h4 className="opponent">{c.opponent}</h4>
                                </div>
                            </li>
                        </div>
                        )
                    })}
            </div>
		)}
        </div>
    )
}
 
export default WinLoss