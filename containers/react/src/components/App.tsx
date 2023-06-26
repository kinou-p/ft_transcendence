import React, { useEffect } from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import HomeLogin from "../pages/LoginButton.tsx";

import Home from "../pages/Home.tsx";

import PlayButton from "./Game/PlayButton.tsx";
import Field from "../pages/Field.tsx";
import Messages from "../pages/Messages.tsx";
import QrCode from '../pages/QrCode.tsx'
import { useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import SuccessToken from '../script/tokenSuccess.tsx'

import PageNotFound from "../components/404.tsx"
import DoubleAuth from "../pages/2fa.tsx";
import Game from "../pages/Game.tsx";
import Social from "./Social/Social.tsx";
import Logout from "./Profile/Logout.tsx";
import api from "../script/axiosApi.tsx"


function AnimatedRoute() {
	useEffect(() => {
		const handleBeforeUnload = async (event: { preventDefault: () => void; returnValue: string; }) => {
			console.log("git ")
			if (!localStorage.getItem('token'))
				return;
			try {
				await api.post("/quit");
			} catch (err) {
				console.log(err);
			}
		};

		const handleLoad = async () => {
			if (!localStorage.getItem('token'))
				return;
			try {
				await api.post("/addSession");
			} catch (err) {
				console.log(err);
			}
		};

		handleLoad();
		window.addEventListener('beforeunload', handleBeforeUnload);
		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
		};
	}, []);

	const location = useLocation();
	if (!localStorage.getItem('token')) {
		return (
			<AnimatePresence>
				<Routes location={location} key={location.pathname}>
					<Route path="/" element={<HomeLogin />} />
					<Route path="/token" element={<SuccessToken />} />
				</Routes>
			</AnimatePresence>
		)
	}

	return (
		<AnimatePresence>
			<Routes location={location} key={location.pathname}>
				<Route path="/" element={<Home />} />
				<Route path="/profile" element={<Home />} />
				<Route path="/profile/:username" element={<Home />} />
				<Route path="/qr" element={<QrCode />} />
				<Route path="/2fa" element={<DoubleAuth />} />
				<Route path="/Social" element={<Social />} />
				<Route path="/token" element={<SuccessToken />} />
				<Route path="/game" element={<PlayButton />} />
				<Route path="/pong" element={<Game />} />
				<Route path="/pong/play" element={<Field />} />
				<Route path="/logout" element={<Logout />} />
				<Route path="/messages" element={<Messages />} />
				<Route path="/404" element={<PageNotFound />} />
				<Route path="*" element={<Navigate to="/404" />} />
			</Routes>
		</AnimatePresence>
	)
}

export default AnimatedRoute
