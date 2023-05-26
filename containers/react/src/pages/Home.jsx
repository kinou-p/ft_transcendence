import React from "react";
import '../styles/Profile.css'
import '../styles/App.css'
import DefaultPicture from "../assets/profile.jpg";
// import WinLoss from "../components/Win_Loss";
import { motion } from 'framer-motion'
// import {AiOutlineHistory} from 'react-icons/ai'
import { Link } from "react-router-dom";
import UserProfile from "../DataBase/DataProfileUser";



function Home () {
	let name = UserProfile.UserName
    return (
		<motion.div className="App"
		initial={{opacity: 0}}
		animate={{opacity: 1}}
		exit={{opacity: 0}}>
			<div className="profile">
				<img className="profile-pic" src={DefaultPicture} alt="Profile pic" />
				<h1>Dipper Ratman</h1>

				<div>
					<div className="history">
						<Link to='#' className=" history">Match history</Link>
					</div>
				</div>
			</div>
		</motion.div>
    )
}

export default Home