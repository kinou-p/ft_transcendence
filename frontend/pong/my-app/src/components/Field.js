import { useEffect } from 'react';
import { drawCanvas } from './canvas.js';
import '../styles/field.css';

function Field()
{
	useEffect(() => {
		drawCanvas();
	}, []);

	return (
		<div class="field" id="canvas_container">
			<canvas id="myCanvas"></canvas>
		</div>
	);
}

export default Field;


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