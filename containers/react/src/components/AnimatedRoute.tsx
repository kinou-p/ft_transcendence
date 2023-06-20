import React from "react";
import {Routes, Route} from 'react-router-dom';
import Home from "../pages/Home.jsx";
import PlayButton from "./Game/PlayButton.tsx";
import Field from "../pages/Field";
import Login42 from "../pages/Login42.js";
import Messages from "../pages/Messages.jsx";
import { useLocation } from "react-router-dom";
import {AnimatePresence} from "framer-motion";

function AnimatedRoute () {
	const location = useLocation();
	return (
		<AnimatePresence>
			<Routes location={location} key={location.pathname}>
				<Route path="/" element={<Home/>}/>
				<Route path="/game" element={<PlayButton />}/>
				<Route path="/pong/play" element={<Field />}/>
				<Route path="/login42" element={<Login42 />}/>
				<Route path="/messages" element={<Messages />}/>
			</Routes>
		</AnimatePresence>
	)
}

export default AnimatedRoute