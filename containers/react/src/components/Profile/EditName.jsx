import {motion} from "framer-motion"
// import Backdrop from "../Sidebar/Backdrop"
import {Link} from 'react-router-dom';
import { UserProfile } from "../../DataBase/DataUserProfile";
import {useState} from 'react';
import "../../styles/Profile.css"

const dropIn = {
	hidden: {
		opacity: '0',
	},
	visible: {
		opacity: "1",
	},
	exit: {
		opacity: "0",
	},
}

// const changeName = ({handleClose, name}) => {
// 	return (
// 		UserProfile.UserName = name
// 	)
// }

const ModalEdit = ({ handleClose }) => {
	// let new_name = "";
	const [username, setUserName] = useState("");
	const handler = e =>
	{
		setUserName (e.target.value);
	}
	void(handleClose);
	return (
		// <Backdrop onClick={handleClose}>
			<motion.div 
						className="modal"
						variants={dropIn}
						initial="hidden"
						animate="visible"
						exit="exit">
				<h2>Type your new name</h2>
				<input className="text" type="text" value={username} onChange={handler} handleClose/>
				<div onClick={handleClose}>
					<div onClick={() => {UserProfile.UserName = username;}}>
						<Link className="button">change</Link>
					</div>
				</div>
			</motion.div>
		// </Backdrop>
		
	)
}

export default ModalEdit