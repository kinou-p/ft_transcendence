import React, { useEffect, useRef, useState } from "react";
// import { useHistory } from 'react';
// import { redirect } from "react-router-dom";

import "../styles/App.css";
import api from '../script/axiosApi.tsx';

import QRCodeStyling from "qr-code-styling";
import { AnimatePresence, motion } from 'framer-motion'
import RedAlert from "../components/Alert/RedAlert.tsx";



const qrCode = new QRCodeStyling({
    width: 300,
    height: 300,
    dotsOptions: {
        color: "black",
        type: "rounded"
    },
    backgroundOptions: {
        color: "#5843e4",
    },
    imageOptions: {
        crossOrigin: "anonymous",
        margin: 20
    }
    });

function QrCode () {
	const ref = useRef<HTMLDivElement>(null);
	const [user, setUser] = useState(false);
	const [url, setUrl] = useState("");
	const [secret, setSecret] = useState(false);
	const [code, setCode] = useState('');
	const [activated, setActivated] = useState(false);
	const [err, setErr] = useState(false);
	const closeErr = () => setErr(false);

    useEffect(() => {
		if (ref.current)
        	qrCode.append(ref.current);
		const getUser = async ()=>{
			try{
				const tmpUser = await api.get("/profile");
				setUser(tmpUser.data);
				if (tmpUser.data.otp_verified)
				{
					setActivated(true);
					return ;
				}
				const otpData = await api.post("/otp");
				setUrl(otpData.data.otpauth_url);
				setSecret(otpData.data.base32_secret);
			}
			catch(err){
				console.log(err);
			}
		};
		getUser();

    }, []);

    useEffect(() => {
        qrCode.update({data: url});
    }, [url]);


	const handleKeyPress = async (e: { key: string; })=>{
		if (e.key !== "Enter")
			return ;
		try{
			const res = await api.post("/verifyOtp", {token: code})
			if (!res.data)
			{
				setErr(true);
			}
			if (res.data === 1)
			{
				const path = 'http://' + process.env.REACT_APP_BASE_URL + '/';
				window.history.pushState({}, '', path);
				window.location.reload();
			}
			else
				console.log("Bad code")
		}
		catch(err){
			 console.log(err)
		}
	}

	const handleDesactivate = async () => {
		try {
			await api.post("/deleteOtp")
			window.location.reload();
		} catch(err) {
			console.log(err);
		}
    };

    return (
		<motion.div
		className="page"
		initial={{ opacity: -1 }}
		animate={{ opacity: 1 }}
		exit={{ opacity: -1 }}
	  >
		{!activated && (
		  <>
			<h1>Enter The Secret</h1>
			<h3>{secret}</h3>
			<h1>Or Scan The QRCode</h1>
			<div ref={ref} />
		  </>
		)}

<>
      {!activated && localStorage.getItem('token') ? (
        <>
          <h1>Double Auth Validation</h1>
          <input
            onKeyDown={handleKeyPress}
            type="number"
            className="qr"
            placeholder="6 Digits Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </>
      ) : (
        <button className="desactivate" onClick={handleDesactivate}>Desactivate 2FA</button>
      )}
	  <AnimatePresence
			initial={false}
			onExitComplete={() => null}>
				{err ? (<RedAlert handleClose={closeErr} text="Error: Bad intput. Try again"/>):("")}
			</AnimatePresence>
    </>
	  </motion.div>
    )
}

export default QrCode
