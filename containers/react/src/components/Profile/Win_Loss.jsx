// import PropTypes from "prop-types"
// import styled from 'styled-components';
// import '../DataBase/DummyDBWinLoss.js'
// import '../DataBase/DataProfileUser.js'
// import { DBWinLoss } from '../../DataBase/DummyDBWinLoss.js';
import '../../styles/Win_Loss.css'
// import { UserProfile } from '../../DataBase/DataUserProfile';
// import color from '../../utils/style/color.js';



// const CardWrapper = styled.div`
//         display: flex;
//         flex-direction: column;
//         padding: 15px;
//         background-color: black;
//         border-radius: 30px;
//         width: 350px;
//         transition: 200ms;
// 		margin-top: 50px;
//         &:hover {
//             cursor: pointer;
//             box-shadow: 2px 2px 10px #b6b6b6;
//         }
// `

// const CardLabel1 = styled.h1`
//     color: #5843e4;
//     // font-size: 22px;
//     font-weight: bold;
// 	margin-bottom: 25px;
// `
// const CardLabel2 = styled.span`
// 	color: #5843e4;
//     font-size: 22px;
//     font-weight: bold;
// 	display: flex;
// 	flex-direction: column;
// `

// const CardImage = styled.img`
//     heigh: 80px;
//     width: 80px;
//     border-radius: 50%;
// `
  
import React, { useState, useEffect, useRef } from "react";
import { useParams } from 'react-router-dom';
import api from '../../script/axiosApi';


function WinLoss() {
	
	const [user, setUser] = useState(null);
	const [history, setHistory] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	
	const { username } = useParams();

	useEffect(()=> {
		const getUser = async ()=>{
			try{
				// const tmpUser = await api.get("/profile")
				const tmpUser = await api.post("/user", {username: username})
				const tmpHistory = await api.post("/history", {username: username})
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

	// console.log(`user= ${user.children}`)

    return (

// 		<div>
// 		{isLoading ? (
// 			<h1>Loading...</h1>
// 		  ) : (
// 			<h1>{user.username}</h1>
// 		  )}
//   	</div>


        <div className='tab'>
		{isLoading ? (
			<h1>Loading...</h1>
			// <span>Loading...</span>
		  ) : (
			  <div className='scroll'>
				 <h2 className='title'>Match history Win/Loss</h2>
                {history.map((c, index) => {
                    return (
                        <div key={index} className='elements'>
                        <li key={index}>
                                {/* <h4 className='content'>{c.id}</h4> */}
                                <div className='content2nd'>
                                    <h4 className='me'>{user.username}</h4>  <h4 className='score'>{c.myScore} - {c.opScore} </h4>  <h4 className="opponent">{c.opponent}</h4>
                                </div>
                                {/* <h4 className='content'>{c.openent}</h4> */}
                            </li>
                        </div>
                        )
                    })}
            </div>


			
		// 	<div>
		// 	<h1>User: {user.name}</h1>
		// 	<div>
		// 	  <h2>Children:</h2>
		// 	  {history.map((child) => (
		// 		<div key={child.id}>
		// 		  <p>Child ID: {child.id}</p>
		// 		  <p>Child Name: {child.name}</p>
		// 		  {/* Render other child properties as needed */}
		// 		</div>
		// 	  ))}
		// 	</div>
		//   </div>
		)}
        </div>
    )
}

// Card.propTypes = {
//     label: PropTypes.string,
//     title: PropTypes.string.isRequired,
//     picture: PropTypes.string,
// }
 
export default WinLoss