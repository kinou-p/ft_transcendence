// import io from 'socket.io-client';

import api from '../script/axiosApi';

// import { useEffect, useRef } from 'react';
import io from 'socket.io-client';
// const socket = io('http://192.168.1.14:4000');
// const socket = io('http://86.209.110.20:4000');
// const socket = io('http://172.29.113.91:4000');

function DrawCanvas(option) {



	console.log(`option= ${option}`);
	const superpowerModifier = option & 1;  // Retrieves the superpower modifier
    const obstacleModifier = (option >> 1) & 1;  // Retrieves the obstacle modifier
    const speedModifier = (option >> 2) & 1;  // Retrieves the speed modifier

    console.log(`superpowerModifier = ${superpowerModifier}`);
    console.log(`obstacleModifier = ${obstacleModifier}`);
    console.log(`speedModifier = ${speedModifier}`);
	
	
	
	// const socketRef = useRef(null);
	// socketRef.current = io('http://localhost:4000');
	const socket = io('http://' + process.env.REACT_APP_BASE_URL + ':4000');
	// const socket = socketRef.current
	console.log("start function");
	const canvas = document.getElementById('myCanvas');
	const ctx = canvas.getContext('2d');
	
	// useEffect(() => {
	// 	console.log("useeffect?????????????????")
	// 	return () => {
	// 		console.log("000000000000000000000000000000000")
	// 	  socketRef.current.disconnect();
	// 	};
	//   }, []);


//========================================================================================================
//========================================================================================================
//                                              Var Declaration			                                  
//========================================================================================================
//========================================================================================================

	//socket
	let myId = 0;
	let gameId = 0;
	let opName;
	let opRank;

	//general canvas
	let running = true;
	const scale = window.devicePixelRatio; 
	canvas.width = canvas.offsetWidth;
	// canvas.height = canvas.width * 0.7
	canvas.height = canvas.offsetHeight;

	//paddle var
	let paddleWidth = canvas.width * 0.01;
	let paddleHeight = canvas.height * 0.25;
	let paddleY = canvas.height / 2 - (paddleHeight / 2);
	let paddleX = canvas.width / 40;
	let paddleSpeed = canvas.height / 40;
	
	//opponent var
	let opPaddleHeight = canvas.height * 0.25;
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
	const maxScore = 5;
	
	let lastUpdateTime = performance.now();

	const maxAngle = 50;
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
			option: option,
		};
		socket.emit('pong:matchmaking', info);
	}

	// socket.on('pong:gameId', (data) => {
	// 	console.log("gameId received")
	// 	gameId = data;
	// 	// api.get('/profile');

	// 	let myName;

	// 	api.get('/profile').then((data) => {
	// 		// Faire quelque chose avec les données
	// 		console.log(data);
	// 		myName = data.data.username;
	// 		console.log(`myname= ${myName}`);
	// 	  }).catch((error) => {
	// 		console.log(error);
	// 		// exit() ;
	// 		return;
	// 	  });

	// 	const info = {
	// 		id: myId,
	// 		name: myName,
	// 		gameId: gameId,
	// 	};
	// 	console.log("emit to name")
	// 	socket.emit('pong:name', info);
	// });

	socket.on('pong:gameId', async (data) => {
		console.log("gameId received");
		gameId = data;
	  
		try {
		  let response = await api.get('/profile');
		  const myName = response.data.username;
		  response = await api.get('/rank');
		  await api.post('/status', {status: 2});
		  opRank = response.data
		  console.log(`rank= ${opRank}`);
		  console.log(`myname= ${myName}`);
	  
		  const info = {
			id: myId,
			name: myName,
			gameId: gameId,
			rank: opRank,
		  };
	  
		  console.log("emit to name");
		  socket.emit('pong:name', info);
		} catch (error) {
		  console.log(error);
		  // Handle error here
		  return;
		}
	  });

	socket.on('pong:name', (data) => {
		opName = data;
		console.log(`opponent Name= ${opName}`)
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

	
	socket.on('pong:paddle', (data) => {
		console.log("paddle info receive")
		oPaddleY = (data.paddleY / data.height) * canvas.height
	});
	
	socket.on('pong:power', (data) => {
		console.log("paddle info receive")
		
		oPaddleY = 0;
		opPaddleHeight = canvas.height;

		setTimeout(() => {
			// code à exécuter après 5 secondes
			opPaddleHeight = canvas.height * 0.25;
			oPaddleY = canvas.height / 2 - paddleHeight / 2;
			console.log('Cinq secondes se sont écoulées.');
		}, 5000);
		// oPaddleY = (data.paddleY / data.height) * canvas.height
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

	function use_power()
	{
		const info = {
			gameId: gameId,
			width: canvas.width,
			height: canvas.height,
			id: myId,
		}
		socket.emit('pong:power', info);
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
		ctx.fillRect(canvas.width - paddleX - paddleWidth, oPaddleY, paddleWidth, opPaddleHeight);
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

  // Define a function to stop the drawing process
  const stopDrawCanvas = () => {
    running = false;
    // Perform any necessary cleanup tasks
    // ...
  };

function draw(timestamp)
{
	console.log("send loose");
	if (!running)	
		return ;
	if (gameId === 0 )
	{
		requestAnimationFrame(draw);
		return ;
	}
	if (myScore === maxScore || hisScore === maxScore)
	{
		const data = {
			myScore: myScore,
			opScore: hisScore,
			opName: opName,
			opRank: opRank,
		};
		if (myScore === maxScore)
		{
			api.post('/win', data);
			api.post('/status', {status: 1});
			console.log("send win");
		}
		else
		{
			api.post('/loss', data);
			api.post('/status', {status: 1});
			console.log("send loose");
		}
		window.location.replace("http://" + process.env.REACT_APP_BASE_URL + "/pong");
		return ;
	}

	const deltaTime = timestamp - lastUpdateTime;
	lastUpdateTime = timestamp;
	ballX += vX * deltaTime * canvas.width;
	ballY += vY * deltaTime * canvas.height;

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawPaddle();
	drawcenter();
	drawball();
	is_collision();
	is_out();
	requestAnimationFrame(draw);
}



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
		if (speedModifier)
		{
			if (vX > 0)
				vX += 0.0001;
			else
				vX -= 0.0001;
		}
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
			// if ()
			vY = -vY;
			if (ballY > (canvas.height / 2))//down wall
				ballY = canvas.height - ballRadius - 2
			else
				ballY = ballRadius + 2
			// send_info();
		}
		// else if (ballX + ballRadius + 2 >= canvas.width) //touch right wall
		// {
		// 	vX = -vX;
		// 	// send_info();
		// }
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
		if (ballX > canvas.width)
		{
			console.log("win point")
			// if (ballY <= paddleY + paddleHeight + ballRadius && ballY >= paddleY - ballRadius)
			// {
			// 	console.log('true hehe');
			// 	ballX = paddleX + paddleWidth + ballRadius;
			// 	updateVector();
			// 	return ;
			// }
			// ballX = canvas.width / 2;
			// ballY = canvas.height / 2;
			// vX = 0;
			// vY = 0;
			// hisScore += 1;
			// send_point();
			// // send_forced_info();
		}

	}



//========================================================================================================
//========================================================================================================
//                                                  Listener
//========================================================================================================
//========================================================================================================

	document.addEventListener('resize', event => {
		// event.height
		// event.width
		const { clientWidth, clientHeight } = canvas.parentElement;
		console.log(`resize detected widht= ${clientWidth} height= ${clientHeight}`)
	});

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
			if (!superpowerModifier)
				return ;
			paddleY = 0;
			paddleHeight = canvas.height;
			use_power();
			setTimeout(() => {
				// code à exécuter après 5 secondes
				paddleHeight = canvas.height * 0.25;
				paddleY = canvas.height / 2 - paddleHeight / 2;
				console.log('Cinq secondes se sont écoulées.');
			  }, 5000);
		}
	});

	requestAnimationFrame(draw);
	console.log("retuuuuuuuuuuurn")
	return (stopDrawCanvas);
}

export default DrawCanvas