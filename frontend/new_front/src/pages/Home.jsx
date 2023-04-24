import React from "react";
import '../Style/Profile.css'
import '../Style/App.css'
import DefaultPicture from "../assets/profile.jpg";
import WinLoss from "../components/Win_Loss";



function Home () {
    return (
		<div className="App">
			<div className="profile">
				<img className="profile-pic" src={DefaultPicture} alt="Profile pic" />
			</div>

			<div className="profile">
				{/* <canvas id="canvas" height="610" width="500">
						<h1 font-color="white"> Welcome to the Home Page!</h1>
				</canvas> */}
				<WinLoss/>
			</div>
		</div>
    )
}

export default Home