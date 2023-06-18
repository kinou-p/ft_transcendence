// import GoogleLogin from 'react-google-login';
import { useEffect } from 'react';
import axios from 'axios';
// import setupLogin from '../script/login42';
// import React, { useEffect } from 'react';

function Login42()
{
	useEffect(() => {
		console.log("you said yes to connect with 42");
		const url = new URL(window.location.href);
		// console.log(`url is= ${url}`);
		const code = url.searchParams.get('code');
		console.log(`code is= ${code}`);

		const data = {
			grant_type: 'authorization_code',
			client_id: 'u-s4t2ud-6d29dfa49ba7146577ffd8bf595ae8d9e5aaa3e0a9615df18777171ebf836a41',
			client_secret: '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',
			code: code,
			redirect_uri: 'http://' + process.env.REACT_APP_BASE_URL + '/login42',
		  };
		
		axios.post('https://api.intra.42.fr/oauth/token', data)
		.then(response => {
    		// handle success response
    		console.log(response);
  		})
		.catch(error => {
			// handle error response
			console.error(error);
		});
	  }, []);

	return (
		<div>
			<p>"COUCOU LOGIN$@ jeje" </p>
			{/* <script src="../script/login42.js"></script> */}
		</div>
	);
}

export default Login42;