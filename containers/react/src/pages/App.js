import React from "react";
import {Routes, Route} from 'react-router-dom';
import Home from "../pages/Home.jsx";
import PlayButton from "../pages/PlayButton.js";
import Field from "../pages/Field";
import Login42 from "../pages/Login42.js";
import Messages from "../pages/Messages.jsx";
import { useLocation } from "react-router-dom";
import {AnimatePresence} from "framer-motion";

import SuccessToken from '../script/tokenSuccess'

function App () {
	const location = useLocation();
	return (
		<AnimatePresence>
			<Routes location={location} key={location.pathname}>
				
				<Route exact path="/" element={<Home/>}/>
				<Route exact path="/token" element={<SuccessToken />}/>
				<Route exact path="/pong/play" element={<Field />}/>
				<Route path="/game" element={<PlayButton />}/>
				<Route exact path="/login42" element={<Login42 />}/>
				
				<Route exact path="/messages" element={<Messages />}/>
			</Routes>
		</AnimatePresence>
	)
}

export default App