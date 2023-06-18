import React,  {useState, useEffect} from 'react';
import {AiOutlineMenuUnfold} from 'react-icons/ai';
// import * as AiIcons from 'react-icons/ai';
import {Link} from 'react-router-dom';
// import { SidebarData } from './Sidebar/SidebarData';
import DefaultPicture from '../assets/profile.jpg'
import { motion, AnimatePresence } from 'framer-motion'
import Modal from './Sidebar/Modal.tsx';
// import {BiLogOutCircle} from 'react-icons/bi';
// import AnimatePresence from 
import '../styles/Header.css';

import api from '../script/axiosApi.tsx';

function Header() {
	// const [sidebar, setSidebar] = useState(false);
	// const showSidebar = () => setSidebar(!sidebar);
	const [modalOpen, setModalOpen] = useState(false);
	const close = () => setModalOpen(false);
	const open = () => setModalOpen(true);
	
	const [profilePicture, setProfilePicture] = useState('');

	useEffect(() => {
		const fetchProfilePicture = async () => {
		  try {
			const user = await api.get("/profile");
			const pic = await api.post("/getPicture", {username: user.data.username})
        	setProfilePicture(pic.data);
			// console.log(`profile pic222= ${pic.data}`)
		  } catch (error) {
			console.error('Error fetching profile picture:', error);
		  }
		};
	  
		fetchProfilePicture();
	  }, []);

	// console.log(`profile pic= ${profilePicture}`)

	// photo.toString('base64')

  return (
	<div className='Header'>
		<motion.div
				onClick={() => (modalOpen ? close() : open())}>
				<Link to="#" className='menu-bars'>
					<AiOutlineMenuUnfold/>
				</Link>
		</motion.div>
		<div className='end'>
			<Link to="/profile" className='menu-bars'>
			<div>
				
 				{profilePicture ? (
 				    // <img className='Header-pic' src={profilePicture} alt="Profile Picture" />
					 <img className='Header-pic' src={`data:image/jpeg;base64,${profilePicture}`} />
					// <img className='Header-pic' src={`data:image/jpeg;base64,${profilePicture.data}`} alt="Profile Picture" />
 				) : (
 				    <img className='Header-pic' src={DefaultPicture} alt="Default Profile Picture" />
 				)}
 			</div>

			</Link>
			</div>
			<AnimatePresence
			initial={false}
			onExitComplete={() => null}>
				{modalOpen && <Modal modalOpen={modalOpen} handleclose={close}/>}
			</AnimatePresence>
	</div>
  );
}

export default Header