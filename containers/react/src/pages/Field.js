import { useEffect, useLocation } from 'react';
// import { useState, useRef } from 'react';
import DrawCanvas from './canvas.js';
import queryString from 'query-string';
import '../styles/field.css';

import { useParams } from "react-router-dom";

// import { withRouter } from 'react-router-dom';

function Field()
{
	useEffect(() => {
		// const location = useLocation();
		const queryParams = queryString.parse(window.location.search);
		
		console.log("launch canva hehe")
		let Modifiers = 0;
	  
		if (queryParams.superpower === 'true') {
		  Modifiers += 1;
		}
	  
		if (queryParams.obstacle === 'true') {
		  Modifiers += 2;
		}
	  
		if (queryParams.speed === 'true') {
		  Modifiers += 4;
		}
		// console.log(`modifiers= ${Modifiers}`)
		// DrawCanvas(Modifiers);
		// 		return () => {
		// 	console.log("000000000000000000000000000000000")
		// //   socketRef.current.disconnect();
		// };

		// console.log(`modifiers= ${Modifiers}`)
		const cleanup = DrawCanvas(Modifiers);
	
		return () => {
		  console.log("Cleanup");
		  cleanup(); // Call the cleanup function to stop the ongoing process or perform necessary cleanup tasks
		};

	}, []);

	// const [buttonClicked, setButtonClicked] = useState(false);

	// const handleButtonClick = () => {
	// 	drawCanvas();
	//   setButtonClicked(true);
	// };

	return (
		<div className="field" id="canvas_container">
			<canvas id="myCanvas"></canvas>
			{/* <button onClick={handleButtonClick}>Draw on Canvas</button> */}
			{/* {buttonClicked && <canvas id="myCanvas"></canvas>}
			{!buttonClicked && <button onClick={handleButtonClick}>Draw on Canvas</button>} */}
		</div>
	);
}

export default Field;
// export default withRouter(Field);


// function Field() {
// 	const [buttonClicked, setButtonClicked] = useState(false);
  
// 	const handleButtonClick = () => {
// 	  const canvas = document.createElement('canvas');
// 	  canvas.id = 'myCanvas';
// 	  console.log("button clicked")
// 	  document.getElementById('canvas_container').appendChild(canvas);
// 	  setButtonClicked(true);
// 	  drawCanvas(canvas);
// 	};
// 	setButtonClicked(true);
// 	return (
// 	//   <div className="field" id="canvas_container">
// 	<div className={`notClicked ${buttonClicked ? 'clicked' : ''}`} id="canvas_container">
// 		{!buttonClicked && <button className="playButton" onClick={handleButtonClick}>Play</button>}
// 	  </div>
// 	);
//   }
  
//   export default Field;

// function draw() {
// 	// Effacer le canvas
// 	ctx.clearRect(0, 0, canvas.width, canvas.height);
  
// 	// Dessiner la raquette
// 	ctx.fillRect(canvas.width - paddleWidth, paddleY, paddleWidth, paddleHeight);
  
// 	// Appeler la fonction draw à chaque frame
// 	requestAnimationFrame(draw);
// }
  
//   draw(); // Appeler la fonction draw pour la première fois

// const canvas = document.getElementById('myCanvas');
// canvas.width = 500;
// canvas.height = 500;
// const ctx = canvas.getContext('2d');
// ctx.fillRect(50, 50, 1000, 1000);