export function initializeListeners({canvas, paddleY, paddleHeight, paddleSpeed, lastMouseY, lastTouchY, vX, vY, ballX, ballY}) {

function updatePaddlePosition(newY) {
    if (newY >= 0 && newY <= canvas.height - paddleHeight) {
        paddleY = newY;
    }
}

document.addEventListener('mousemove', event => {
	const mouseY = event.clientY;

	if (!lastMouseY)
	{
		lastMouseY = mouseY;
		return;
	}
	const newY = mouseY > lastMouseY ? paddleY - (lastMouseY - mouseY) : paddleY + (mouseY - lastMouseY);
	updatePaddlePosition(newY);
	lastMouseY = mouseY;
});

document.addEventListener("touchmove", event => {
	const touchY = event.touches[0].pageY;

	if (!lastTouchY)
	{
		lastTouchY = touchY;
		return;
	}
	const newY = touchY > lastTouchY ? paddleY - (lastTouchY - touchY) : paddleY + (touchY - lastTouchY);
	updatePaddlePosition(newY);
	lastTouchY = touchY;
});

document.addEventListener("keydown", event => {
	console.log(event.code);
	if (event.code === "ArrowUp")
	{
		if ((paddleY - paddleSpeed) > 0)
			  paddleY -= paddleSpeed; // déplacer la raquette vers le haut
	}
	else if (event.code === "ArrowDown")
	{
		if (paddleY + paddleSpeed < canvas.height - paddleHeight)
			paddleY += paddleSpeed; // déplacer la raquette vers le bas
	}
	else if (event.code === "Space")//space
	{
		console.log('vx change to -1');
		vX = -0.2;
		vY = 0; 
	}
	else if (event.code === "KeyE")
	{
		// console.log('vx change to -1');
		vX = 0;
		vY = 0;
		ballX = canvas.width / 2;
		ballY = canvas.height / 2;
	}
	else if (event.code === "KeyQ")
	{
		if (vX > 0)
			// vX += 0.01;
			vX += 0.01;
		else
			// vX -= 0.01;
			vX -= 0.01;
	}
});

}//end of initializeListeners