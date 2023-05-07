// import GoogleLogin from 'react-google-login';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import setupLogin from '../script/login42';
// import React, { useEffect } from 'react';

function Login42()
{
	const [token, setToken] = useState(null);
	const [userId, setUserId] = useState(null);
	const [userName, setUserName] = useState(null);

	useEffect(() => {
		console.log("you said yes to connect with 42");
		const url = new URL(window.location.href);
		const code = url.searchParams.get('code');
		console.log(`code is= ${code}`);

		const data = {
			grant_type: 'authorization_code',
			client_id: 'u-s4t2ud-6d29dfa49ba7146577ffd8bf595ae8d9e5aaa3e0a9615df18777171ebf836a41',
			client_secret: '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',
			code: code,
			redirect_uri: 'http://localhost:8080/login42',
		  };

		axios.post('https://api.intra.42.fr/oauth/token', data)
		.then(response => {
    		// handle success response
    		console.log(response);
			const token = response.data.access_token;
			setToken(token);
			console.log(`token= ${token}`);
			  axios.get('https://api.intra.42.fr/oauth/token/info', {
				headers: {
				  Authorization: `Bearer ${token}`
				}
			  })
			  .then(response => {
				console.log(response)
				const userId = response.data.resource_owner_id;
				setUserId(userId);
				console.log(userId);
				// axios.get(`https://api.intra.42.fr/v2/users/${userId}`)
				// axios.get(`https://api.intra.42.fr/v2/me`)
				axios.get('https://api.intra.42.fr/v2/me', {
					headers: {
					  Authorization: `Bearer ${token}`
					}
				  })
  				.then(response => {
  				  console.log(response);
				  const login = response.data.login;
				  console.log(`login= ${login}`);
				  setUserName(response.data.login);
				  console.log(`username= ${userName}`);
  				  // Gérer les données de réponse ici
  				})
  				.catch(error => {
  				  console.error(error);
  				  // Gérer les erreurs ici
  				});
			  })
			  .catch(error => {
				console.error(error);
			  });

  		})
		.catch(error => {
			// handle error response
			console.error(error);
		});
	  }, []);

	return (
		<div>
        	<p>Le token d'accès est : {userName}</p>
		</div>
	);
}

export default Login42;