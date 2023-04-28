import '../styles/App.css';
import '../styles/old.css';
import logo from '../logo.svg';

function Header()
{
	return (
		<div class="header">
        	<a href="http://localhost" class="box menu"> <p class="userTxt">Menu</p> </a>
        	<div class="box headerName">
        	    <a href="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-6d29dfa49ba7146577ffd8bf595ae8d9e5aaa3e0a9615df18777171ebf836a41&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Flogin42&response_type=code"
					class="center pong">PONG</a>
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