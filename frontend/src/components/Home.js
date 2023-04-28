import '../styles/old.css';
import { login } from '../script/login.js'
 
function Home()
{
	return (
		<div class ="login">
         	<form id="loginForm" method="post" name="login" action="http://localhost/api/login" class ="loginForm">
         	    <p class="loginHere">Login Here</p>
         	    <input type="text" name="nickname" placeholder="login"></input>
         	    <input type="text" name="password" placeholder="password"></input>
         	    <button class="submit" onClick={login}>LOGIN</button>
         	</form>
		 	{/* <button></button> */}
    	</div>
	);
}

export default Home;