import React,  {useState} from 'react';
import {AiOutlineMenuUnfold} from 'react-icons/ai';
// import * as AiIcons from 'react-icons/ai';
import {Link} from 'react-router-dom';
// import { SidebarData } from './Sidebar/SidebarData';
import DefaultPicture from '../assets/profile.jpg'
import { motion, AnimatePresence } from 'framer-motion'
import Modal from './Sidebar/Modal';
// import {BiLogOutCircle} from 'react-icons/bi';
// import AnimatePresence from 
import '../styles/Header.css';



function Header() {
	// const [sidebar, setSidebar] = useState(false);
	// const showSidebar = () => setSidebar(!sidebar);
	const [modalOpen, setModalOpen] = useState(false);
	const close = () => setModalOpen(false);
	const open = () => setModalOpen(true);

  return (
	<div className='Header'>
		{/* <div className='Header'>
		<Link to="#" className='menu-bars'>
		<motion.div>

			onClick={() => (modalOpen ? close() : open())}>
				<AiOutlineMenuUnfold/>
		</motion.div>
		</Link>
		<div className='end'>
			<Link to="/" className='menu-bars'>
				<img className='Header-pic' src={DefaultPicture} alt='profile'/>
			</Link>
			</div> */}
			{/* <Link to="#" className='menu-bars'>
				<AiOutlineMenuUnfold onClick={showSidebar}/>
			</Link>
			<div className='end'>
			<Link to="/" className='menu-bars'>
				<img className='Header-pic' src={DefaultPicture} alt='profile'/>
			</Link>
			</div> */}
		{/* </div> */}

		{/* <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
			<ul  className='nav-menu-items' onClick={showSidebar}>
				<li className='Header-toggle'>
					<Link to="#" className='menu-bars'>
						<AiIcons.AiOutlineClose />
					</Link>
				</li>
				{SidebarData.map((item, index) => {
					return (
						<motion.div
							whileHover={{scale: 1.1}}>
						<li key={index} className={item.cName}>
							<Link to={item.path}>
								{item.icon}
								<span>{item.title}</span>
							</Link>
						</li>
					</motion.div>
					)
				})}
			</ul>
		</nav> */}

		<motion.div
				onClick={() => (modalOpen ? close() : open())}>
				<Link to="#" className='menu-bars'>
					<AiOutlineMenuUnfold/>
				</Link>
		</motion.div>
		<div className='end'>
			<Link to="/" className='menu-bars'>
				<img className='Header-pic' src={DefaultPicture} alt='profile'/>
			</Link>
			</div>
			<AnimatePresence
			initial={false}
			onExitComplete={() => null}>
				{modalOpen && <Modal modalOpen={modalOpen} handleClose={close}/>}
			</AnimatePresence>
	</div>
  );
}

export default Header