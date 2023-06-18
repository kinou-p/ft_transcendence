/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Home.jsx                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: apommier <apommier@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/06/09 08:19:04 by apommier          #+#    #+#             */
/*   Updated: 2023/06/09 08:19:05 by apommier         ###   ########.fr       */
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
import {AiOutlineHistory} from 'react-icons/ai'
// import { Link } from "react-router-dom";
// import {UserProfile} from "../DataBase/DataUserProfile";
// import axios from "axios";
import api from '../script/axiosApi';
import { CgEditMarkup } from 'react-icons/cg'
import { IoCloseCircleOutline } from "react-icons/io5";

// import * as React from 'react';
// import { useState, useEffect, useParams} from "react";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from 'react-router-dom';
	// axios.get("http://localhost/api")
	// .then((response) => {
	// 	response = response.json()
	// 	response.then((result) => {
	// 		console.log(result)
	// 		console.log("ceci est un test")
	// 	})
	// })


function Profile () {
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [modalOpen, setModalOpen] = useState(false);
	const [mine, setMine] = useState(false);
	const close = () => setModalOpen(false);
	const open = () => setModalOpen(true);

	const { username } = useParams();

	const [selectedPhoto, setSelectedPhoto] = useState(null);
	const [profilePicture, setProfilePicture] = useState('');

	const handleFileChange = (event) => {
	//   const file = event.target.files[0];
	  setSelectedPhoto(event.target.files[0]);
	//   try{
	// 	api.post("/picture", {picture: URL.createObjectURL(file)})
	// 	}
	//   catch(err){
	// 	console.log(err);
	//     }
	};

	const handleUpload = async () => {
		const formData = new FormData();
		formData.append('photo', selectedPhoto);
		try {
		  await api.post('/picture', formData);
		  console.log('File uploaded successfully');
		  window.location.reload(false);
		} catch (error) {
		  console.error('Error uploading file:', error);
		}
	  };

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
					{isLoading ? (
        				<h1>Loading...</h1>
      				) : (
        				<h1>{user.nickname}</h1>
      				)}
	  		</span>



			  {mine ? (
			<div>
				<motion.div  onClick={() => (modalOpen ? close() : open())}>
					<Link to="#" className="edit_name">
						{modalOpen === true ?  <IoCloseCircleOutline/> : <CgEditMarkup/>}
					</Link>
				</motion.div>
			
				<div>
      				<input type="file" accept="image/*" onChange={handleFileChange} />
      				<button onClick={handleUpload}>Upload</button>
    			</div>
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
    return (
		<motion.div className="page"
		initial={{opacity: -1}}
		animate={{opacity: 1}}
		exit={{opacity: -1}}>
		<div className="home">
			<motion.div animate={{x: move ? -200: 170}}
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
					<Link to="#" className="history"><AiOutlineHistory/>  Match History</Link>
			</motion.div>
		</motion.div>
    )
}

export default Home