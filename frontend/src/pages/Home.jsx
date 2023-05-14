import { React, useState } from "react";
import '../styles/Profile.css'
import '../styles/App.css'
import DefaultPicture from "../assets/profile.jpg";
import WinLoss from "../components/Win_Loss";
import { motion } from 'framer-motion'
// import {AiOutlineHistory} from 'react-icons/ai'
// import { Link } from "react-router-dom";
// import UserProfile from "../DataBase/DataProfileUser";



function Profile () {
	return (
		<div className="profile">
		<img className="profile-pic" src={DefaultPicture} alt="Profile pic" />
		<h1>Dipper Ratman</h1>
		</div>
	)
}

function Home () {
	const [move, setmove ] = useState(false);
    return (
		<motion.div className="App"
		initial={{opacity: 0}}
		animate={{opacity: 1}}
		exit={{opacity: 0}}>
		<div className="home">
			<motion.div animate={{x: move ? -200: 150}}
				transition={{type: "tween", duration: 0.5}}>
					<Profile/>
			</motion.div>
			<motion.div animate={{opacity: !move ? 0 : 1}}>
				<WinLoss/>
			</motion.div>
			</div>
			<div>
				<button className="history"
				onClick={ () => setmove(!move)}>Match History</button>
			</div>
		</motion.div>
    )
}

export default Home