// function setupLogin()
// {	
// 	// alert("Le bouton a été cliqué !");
// 	console.log('Hello from login42');
// }

// export default setupLogin;

function Login42()
{
	const [token, setToken] = useState(null);
	const [userId, setUserId] = useState(null);
	const [login, setLogin] = useState(null);

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
				  setLogin(login);
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
		<div className="header">
        	<a href="http://localhost" className="box menu"> <p className="userTxt">Menu</p> </a>
        	<div className="box headerName">
        	    <a href="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-6d29dfa49ba7146577ffd8bf595ae8d9e5aaa3e0a9615df18777171ebf836a41&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Flogin42&response_type=code"
					className="center pong">PONG</a>
        	</div>
        	<a href="http://localhost/pong" className="box username"> 
        	    <p className="userTxt">{login}</p> 
        	    {/* <img className="pp center" src="../../public/logo192.png" alt="profile picture"> */}
				<img src={logo} className="pp center" alt="logo" />
        	</a>
    	</div>
	);
}

export default Login42;