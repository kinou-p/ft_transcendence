// import io from 'socket.io-client';

import { useEffect } from 'react';
import io from 'socket.io-client';
// const socket = io('http://192.168.1.14:4000');
// const socket = io('http://86.209.110.20:4000');
// const socket = io('http://172.29.113.91:4000');

export function drawCanvas() {
	const socket = io('http://localhost:4000');
	console.log("start function");
	const canvas = document.getElementById('myCanvas');
	const ctx = canvas.getContext('2d');
	
//========================================================================================================
//========================================================================================================
//                                              Var Declaration			                                  
//========================================================================================================
//========================================================================================================

	//socket
	let myId = 0;
	let gameId = 0;

	//general canvas
	const scale = window.devicePixelRatio; 
	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
	
	//paddle var
	const paddleWidth = canvas.width * 0.01;
	let paddleHeight = canvas.height * 0.25;
	let paddleY = canvas.height / 2 - (paddleHeight / 2);
	let paddleX = canvas.width / 40;
	let paddleSpeed = canvas.height / 40;

	//opponent var
	let oPaddleY = paddleY;

	//mouse and touch
	let lastMouseY = 0;
	let lastTouchY = 0;

	//ball var
	let ballX = canvas.width / 2;
	let ballY = canvas.height / 2;

	//ball display
	let ballRadius = canvas.width * 0.01;
	let circleRadius = ballRadius * 3;
	ctx.lineWidth = (canvas.width / 300);

	//ball vector
	let vX = 0;
	let vY = 0;

	//score
	let myScore = 0;
	let hisScore = 0;
	
	let lastUpdateTime = performance.now();

	let maxAngle = 50;
	let maxBounceAngle = (maxAngle * Math.PI) / 180;

//========================================================================================================
//========================================================================================================
//                                              Socket handler			                                  
//========================================================================================================
//========================================================================================================

	function matchmaking()
	{
		console.log(`id ion matcj= ${myId}`)
		const info = {
			id: myId,
		};
		socket.emit('pong:matchmaking', info);
	}

	socket.on('pong:gameId', (data) => {
		gameId = data;
	});

	socket.on('connect', () => {
		console.log('Connected to NestJS server');
	});

	socket.on('pong:clientId', (data) => {
		console.log("receive id")
		myId = data;
		console.log(`id is= ${myId}`)
	});

	socket.on('pong:info', (data) => {
		oPaddleY = (data.paddleY / data.height) * canvas.height//canvas.height - data.ballY;
		ballX = canvas.width - (data.ballX * (canvas.width / data.width));//- data.ballX;
		ballY = ((data.ballY / data.height) * canvas.height)//canvas.height - data.ballY;

		vX = -data.vX;
		vY = data.vY;
	});

	function send_info()
	{
		if (gameId === 0)
			return ;
		const info = {
			id: myId,
			width: canvas.width,
			height: canvas.height,
			paddleY: paddleY,
			vX: vX,
			vY: vY,
			ballX: ballX,
			ballY: ballY,
			gameId: gameId,
		};
		socket.emit('pong:message', info);
	}

	socket.on('pong:paddle', (data) => {
		console.log("paddle info receive")
		oPaddleY = (data.paddleY / data.height) * canvas.height
	});

	function send_point()
	{
		if (gameId === 0)
			return ;
		console.log("send point");
		const info = {
			id: myId,
			gameId: gameId,
			point: hisScore,
		}
		socket.emit('pong:point', info);
	}

	socket.on('pong:point', (data) => {
		// hisScore += 1;
		console.log("gain point");
		// if (vX != 0)
		// {
			// console.log("up point");
		myScore = data.point;
		// }
		vX = 0;
		vY = 0;
		ballX = canvas.width / 2;
		ballY = canvas.height / 2;
	});

	function send_paddle_info()
	{
		if (gameId === 0)
			return ;
		const info = {
			id: myId,
			paddleY: paddleY,
			// width: canvas.width,
			height: canvas.height,
			gameId: gameId,
		};
		socket.emit('pong:paddle', info);
	}

	function send_forced_info()
	{
		if (gameId === 0)
			return ;
		const info = {
			gameId: gameId,
			width: canvas.width,
			height: canvas.height,
			id: myId,
			paddleY: paddleY,
			vX: vX,
			vY: vY,
			ballX: ballX,
			ballY: ballY,
		};
		socket.emit('pong:forced', info);
	}

//========================================================================================================
//========================================================================================================
//                                                  Drawer
//========================================================================================================
//========================================================================================================

	function drawcenter()
	{
		// ctx.restore();
		ctx.fillStyle = 'white';
		ctx.fillRect(canvas.width / 2 - ctx.lineWidth / 2, 0, canvas.width / 300, canvas.height);
		
		ctx.beginPath();
		// ctx.lineWidth = 5;
		ctx.arc(canvas.width / 2, canvas.height / 2, circleRadius, 0, 2 * Math.PI);
		ctx.strokeStyle = 'white'; // couleur de dessin
		ctx.stroke(); // dessin du contour

		ctx.font = canvas.width * 0.1 + "px Arial";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(myScore, canvas.width/4, canvas.height/8);
		ctx.fillText(hisScore, canvas.width/1.25, canvas.height/8);
	}

	function drawPaddle() {
		ctx.fillStyle = 'white';
		ctx.fillRect(paddleX, paddleY, paddleWidth, paddleHeight);
		ctx.fillRect(canvas.width - paddleX - paddleWidth, oPaddleY, paddleWidth, paddleHeight);
	}

	function drawball()
	{
		ctx.beginPath();
		ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
		// ctx.lineWidth = 2;
		ctx.fillStyle = 'red ';
		ctx.fill();
	}


//========================================================================================================
//========================================================================================================
//                                                  Loop
//========================================================================================================
//========================================================================================================

matchmaking();
// while (!gameId)
// 	;


function draw(timestamp)
{
	if (gameId === 0 )
	{
		requestAnimationFrame(draw)
		return;
	}

		const deltaTime = timestamp - lastUpdateTime;
		lastUpdateTime = timestamp;

		ballX += vX * deltaTime * canvas.width;
		ballY += vY * deltaTime * canvas.width;

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawPaddle();
		drawcenter();
		drawball();
		is_collision();
		is_out();
		requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

//========================================================================================================
//========================================================================================================
//                                             Logical Part
//========================================================================================================
//========================================================================================================

	function updateVector()
	{
		const relativeBallY = ballY - (paddleY + paddleHeight / 2);
		const normalizedRelativeBallY = relativeBallY / (paddleHeight / 2);
		const bounceAngle = normalizedRelativeBallY * maxBounceAngle;

		vY = vX * Math.sin(-bounceAngle);
		if (vX < 0)
			vX = -vX; 
	}


	function updatePaddlePosition(newY)
	{
		if (newY >= 0 && newY <= canvas.height - paddleHeight)
			paddleY = newY;
	}

	function is_collision()
	{
		if (ballX <= paddleX + paddleWidth + ballRadius)
		{
			if (ballY <= paddleY + paddleHeight + ballRadius && ballY >= paddleY - ballRadius)//touch paddle
			{
				if (ballX +  ballRadius > paddleX && ballX - ballRadius < paddleX + paddleWidth)
				{
					console.log("hehe here")
					ballX = paddleX + paddleWidth + ballRadius;
				}
				updateVector();
			}
			send_info();
			return ;
		}
		if (ballY - ballRadius - 2 <= 0 || ballY + ballRadius + 2 >= canvas.height) //touch up or down wall
		{
			vY = -vY;
			// send_info();
		}
		else if (ballX + ballRadius + 2 >= canvas.width) //touch right wall
		{
			vX = -vX;
			// send_info();
		}
	}

	function is_out()
	{
		if (ballX < 0)
		{
			if (ballY <= paddleY + paddleHeight + ballRadius && ballY >= paddleY - ballRadius)
			{
				console.log('true hehe');
				ballX = paddleX + paddleWidth + ballRadius;
				updateVector();
				return ;
			}
			ballX = canvas.width / 2;
			ballY = canvas.height / 2;
			vX = 0;
			vY = 0;
			hisScore += 1;
			send_point();
			// send_forced_info();
		}

	}



//========================================================================================================
//========================================================================================================
//                                                  Listener
//========================================================================================================
//========================================================================================================


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
		send_paddle_info();
    });

    document.addEventListener("touchmove", event => {
        const touchY = event.touches[0].pageY;

        // if (!lastTouchY)
		// {
		// 	vX = -0.01;
        //     lastTouchY = touchY;
        //     return;
        // }
        const newY = touchY > lastTouchY ? paddleY - (lastTouchY - touchY) : paddleY + (touchY - lastTouchY);
        updatePaddlePosition(newY);
        lastTouchY = touchY;
		send_paddle_info();
    });

	document.addEventListener("keydown", event => {
		// console.log(event.code);
		if (event.code === "ArrowUp")
		{
			if ((paddleY - paddleSpeed) > 0)
		  		paddleY -= paddleSpeed; // déplacer la raquette vers le haut
			send_paddle_info();
		}
		else if (event.code === "ArrowDown")
		{
			if (paddleY + paddleSpeed < canvas.height - paddleHeight)
				paddleY += paddleSpeed; // déplacer la raquette vers le bas
			send_paddle_info();
		}
		else if (event.code === "Space")//space
		{
			console.log('vx change to -1');
			vX = -0.0001;

			// ballSpeed = 0.0001;
			vY = 0;
			send_forced_info();
			// vX = 0.0001;
		}
		else if (event.code === "KeyE")
		{
			// console.log('vx change to -1');
			vX = 0;
			vY = 0;
			ballX = canvas.width / 2;
			ballY = canvas.height / 2;
			send_forced_info();
		}
		else if (event.code === "KeyQ" )
		{
			if (vX < 0.003 * canvas.width && vX > -0.003 * canvas.width)
			{
				if (vX > 0)
					vX += 0.0001;
				else
					vX -= 0.0001;
			}
			send_forced_info();
			// console.log(`vx = ${vX}`);
		}
		else if (event.code === "KeyR")
		{
			paddleY = 0;
			paddleHeight = canvas.height;
			setTimeout(() => {
				// code à exécuter après 5 secondes
				paddleHeight = canvas.height * 0.25;
				paddleY = canvas.height / 2 - paddleHeight / 2;
				console.log('Cinq secondes se sont écoulées.');
			  }, 5000);
		}
	});

}