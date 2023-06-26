import { useEffect } from 'react';
import api from '../script/axiosApi.tsx';
import io from 'socket.io-client';

interface GameProps {
	privateParty: boolean,
	username?: string
	gameId?: number
}

function DrawCanvas(option: number, gameParam: GameProps) {

	useEffect(() => {
		const handleBeforeUnload = async (event: { preventDefault: () => void; returnValue: string; }) => {
			try {
				await api.post("/status", {status: 1});
			} catch (err) {
				console.log(err);
			}
		};
		window.addEventListener('beforeunload', handleBeforeUnload);
		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
		};
	}, []);


	console.log(`option= ${option}`);
	const superpowerModifier = option & 1;  // Retrieves the superpower modifier
    const obstacleModifier = (option >> 1) & 1;  // Retrieves the obstacle modifier
    const speedModifier = (option >> 2) & 1;  // Retrieves the speed modifier

    console.log(`superpowerModifier = ${superpowerModifier}`);
    console.log(`obstacleModifier = ${obstacleModifier}`);
    console.log(`speedModifier = ${speedModifier}`);
	
	function launchGame()
	{
		if (!gameParam.privateParty)
			matchmaking();
		else if (!gameParam.gameId)
			privateParty();
		else
			joinPrivateParty();
	}
	
	const canvas = document.getElementById('myCanvas') as HTMLCanvasElement | null;
	if (!canvas)
		return ;

	const ctx = canvas.getContext('2d');
	if(!ctx)
		return ;
	
	const socket = io('http://' + process.env.REACT_APP_SOCKET_URL + ':4000', { transports: ['polling'] });

//========================================================================================================
//========================================================================================================
//                                        Var Declaration			                                  
//========================================================================================================
//========================================================================================================

	//socket
	let myId = 0;
	let gameId = 0;
	let opName: string
	let opRank: number;

	//general canvas
	let running = true;
	const scale = window.devicePixelRatio; 
	canvas.width = canvas.offsetWidth;
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
	let lastPower = 0;


	const maxAngle = 50;
	let maxBounceAngle = (maxAngle * Math.PI) / 180;

//========================================================================================================
//========================================================================================================
//                                       Socket ON			                                  
//========================================================================================================
//========================================================================================================

socket.on('pong:win', async () => {
	myScore = maxScore;
	await api.post('/status', {status: 1});
	running = false;
	socket.emit('pong:disconnect', {id: myId});
	return ;

});

socket.on('pong:privateId', async (data) => {
	console.log("private id = ", data)
	try{
		await api.post("/partyInvite", {username: gameParam.username, gameId: data});
	} catch(err) {
		console.log(err)
	}
});

socket.on('pong:gameId', async (data) => {
	gameId = data.gameId;
	try {
	  let response = await api.get('/profile');
	  const myName = response.data.username;
	  response = await api.get('/rank');
	  await api.post('/status', {status: 2});
	  opRank = response.data

	  const info = {
		id: myId,
		name: myName,
		gameId: gameId,
		rank: opRank,
	  };
  
	  socket.emit('pong:name', info);
	  if (data.id === myId)
	  	vX = 0.0005;
	  else
	  	vX = -0.0005;
	} catch (error) {
	  console.log(error);
	  return;
	}
  });

socket.on('pong:name', (data) => {
	opName = data.name;
});

socket.on('connect', () => {
	console.log('Connected to NestJS server');
});

socket.on('pong:clientId', (data) => {
	myId = data;
	launchGame();
});

socket.on('pong:info', (data) => {
	oPaddleY = (data.paddleY / data.height) * canvas.height//canvas.height - data.ballY;
	ballX = canvas.width - (data.ballX * (canvas.width / data.width));//- data.ballX;
	ballY = ((data.ballY / data.height) * canvas.height)//canvas.height - data.ballY;

	vX = -data.vX;
	vY = data.vY;
});

socket.on('pong:paddle', (data) => {
	oPaddleY = (data.paddleY / data.height) * canvas.height
});

socket.on('pong:power', (data) => {
	
	oPaddleY = 0;
	opPaddleHeight = canvas.height;

	setTimeout(() => {
		opPaddleHeight = canvas.height * 0.25;
		oPaddleY = canvas.height / 2 - paddleHeight / 2;
	}, 5000);
});

socket.on('pong:point', (data) => {
	myScore = data.point;
	vX = -0.0005;
	vY = 0;
	ballX = canvas.width / 2;
	ballY = canvas.height / 2;
});

socket.on('pong:hisPoint', (data) => {
	hisScore = data.point;
	vX = -0.0005;
	vY = 0;
	ballX = canvas.width / 2;
	ballY = canvas.height / 2;
});

//========================================================================================================
//========================================================================================================
//                                       Socket EMIT			                                  
//========================================================================================================
//========================================================================================================

	function matchmaking()
	{
		const info = {
			id: myId,
			option: option,
		};
		socket.emit('pong:matchmaking', info);
	}

	function privateParty()
	{
		const info = {
			id: myId,
			option: option,
		};
		socket.emit('pong:privateParty', info);
	}

	function joinPrivateParty()
	{
		const info = {
			id: myId,
			gameId: gameParam.gameId,
			option: option,
		};
		socket.emit('pong:joinParty', info);
	}
	
	function send_info()
	{
		if (!gameId || !canvas)
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
		if (!gameId || !canvas)
			return ;
		const info = {
			id: myId,
			gameId: gameId,
			point: hisScore,
		}
		socket.emit('pong:point', info);
		vX = 0.0005;
	}

	function send_my_point()
	{
		if (!gameId || !canvas)
			return ;
		const info = {
			id: myId,
			gameId: gameId,
			point: myScore,
		}
		socket.emit('pong:myPoint', info);
		myScore++;
		vX = 0.0005;
		vY = 0;
		ballX = canvas.width / 2;
		ballY = canvas.height / 2;
		send_forced_info();
	}

	function send_paddle_info()
	{
		if (!gameId || !canvas)
			return ;
		const info = {
			id: myId,
			paddleY: paddleY,
			height: canvas.height,
			gameId: gameId,
		};
		socket.emit('pong:paddle', info);
	}

	function use_power()
	{
		if (!canvas)
			return ;
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
		if (!gameId || !canvas)
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
//                                          Drawer
//========================================================================================================
//========================================================================================================

	function drawcenter()
	{
		if (!ctx || !canvas)
			return ;
		ctx.fillStyle = 'white';
		ctx.fillRect(canvas.width / 2 - ctx.lineWidth / 2, 0, canvas.width / 300, canvas.height);
		
		ctx.beginPath();
		ctx.arc(canvas.width / 2, canvas.height / 2, circleRadius, 0, 2 * Math.PI);
		ctx.strokeStyle = 'white'; // couleur de dessin
		ctx.stroke(); // dessin du contour

		ctx.font = canvas.width * 0.1 + "px Arial";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(myScore.toString(), canvas.width/4, canvas.height/8);
		ctx.fillText(hisScore.toString(), canvas.width/1.25, canvas.height/8);
	}

	function drawPaddle() {
		if (!ctx || !canvas)
			return ;
		ctx.fillStyle = 'white';
		ctx.fillRect(paddleX, paddleY, paddleWidth, paddleHeight);
		ctx.fillRect(canvas.width - paddleX - paddleWidth, oPaddleY, paddleWidth, opPaddleHeight);
	}

	function drawball()
	{
		if (!ctx)
			return ;
		ctx.beginPath();
		ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
		ctx.fillStyle = 'red ';
		ctx.fill();
	}

 
//========================================================================================================
//========================================================================================================
//                                           Loop
//========================================================================================================
//========================================================================================================

  const stopDrawCanvas = async () => {
    running = false;

	console.log("stopDrawCanvas 1")

	if (gameParam.privateParty && !gameId) //delete invite
	{
		console.log("stopDrawCanvas2")
		try{
				await api.post('/status', {status: 1});
				await api.post("deleteInvite", {username: gameParam.username})
		}
		catch (err){
			console.log(err)
		}
	}
	else 
	{
		const data = {
			myScore: myScore,
			opScore: 5,
			opName: opName,
			opRank: opRank,
		};
		await api.post('/loss', data);
	}

	socket.emit('pong:disconnect', {id: myId});
	window.location.replace("http://" + process.env.REACT_APP_BASE_URL + "/pong");
  };

async function draw(timestamp: number)
{
	if (!running)
	{
		window.location.replace("http://" + process.env.REACT_APP_BASE_URL + "/pong")
		return ;
	}
	if (!gameId || !canvas )
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
			await api.post('/win', data);
			await api.post('/status', {status: 1});
			socket.emit('pong:disconnect', {id: myId});
		}
		else
		{
			await api.post('/loss', data);
			await api.post('/status', {status: 1});
			socket.emit('pong:disconnect', {id: myId});
		}
		window.location.replace("http://" + process.env.REACT_APP_BASE_URL + "/pong");
		return ;
	}

	const deltaTime = timestamp - lastUpdateTime;
	lastUpdateTime = timestamp;
	ballX += vX * deltaTime * canvas.width;
	ballY += vY * deltaTime * canvas.height;

	if (!ctx)
		return ;
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
//                                       Logical Part
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


	function updatePaddlePosition(newY: number)
	{

		if (canvas && newY >= 0 && newY <= canvas.height - paddleHeight)
			paddleY = newY;
	}

	function is_collision()
	{
		if (!canvas)
			return ;
		if (ballX <= paddleX + paddleWidth + ballRadius)
		{
			if (ballY <= paddleY + paddleHeight + ballRadius && ballY >= paddleY - ballRadius)//touch paddle
			{
				if (ballX +  ballRadius > paddleX && ballX - ballRadius < paddleX + paddleWidth)
					ballX = paddleX + paddleWidth + ballRadius;
				updateVector();
			}
			send_info();
			return ;
		}
		if (ballY - ballRadius - 2 <= 0 || ballY + ballRadius + 2 >= canvas.height) //touch up or down wall
		{
			vY = -vY;
			if (ballY > (canvas.height / 2))//down wall
				ballY = canvas.height - ballRadius - 2
			else
				ballY = ballRadius + 2
		}
	}

	function is_out()
	{
		if (!canvas)
			return ;
		if (ballX < 0)
		{
			if (ballY <= paddleY + paddleHeight + ballRadius && ballY >= paddleY - ballRadius)
			{
				ballX = paddleX + paddleWidth + ballRadius;
				updateVector();
				return ;
			}
			ballX = canvas.width / 2;
			ballY = canvas.height / 2;
			vX = 0.0005;
			vY = 0;
			hisScore += 1;
			send_point();
		}
		if (ballX > (canvas.width * 1.2) && ballX - (vX * 2) > canvas.width)
			send_my_point();
	}



//========================================================================================================
//========================================================================================================
//                                 Key/Mouse/Finger Listener
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
        const newY = touchY > lastTouchY ? paddleY - (lastTouchY - touchY) : paddleY + (touchY - lastTouchY);

        updatePaddlePosition(newY);
        lastTouchY = touchY;
		send_paddle_info();
    });

	document.addEventListener("keydown", event => {
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
		else if (event.code === "KeyW")
		{
			let date = new Date();
			console.log("last time =", date.getTime() - lastPower)
			if (date.getTime() - lastPower < 15000)//10000 + 5000
				return ;
			if (!superpowerModifier)
				return ;
			paddleY = 0;
			paddleHeight = canvas.height;
			use_power();
			setTimeout(() => {
				paddleHeight = canvas.height * 0.25;
				paddleY = canvas.height / 2 - paddleHeight / 2;
			  }, 5000);
			date = new Date();
			lastPower = date.getTime();
		}
	});

	requestAnimationFrame(draw);
	return (stopDrawCanvas);
}

export default DrawCanvas