import {motion} from "framer-motion"
import Backdrop from "./Backdrop.tsx"
import { SidebarData } from "./SidebarData.tsx"
import {Link} from 'react-router-dom';
import * as AiIcons from 'react-icons/ai';


import "../../styles/Header.css"
import React from "react";

const dropIn = {
	hidden: {
		x: "-100vh",
	},
	visible: {
		x: "0",
	},
	exit: {
		x: "-100vh",
	},
}


// function showBar (){
// 	return (
// 		 {SidebarData.map((item, index) => {	
// 					 return (	
// 					<motion.div
// 					className="nav-menu"
// 					// whileHover={{scale: 1.1}}
// 					>
// 				 <li key={index} className={item.cName}>	
// 					 <Link to={item.path}>	
// 						 {item.icon}	
// 						 <span>{item.title}</span>	
// 					 </Link>	
// 				 </li>	
// 			</motion.div>
// 			 )
// 		 })}	
// 	)
// }
interface CloseProps {
	handleclose: Function;
  }

const Modal = ({ handleclose }: CloseProps) => {
	return (
		<Backdrop onClick={handleclose}>
			<motion.div 
						className="nav-menu"
						variants={dropIn}
						initial="hidden"
						animate="visible"
						exit="exit">
							<li className='Header-toggle'>
					<Link to="#" className='menu-bars'>
						<AiIcons.AiOutlineClose />
					</Link>
				</li>
				<div
					className="nav-menu">
			<ul  className='nav-menu-items'>
			{SidebarData.map((item, index) => {
					return (
					<motion.div key={index}  whileHover={{scale: 1.1}}>
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

					</div>
			</motion.div>
		</Backdrop>
	)
}

export default Modal