import React from 'react';
import '../../styles/field.css';
// import { useHistory } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

function PlayButton() {

	const history = useNavigate();

	// const handleButtonClick = () => {
	// 	let path = `play`;
	// 	history(path);
	// };
	const handleButtonClick = () => {
		let path = `play?`;

		const superpowerCheckbox = document.querySelector<HTMLInputElement>('input[value="superpower"]');
		if (superpowerCheckbox && superpowerCheckbox.checked) {
		  path += 'superpower=true&';
		}

		// const obstacleCheckbox = document.querySelector<HTMLInputElement>('input[value="obstacle"]');
		// if (obstacleCheckbox && obstacleCheckbox.checked) {
		//   path += 'obstacle=true&';
		// }

		const speedCheckbox = document.querySelector<HTMLInputElement>('input[value="speed"]');
		if (speedCheckbox && speedCheckbox.checked) {
		  path += 'speed=true&';
		}

		// Remove the trailing '&' character
		path = path.slice(0, -1);
		console.log(path)
		history(path);
	  };

	return (
		<div className="notClicked" id="canvas_container">
			<button onClick={handleButtonClick} className="playButton">Play</button>
			{/* !buttonClicked && <button onClick={handleButtonClick}>Draw on Canvas</button> */}
			<div className='checkbox'>
				<p><input className="inside_checkbox" type="checkbox" value="superpower"/> Super Power <br/> ( w = wall power ) </p>

				<p><input className="inside_checkbox" type="checkbox" value="superpower"/> Super Power</p>
				<p><input className="inside_checkbox" type="checkbox" value="speed"/> Faster and Faster </p>
			</div>
		</div>
		);
}

export default PlayButton;
