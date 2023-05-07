import '../styles/old.css';
import { login } from '../script/login.js'
import { login2 } from '../script/login.js'
 
function Home()
{
	return (
		<div className ="login">
         	<form id="loginForm" method="post" name="login" action="http://localhost/api/login" className ="loginForm">
         	    <p className="loginHere">Login Here</p>
         	    <input type="text" name="nickname" placeholder="login"></input>
         	    <input type="text" name="password" placeholder="password"></input>
         	    <button className="submit" onClick={login}>LOGIN</button>
         	</form>
			<form id="loginForm" method="get" name="login2" action="http://localhost/api/profile" className ="loginForm">
				<button className="submit" onClick={login2}>test button</button>
			</form>
		 	{/* <button></button> */}
    	</div>
	);
}

export default Home;