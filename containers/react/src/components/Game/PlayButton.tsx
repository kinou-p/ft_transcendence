import React from 'react';
import '../../styles/field.css';
import { useNavigate } from "react-router-dom";

function PlayButton() {
	const history = useNavigate();

	const handleButtonClick = () => {
		let path = `play?`;

		const superpowerCheckbox = document.querySelector<HTMLInputElement>('input[value="superpower"]');
		if (superpowerCheckbox && superpowerCheckbox.checked) {
		  path += 'superpower=true&';
		}

		const speedCheckbox = document.querySelector<HTMLInputElement>('input[value="speed"]');
		if (speedCheckbox && speedCheckbox.checked) {
		  path += 'speed=true&';
		}

		path = path.slice(0, -1);
		history(path);
	  };

	return (
		<div className="notClicked" id="canvas_container">
			<button onClick={handleButtonClick} className="playButton">Play</button>
			{}
			<div className='checkbox'>
				<p><input className="inside_checkbox" type="checkbox" value="superpower"/> Super Power <br/> ( w = wall power ) </p>
				<p><input className="inside_checkbox" type="checkbox" value="speed"/> Faster and Faster </p>
			</div>
		</div>
		);
}

export default PlayButton;
