import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react'
import queryString from 'query-string';
import axios from 'axios';
import React from 'react';

import {User} from "../../interfaces.tsx"

function SuccessToken() {
	const location = useLocation();
	const { data } = queryString.parse(location.search);
	const [code, setCode] = useState('');
	const [user, setUser] = useState<User>();
  
	useEffect(() => {
	  if (!data) {
		console.log("No data");
		return ;
	  }
  
	  const cleanData = data.slice(1, -1); // Declare cleanData here
  
	  const getUser = async () => {
		try {
		  const tmpUser = await axios({
			method: 'GET',
			url: 'http://' + process.env.REACT_APP_BASE_URL + '/api/profile',
			headers: {
			  Authorization: `Bearer ${cleanData}`,
			},
			withCredentials: true,
		  });
		  setUser(tmpUser.data);
		} catch (err) {
		  console.log(err);
		}
	  };
  
	  getUser();
	}, [data]);
  
	const handleKeyPress = async (e: { key: string; })=>{
		if (e.key !== "Enter")
			return ;
		try{
			const res = await axios({
				method: 'POST',
				url: 'http://' + process.env.REACT_APP_BASE_URL + '/api/verifyOtp',
				headers: {
				  Authorization: `Bearer ${cleanData}`,
				},
				withCredentials: true,
				data: { token: code }
			  });

			if (res.data === 1)
			{
				localStorage.setItem('token', `${cleanData}`);
				window.location.replace("http://" + process.env.REACT_APP_BASE_URL + "/pong");
			}
			else
				console.log("bad code")
		} 
		catch(err){
			 console.log(err)
		}
	}


  
	if (!user) {
	  return <h1>Loading...</h1>;
	}
	if (!data)
		return (<></>);
	const cleanData = data.slice(1, -1); // Declare cleanData here as well
  
	if (!user.otp_verified) {
	  localStorage.setItem('token', `${cleanData}`);
	  window.location.replace("http://" + process.env.REACT_APP_BASE_URL + "/pong");
	  return null; // or return a message or component indicating not verified
	}
  
	return (
		<>
		  <h1>Double Auth</h1>
		  <input
			onKeyDown={handleKeyPress}
			type="text"
			className="qr"
			placeholder="6 Digits Code"
			value={code}
			onChange={(e) => setCode(e.target.value)}
		  />
		</>
	  );
	}
	
	export default SuccessToken;