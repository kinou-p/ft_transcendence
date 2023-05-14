import {motion} from "framer-motion"
import Backdrop from "./Backdrop"
import { SidebarData } from "./SidebarData"
import {Link} from 'react-router-dom';
import * as AiIcons from 'react-icons/ai';


import "../../styles/Header.css"

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
const Modal = ({ handleClose }) => {
	return (
		<Backdrop onClick={handleClose}>
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
			{SidebarData.map((item, index) => {
					return (
					<motion.div   whileHover={{scale: 1.1}}>
						<li key={index} className={item.cName}>
							<Link to={item.path}>
								{item.icon}
								<span>{item.title}</span>
							</Link>
						</li>
						</motion.div>
					)
				})}
					</div>
			</motion.div>
		</Backdrop>
	)
}

export default Modal