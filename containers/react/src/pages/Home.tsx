/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Home.tsx                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sadjigui <sadjigui@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/06/09 08:19:04 by apommier          #+#    #+#             */
/*   Updated: 2023/06/24 14:31:22 by sadjigui         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// import { React, useState } from "react";
import '../styles/Profile.css'
// import '../styles/App.css'
import DefaultPicture from "../assets/profile.jpg";
import WinLoss from "../components/Profile/Win_Loss.tsx";
import { motion, AnimatePresence } from 'framer-motion'
// import { AiFillEdit } from 'react-icons/ai'
// import { GrClose } from 'react-icons/gr'
import { Link } from "react-router-dom";
import ModalEdit from "../components/Profile/EditName.tsx";
import {AiOutlineCloseCircle, AiOutlineHistory} from 'react-icons/ai'
import { MdQrCodeScanner, MdOutlinePhotoLibrary } from 'react-icons/md';
import { GiWingedSword, GiCrownedSkull } from 'react-icons/gi';

// import { Link } from "react-router-dom";
// import {UserProfile} from "../DataBase/DataUserProfile";
// import axios from "axios";
import api from '../script/axiosApi.tsx';
import { CgEditMarkup } from 'react-icons/cg'
import { IoCloseCircleOutline } from "react-icons/io5";

// import * as React from 'react';
// import { useState, useEffect, useParams} from "react";
import React, { useState, useEffect, useRef, ChangeEventHandler } from "react";
import { useParams } from 'react-router-dom';
import {User, Conv} from "../../interfaces.tsx"
import YellowAlert from '../components/Alert/YellowAlert.tsx';
	// axios.get("http://localhost/api")
	// .then((response) => {
	// 	response = response.json()
	// 	response.then((result) => {
	// 		console.log(result)
	// 		console.log("ceci est un test")
	// 	})
	// })


function Profile () {
	const [user, setUser] = useState<User>();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [mine, setMine] = useState<boolean>(false);
	const close = () => setModalOpen(false);
	const open = () => setModalOpen(true);

	const { username } = useParams();

	// const [selectedPhoto, setSelectedPhoto] = useState();
	// const [selectedPhoto, setSelectedPhoto] = useState(null);

	const [profilePicture, setProfilePicture] = useState('');

	// const handleFileChange = (event: { target: { files: React.SetStateAction<null>[]; }; }) => {
	// //   const file = event.target.files[0];
	//   setSelectedPhoto(event.target.files[0]);
	// //   try{
	// // 	api.post("/picture", {picture: URL.createObjectURL(file)})
	// // 	}
	// //   catch(err){
	// // 	console.log(err);
	// //     }
	// };

	// const handleFileChange = (event: { target: { files: React.SetStateAction<null>[] | FileList; }; }) => {
		// const files = event.target.files;
	// 	if (event.target.files && event.target.files.length > 0) {
	// 		setSelectedPhoto(event.target.files[0]);
	// 	}
	//   };

	const handleFileChange = async (event: { target: { files: any; }; }) => {
		// const files = event.target.files;
		// if (files && files.length > 0) {
		  const photo = (event.target.files[0]);
		  console.log("file selected")
		  if (photo) {
			console.log("selected photo")
			  const formData = new FormData();
			  formData.append('photo', photo);
			  try {
				await api.post('/picture', formData);
				console.log('File uploaded successfully');
				window.location.reload();
			  } catch (error) {
				console.error('Error uploading file:', error);
			  }
			} 
		// }
	  };

	// const handleUpload = async () => {
	// 	const formData = new FormData();
	// 	formData.append('photo', selectedPhoto);
	// 	try {
	// 	  await api.post('/picture', formData);
	// 	  console.log('File uploaded successfully');
	// 	  window.location.reload();
	// 	} catch (error) {
	// 	  console.error('Error uploading file:', error);
	// 	}
	//   };

	// const handleUpload = async (event: React.FormEvent) => {
	// 	event.preventDefault()
	// 	console.log("up photo")
	// 	if (selectedPhoto) {
	// 	console.log("selected photo")
	// 	  const formData = new FormData();
	// 	  formData.append('photo', selectedPhoto);
	// 	  try {
	// 		await api.post('/picture', formData);
	// 		console.log('File uploaded successfully');
	// 		window.location.reload();
	// 	  } catch (error) {
	// 		console.error('Error uploading file:', error);
	// 	  }
	// 	} else {
	// 	  console.log('No file selected');
	// 	}
	//   };

	useEffect(()=> {
		const getUser = async ()=>{
			console.log(`username= ${username}`)
			// const pic
			let pic
			try{
				const me = await api.get("/profile")
				if (!username)
				{
					setMine(true);
					setUser(me.data);
					console.log(`mine= true = ${mine}`)
					pic = await api.post("/getPicture", {username: me.data.username}) //good one?
					// username = me.data.username
				}
				else
				{
					const tmpUser = await api.post("/user", {username: username})
					setUser(tmpUser.data);
					pic = await api.post("/getPicture", {username: username}) //good one?

				}
				// const pic = await api.get("/picture")//pic du user
				setProfilePicture(pic.data);
				// console.log(`user= ${tmpUser.data.username}`)
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
			{/* <img className="profile-pic" src={DefaultPicture} alt="Profile pic" />
			 */}
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
						</>
					)}
				</motion.div>
			
				{/* <div className="file-upload-container"> */}
  					{/* <button onClick={handleUpload} className="upload-button">Upload</button> */}
					  {/* <button onClick={handleUpload} className="upload-button">Upload</button> */}
				{/* </div> */}
			</div>
				  ) : (
						  <></>
				)}



			<AnimatePresence
			initial={false}
			onExitComplete={() => null}>
				{modalOpen && <ModalEdit modalOpen={modalOpen} handleclose={close}/>}
			</AnimatePresence>
		</div>
	)
}

function Home () {
	const [move, setmove ] = useState(false);
	const [user, setUser] = useState([]);

	const [successQr, setSuccessQr] = useState(false);
	const [successSword, setSuccessSword] = useState(false);
	const [successCrown, setSuccessCrown] = useState(false);
	const closeQr = () => setSuccessQr(false);
	const closeSword = () => setSuccessSword(false);
	const closeCrown = () => setSuccessCrown(false);


	useEffect(() => {
		const fetchSuccess = async () => {
			try {
				const tmpUser = await api.get("/profile");
				setUser(tmpUser.data);
			}
			catch (error)
			{
				console.log(error);
			}
		};
		fetchSuccess();
	},[])

    return (
		<motion.div className="page"
		initial={{opacity: -1}}
		animate={{opacity: 1}}
		exit={{opacity: -1}}>
			<div>
				{user.otp_verified ? (
					<MdQrCodeScanner className='success' onClick={() => setSuccessQr(true)}/>
					 ):("")} 
				{user.win >= 2 ? (
					<GiWingedSword className="success" onClick={() => setSuccessSword(true)}/>
					 ):("")} 

				{user.win >= 5 ? (
					<GiCrownedSkull className="success" onClick={() => setSuccessCrown(true)}/>
					 ):("")} 
			</div>
		<div className="home">
			<motion.div animate={{x: move ? -200: 120}}
				transition={{type: "tween", duration: 0.5}}>
					<Profile/>
			</motion.div>
			<motion.div animate={{opacity: !move ? -1 : 1}}>
				<WinLoss/>
			</motion.div>
			</div>
			<motion.div
				className="div_history"
			// className="history"
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