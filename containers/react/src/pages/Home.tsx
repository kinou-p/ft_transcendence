/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Home.tsx                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: apommier <apommier@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/06/09 08:19:04 by apommier          #+#    #+#             */
/*   Updated: 2023/06/28 17:47:35 by apommier         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import '../styles/Profile.css'
import RedAlert from "../components/Alert/RedAlert.tsx";
import DefaultPicture from "../assets/profile.jpg";
import WinLoss from "../components/Profile/Win_Loss.tsx";
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from "react-router-dom";
import ModalEdit from "../components/Profile/EditName.tsx";
import {AiOutlineCloseCircle, AiOutlineHistory} from 'react-icons/ai'
import { MdQrCodeScanner, MdOutlinePhotoLibrary } from 'react-icons/md';
import { GiWingedSword, GiCrownedSkull } from 'react-icons/gi';
import api from '../script/axiosApi.tsx';
import { CgEditMarkup } from 'react-icons/cg'
import { IoCloseCircleOutline } from "react-icons/io5";
import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import {User} from "../../interfaces.tsx"
import YellowAlert from '../components/Alert/YellowAlert.tsx';

function Profile () {
	const [user, setUser] = useState<User>();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [mine, setMine] = useState<boolean>(false);
	const [error, setError] = useState<boolean>(false);
	const close = () => setModalOpen(false);
	const closeError = () => setError(false);
	const open = () => setModalOpen(true);
	const { username } = useParams();
	const [profilePicture, setProfilePicture] = useState('');
	const handleFileChange = async (event: { target: { files: any; }; }) => {
		  const photo = (event.target.files[0]);
		  if (photo) {
			  const formData = new FormData();
			  formData.append('photo', photo);
			  try {
				await api.post('/picture', formData);
				window.location.reload();
			  } catch (error) {
				setError(true);
				console.error('Error uploading file:', error);
			  }
			}
	  };

	useEffect(()=> {
		const getUser = async ()=>{
			let pic;
			try{
				const me = await api.get("/profile")
				if (!username)
				{
					setMine(true);
					setUser(me.data);
					pic = await api.post("/getPicture", {username: me.data.username}) //good one?
				}
				else
				{
					const tmpUser = await api.post("/user", {username: username})
					setUser(tmpUser.data);
					pic = await api.post("/getPicture", {username: username}) //good one?

				}
				setProfilePicture(pic.data);
				setIsLoading(false)
			}
			catch(err){
				console.log(err);
			}
		};
		getUser();
	}, [])

	return (
		<div className="profile">
			{profilePicture ? (
				<img className="profile-pic" src={`data:image/jpeg;base64,${profilePicture}`} />
 			) : (
 				<img className="profile-pic" src={DefaultPicture} alt="Default Profile Picture" />
 			)}
			<span>
					{isLoading || !user ? (
        				<h1>Loading...</h1>
      				) : (
        				<h1 className='user_name'>{user.nickname}</h1>
      				)}
	  		</span>
			  {mine ? (
			<div>
				<motion.div >
					<Link to="#" className="edit_name" onClick={() => (modalOpen ? close() : open())}>
						{modalOpen === true ?  <IoCloseCircleOutline/> : <CgEditMarkup/>}
					</Link>
					{modalOpen === true ? ("") : (
						<>
							<label htmlFor="file-input" className="edit_name"><MdOutlinePhotoLibrary/></label>
							<input type="file" id="file-input" className="file-input" accept="image/*" onChange={handleFileChange} />
							<AnimatePresence initial={false} onExitComplete={() => null}>
							{error ? (
								<RedAlert handleClose={closeError} text={'Error : upload failed'} />
							): ("")}
							</AnimatePresence>
						</>
					)}
				</motion.div>
			</div>
				  ) : (
						  <></>
				)}
			<AnimatePresence
			initial={false}
			onExitComplete={() => null}>
				{modalOpen && <ModalEdit/>}
			</AnimatePresence>
		</div>
	)
}

function Home () {
	const [move, setmove ] = useState(false);
	const [user, setUser] = useState<User>();
	const [successQr, setSuccessQr] = useState(false);
	const [successSword, setSuccessSword] = useState(false);
	const [successCrown, setSuccessCrown] = useState(false);
	const closeQr = () => setSuccessQr(false);
	const closeSword = () => setSuccessSword(false);
	const closeCrown = () => setSuccessCrown(false);

	const { username } = useParams();

	useEffect(() => {
		const fetchSuccess = async () => {
			try {
				if (!username)
				{
					const tmpUser = await api.get("/profile");
					setUser(tmpUser.data);
				}
				else
				{
					const tmpUser = await api.post("/user", {username: username});
					setUser(tmpUser.data);
				}
			}
			catch (error)
			{
				console.log(error);
			}
		};
		fetchSuccess();
	}, []);

    return (
		<motion.div className="page"
		initial={{opacity: -1}}
		animate={{opacity: 1}}
		exit={{opacity: -1}}>
			<div>
				{user && user.otp_verified ? (
					<MdQrCodeScanner className='success' onClick={() => setSuccessQr(true)}/>
					 ):("")}
				{user && user.win >= 2 ? (
					<GiWingedSword className="success" onClick={() => setSuccessSword(true)}/>
					 ):("")}
				{user && user.win >= 5 ? (
					<GiCrownedSkull className="success" onClick={() => setSuccessCrown(true)}/>
					 ):("")}
			</div>
		<div className="home">
			<motion.div
				animate={{x: move ? '-50%' : '25%'}}
				transition={{type: "tween", duration: 0.5}}>
					<Profile/>
			</motion.div>
			<motion.div animate={{opacity: !move ? -1 : 1}}>
				<WinLoss/>
			</motion.div>
			</div>
			<motion.div
				className="div_history"
				onClick={ () => setmove(!move)}>
					<Link to="#" className="history"> {move ? (<AiOutlineCloseCircle/>):(<AiOutlineHistory/>)}  Match History</Link>
			</motion.div>
			<AnimatePresence initial={false} onExitComplete={() => null}>
          		{successQr ? (
			  	<YellowAlert handleClose={closeQr} text={"Success: You have the 2fa success!"} icon={1} />
			  	) : ("")}

				{successCrown ? (
			  	<YellowAlert handleClose={closeCrown} text={"Success: 5 victory ? You won king slayer success!"} icon={2}/>
			  	) : ("")}

				{successSword ? (
			  	<YellowAlert handleClose={closeSword} text={"Success: 2 victory ? You won the noobi warrior success!"} icon={3}/>
			  	) : ("")}
        </AnimatePresence>
		</motion.div>
    )
}

export default Home
