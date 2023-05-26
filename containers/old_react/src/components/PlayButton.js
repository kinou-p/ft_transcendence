import '../styles/field.css';
// import { useHistory } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

function PlayButton() {

	const history = useNavigate();

	const handleButtonClick = () => {
		let path = `play`; 
		history(path);
	};

	return (
		<div className="notClicked" id="canvas_container">
			<button onClick={handleButtonClick} className="playButton">Play</button>
			{/* !buttonClicked && <button onClick={handleButtonClick}>Draw on Canvas</button> */}

		</div>
		);
}

export default PlayButton;