import '../styles/App.css';
import '../styles/old.css';
import logo from '../logo.svg';

function Header()
{
	return (
		<div class="header">
        	<a href="http://localhost" class="box menu"> <p class="userTxt">Menu</p> </a>
        	<div class="box headerName">
        	    <p class="center pong">PONG</p>
        	</div>
        	<a href="http://localhost/pong" class="box username"> 
        	    <p class="userTxt">Play</p> 
        	    {/* <img class="pp center" src="../../public/logo192.png" alt="profile picture"> */}
				<img src={logo} className="pp center" alt="logo" />
        	</a>
    	</div>
	);
}

export default Header;