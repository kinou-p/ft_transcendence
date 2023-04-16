import '../styles/App.css';
import '../styles/old.css';
import logo from '../logo.svg';

function Header()
{
	return (
		<div class="header">
        	<div class="box menu"> <p class="userTxt">Menu</p> </div>
        	<div class="box headerName">
        	    <p class="center pong">PONG</p>
        	</div>
        	<div class="box username"> 
        	    <p class="userTxt">UserName</p> 
        	    {/* <img class="pp center" src="../../public/logo192.png" alt="profile picture"> */}
				<img src={logo} className="pp center" alt="logo" />
        	</div>
    	</div>
	);
}

export default Header;