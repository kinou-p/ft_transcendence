import '../styles/old.css';
import '../styles/field.css';
import React from 'react';
 
function HomeLogin()
{
	const handleButtonClick = () => {
		const token = localStorage.getItem('token')
		console.log(`token type= ${typeof token}`);
		if (token !== null && typeof token === 'string')
			return ;
		let path = process.env.REACT_APP_INTRA_URL || "";
		window.location.replace(path);
	};

	return (
		<div className="notClicked">
			<button onClick={handleButtonClick} className="playButton" >LOGIN</button>
    	</div>
	);
}

export default HomeLogin;