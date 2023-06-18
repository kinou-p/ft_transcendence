import '../styles/old.css';
import '../styles/field.css';

import { useLocation } from 'react-router-dom';
import api from '../script/axiosApi.tsx';
 
function HomeLogin()
{
	const login2 = () => {
		console.log('Hello from myFunction');
		api.get('/profile').then((response) => {
			const data = response;
			const myJSON = JSON.stringify(response.data);
			console.log(`data response= ${myJSON}`)
		});
	  }

	  const location = useLocation();

	const handleButtonClick = () => {
		const token = localStorage.getItem('token')
		console.log(`token type= ${typeof token}`);
		if (token !== null && typeof token === 'string')
		{
			console.log(`already token= ${localStorage.getItem('token')}`)
			return ;
		}
		// else
		// let path = "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-6d29dfa49ba7146577ffd8bf595ae8d9e5aaa3e0a9615df18777171ebf836a41&redirect_uri=http%3A%2F%2F" + process.env.REACT_APP_BASE_URL + "%3A80%2Fapi%2Fauth%2Flogin&response_type=code"; 
		let path = "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-6d29dfa49ba7146577ffd8bf595ae8d9e5aaa3e0a9615df18777171ebf836a41&redirect_uri=http%3A%2F%2F" + process.env.REACT_APP_BASE_URL + "%2Fapi%2Fauth%2Flogin&response_type=code"
		window.location.replace(path);
	};

	return (
		<div className="notClicked">
			<button onClick={handleButtonClick} className="playButton" >LOGIN</button>
			{/* <div className ="loginForm">
	 			<button className="submit" onClick={login2}>test button</button>
			</div> */}
			{/* <div className ="loginForm">
	 			<button className="submit" onClick={() => api.post('/win')}>add win</button>
			</div>
			<div className ="loginForm">
	 			<button className="submit" onClick={() => api.post('/loss')}>add loss</button>
			</div> */}
    	</div>
	);
}

export default HomeLogin;