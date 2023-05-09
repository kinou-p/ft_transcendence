import '../styles/old.css';
import '../styles/field.css';

// import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import api from '../script/axiosApi';
// import { login } from '../script/login.js'
// import { login2 } from '../script/login.js'
// import axios from 'axios';
 
function Home()
{
	// const login = async () => {
	const login2 = () => {
		console.log('Hello from myFunction');
		api.get('/profile').then((response) => {
			const data = response;
			// const parsedData = JSON.parse(response.data);
			// console.log(`response= ${parsedData}`)
			
			const myJSON = JSON.stringify(data);
			console.log(`response2= ${myJSON}`)
			console.log(`response= ${data}`)

		});
		// alert("Le bouton a été cliqué !");
		// var formulaire = document.getElementById("loginForm");
		// formulaire.submit();
	  }

	  const location = useLocation();

	const handleButtonClick = () => {
		let path = "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-6d29dfa49ba7146577ffd8bf595ae8d9e5aaa3e0a9615df18777171ebf836a41&redirect_uri=http%3A%2F%2Flocalhost%3A80%2Fapi%2Fauth%2Flogin&response_type=code"; 
		window.location.replace(path);
	};

	return (
		<div className="notClicked">
			<button onClick={handleButtonClick} className="playButton" >LOGIN</button>
	 		{/* <div id="loginForm" method="get" name="login2" action="http://localhost/api/profile" className ="loginForm"> */}
			<div className ="loginForm">
	 			<button className="submit" onClick={login2}>test button</button>
			</div>
    	</div>
	// href="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-6d29dfa49ba7146577ffd8bf595ae8d9e5aaa3e0a9615df18777171ebf836a41&redirect_uri=http%3A%2F%2Flocalhost%3A80%2Fapi%2Fauth%2Flogin&response_type=code">
	// 	console.log('simple login button clicked');

	// 	const url = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-6d29dfa49ba7146577ffd8bf595ae8d9e5aaa3e0a9615df18777171ebf836a41&redirect_uri=http%3A%2F%2Flocalhost%3A80%2Fapi%2Fauth%2Flogin&response_type=code';
	// 	// const response = await fetch(url);
	// 	// console.log(`${response}`);
	// 	try
	// 	{
    // 		const response = await axios.post(url);
    // 		const token = response.data.token; // extract token from response
    // 		localStorage.setItem('token', token); // store token in localStorage
    // 		console.log(`token = ${token}`);
	// 	}
	// 	catch (error)
	// 	{
	// 		console.error(error);
	// 	}
	// };

	// const login = async() => {
	// 	console.log('simple login button clicked');

	// 	const url = 'http://localhost/api/login';
	// 	const response = await fetch(url);
	// 	const data = await response.json(); // extract token from response
	// 	localStorage.setItem('token', data.token); // store token in localStorage
	// 	console.log(`token= ${data.token}`)
	// }
	
	// localStorage.setItem('token', '${response}');
	// alert("Le bouton a été cliqué !");
	// var formulaire = document.getElementById("loginForm");
	// formulaire.submit();


		// <div className="loginForm">
		// 	<button className="submit loginHere" onClick={login}>LOGIN</button>
		// </div>
		// className="center pong">PONG</a>

		// <div className ="login">
        //  	<form id="loginForm" method="post" name="login" action="http://localhost/api/login" className ="loginForm">
        //  	    <p className="loginHere">Login Here</p>
        //  	    <input type="text" name="nickname" placeholder="login"></input>
        //  	    <input type="text" name="password" placeholder="password"></input>
        //  	    {/* <button className="submit" onClick={login}>LOGIN</button> */}
        //  	</form>
		// 	<form id="loginForm" method="get" name="login2" action="http://localhost/api/profile" className ="loginForm">
		// 		<button className="submit" onClick={login2}>test button</button>
		// 	</form>
		//  	{/* <button></button> */}
    	// </div>
	);
}

export default Home;