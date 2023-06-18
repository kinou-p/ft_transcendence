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
		
		const superpowerCheckbox = document.querySelector('input[value="superpower"]');
		if (superpowerCheckbox.checked) {
		  path += 'superpower=true&';
		}
	  
		const obstacleCheckbox = document.querySelector('input[value="obstacle"]');
		if (obstacleCheckbox.checked) {
		  path += 'obstacle=true&';
		}
	  
		const speedCheckbox = document.querySelector('input[value="speed"]');
		if (speedCheckbox.checked) {
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
				<p><input type="checkbox" value="superpower"/> Super Power </p>
				<p><input type="checkbox" value="obstacle"/> Obstacle </p>
				<p><input type="checkbox" value="speed"/> Faster and Faster </p>
			</div>
		</div>
		);
}

export default PlayButton;