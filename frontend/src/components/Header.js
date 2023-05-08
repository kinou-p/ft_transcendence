import '../styles/App.css';
import '../styles/old.css';
import logo from '../logo.svg';


import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import setupLogin from '../script/login42';
// import React, { useEffect } from 'react';



function Header()
{
	return (
		<div className="header">
        	<a href="http://localhost" className="box menu"> <p className="userTxt">Menu</p> </a>
        	<div className="box headerName">
        	    {/* <a href="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-6d29dfa49ba7146577ffd8bf595ae8d9e5aaa3e0a9615df18777171ebf836a41&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Flogin42&response_type=code" */}
        	     <a className="center pong">PONG</a>
        	</div>
        	<a href="http://localhost/pong" className="box username"> 
        	    <p className="userTxt">Play</p> 
        	    {/* <img className="pp center" src="../../public/logo192.png" alt="profile picture"> */}
				<img src={logo} className="pp center" alt="logo" />
        	</a>
    	</div>
	);
}

export default Header;