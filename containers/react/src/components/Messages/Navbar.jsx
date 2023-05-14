// import UserProfile from '../../DataBase/DataProfileUser'
import DefaultPic from '../../assets/profile.jpg';
// import Data from '../../DataBase/DataProfileUser';
import '../../styles/Messages.css'

function Navbar(){
	return (
		<div className='navbar'>
			<img src={DefaultPic} alt="profile" className="pic"/>
			<h4>Dipper Ratman</h4>
		</div>
	)
}

export default Navbar