import React, { useEffect, useRef, useState } from "react";
// import { useHistory } from 'react';
// import { redirect } from "react-router-dom";

import "../styles/App.css";
import api from '../script/axiosApi.tsx';

import QRCodeStyling from "qr-code-styling";
import { motion } from 'framer-motion'



const qrCode = new QRCodeStyling({
    width: 300,
    height: 300,
    // image: "../assets/profile.jpg",
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
    // const url = "https://www.youtube.com";
    const ref = useRef(null);
	const [user, setUser] = useState(false);
	const [url, setUrl] = useState(false);
	const [secret, setSecret] = useState(false);
	const [code, setCode] = useState('');
	const [activated, setActivated] = useState(false);

	// const history = useHistory();

    useEffect(() => {
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
				// const tmpUser = await api.get("/profile")
				// console.log("test")
				// console.table(convs);
			}
			catch(err){
				console.log(err);
			}
		};
		getUser();

    }, []);

    useEffect(() => {
        qrCode.update({
        data: url
        });
    }, [url]);


	const handleKeyPress = async (e)=>{
		// console.log(`e in press= ${e.key}`)
		if (e.key !== "Enter")
			return ;
		try{
			console.log("code= ", code)
			const res = await api.post("/verifyOtp", {token: code})
			console.log("res= ", res.data)
			console.log("res= ", res)
			if (res.data === 1)
			{
				console.log("registered")
				// history.push('/login')

				const path = 'http://' + process.env.REACT_APP_BASE_URL + '/'; 
				window.history.pushState({}, null, path);
				window.location.reload(false);

			}
			else
			{
				console.log("bad code")
				//alert ?? retry
			}
			// redirect('/test')
		} 
		catch(err){
			 console.log(err)
		}
	}

	const handleDesactivate = async () => {
		try {
			await api.post("/deleteOtp")
			// const path = 'http://' + process.env.REACT_APP_BASE_URL + '/'; 
			// window.history.pushState({}, null, path);
			window.location.reload(false);
		} catch(err) {
			console.log(err);
		}
    };

    return (
		// <motion.div className="page"
		// initial={{opacity: -1}}
		// animate={{opacity: 1}}
		// exit={{opacity: -1}}>
        //     <h1>QRcode</h1>
        //     <h3>{secret}</h3>
        //     <div ref={ref} />
        //     <input type="text" className="qr" placeholder="Type The Code"/>
        //     {}

		// </motion.div>

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
            type="text"
            className="qr"
            placeholder="6 Digits Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </>
      ) : (
        <button onClick={handleDesactivate}>Desactivate 2FA</button>
      )}
    </>

		{/* {!localStorage.getItem('token') && (
		<>
		  <h1>Double Auth</h1>
		  <input onKeyDown={handleKeyPress}
		  		type="text" 
				className="qr" 
				placeholder="6 Digits Code"
				onChange={(e) => setCode(e.target.value)}
		  />
		</>
		) : (<button onClick={ handleDesactivate }>Desactivate 2FA</button>)}
		 */}
		{/* {!activated && (
		  <button onClick={() => setActivated(true)}>Activate</button>
		)} */}
	  </motion.div>
    )
}

export default QrCode