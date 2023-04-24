import React,  {useState} from 'react';
import {AiOutlineMenuUnfold} from 'react-icons/ai';
import * as AiIcons from 'react-icons/ai';
import {Link} from 'react-router-dom';
import { SidebarData } from './SidebarData';
import DefaultPicture from '../assets/profile.jpg'
// import {BiLogOutCircle} from 'react-icons/bi';
import '../Style/Header.css';



function Header() {
	const [sidebar, setSidebar] = useState(false);
	const showSidebar = () => setSidebar(!sidebar);
  return (
	<>
		<div className='Header'>
			<Link to="#" className='menu-bars'>
				<AiOutlineMenuUnfold onClick={showSidebar}/>
			</Link>
			<div className='end'>
			<Link to="/" className='menu-bars'>
				<img className='Header-pic' src={DefaultPicture} alt='profile'/>
			</Link>
			</div>
		</div>
		<nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
			<ul  className='nav-menu-items' onClick={showSidebar}>
				<li className='Header-toggle'>
					<Link to="#" className='menu-bars'>
						<AiIcons.AiOutlineClose />
					</Link>
				</li>
				{SidebarData.map((item, index) => {
					return (
						<li key={index} className={item.cName}>
							<Link to={item.path}>
								{item.icon}
								<span>{item.title}</span>
							</Link>
						</li>
					)
				})}
			</ul>
		</nav>
	</>
  );
}

export default Header