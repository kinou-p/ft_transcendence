import React from "react";
import {Routes, Route} from 'react-router-dom';
import HomeLogin from "../pages/Home.js";

import Home from "../pages/Home.jsx";

import PlayButton from "./Game/PlayButton.js";
import Field from "../pages/Field";
import Login42 from "../pages/Login42.js";
import Messages from "../pages/Messages.jsx";
import QrCode from '../pages/QrCode.jsx'
import { useLocation } from "react-router-dom";
import {AnimatePresence} from "framer-motion";

import SuccessToken from '../script/tokenSuccess'


import DoubleAuth from "../pages/2fa.js";
import Game from "../pages/Game.jsx";
import Social from "../components/Social/Social.jsx";
import Logout from "../components/Profile/Logout.jsx";

function AnimatedRoute () {
	const location = useLocation();
	return (
		<AnimatePresence>
			<Routes location={location} key={location.pathname}>

				<Route exact path="/" element={<HomeLogin/>}/>
				<Route exact path="/profile" element={<Home/>}/>
				<Route exact path="/profile/:username" element={<Home/>}/>
				<Route exact path="/qr" element={<QrCode/>}/>
				
				<Route exact path="/2fa" element={<DoubleAuth/>}/>
				<Route exact path="/Social" element={<Social/>}/>

				<Route exact path="/token" element={<SuccessToken />}/>
				<Route path="/game" element={<PlayButton />}/>
				<Route exact path="/pong" element={<Game />}/>
				<Route exact path="/pong/play" element={<Field />}/>
				{/* <Route path="/profile" element={<PlayButton />}/> */}

				<Route exact path="/login42" element={<Login42 />}/>
				<Route exact path="/logout" element={<Logout />}/>
				<Route exact path="/messages" element={<Messages />}/>
			</Routes>
		</AnimatePresence>
	)
}

export default AnimatedRoute