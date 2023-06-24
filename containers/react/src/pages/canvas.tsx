// import io from 'socket.io-client';

import api from '../script/axiosApi.tsx';

// import { useEffect, useRef } from 'react';
import io from 'socket.io-client';
// const socket = io('http://192.168.1.14:4000');
// const socket = io('http://86.209.110.20:4000');
// const socket = io('http://172.29.113.91:4000');

interface GameProps {
	privateParty: boolean,
	username?: string
	gameId?: number
}

function DrawCanvas(option: number, gameParam: GameProps) {

	console.log(`option= ${option}`);
	const superpowerModifier = option & 1;  // Retrieves the superpower modifier
    const obstacleModifier = (option >> 1) & 1;  // Retrieves the obstacle modifier
    const speedModifier = (option >> 2) & 1;  // Retrieves the speed modifier

    console.log(`superpowerModifier = ${superpowerModifier}`);
    console.log(`obstacleModifier = ${obstacleModifier}`);
    console.log(`speedModifier = ${speedModifier}`);
	
	
	
	// const socketRef = useRef(null);
	// socketRef.current = io('http://localhost:4000');
	
	function launchGame()
	{
		if (!gameParam.privateParty)
		{
			console.log("laucnh matchmaking")
			matchmaking();
		}
		else if (!gameParam.gameId)
		{
			console.log("laucnh private")
			privateParty();
		}
		else
		{
			console.log("join private")
			joinPrivateParty();
		}
	}
	
	// const socket = socketRef.current
	console.log("start function");
	
	// let canvas: HTMLElement | null;
	const canvas = document.getElementById('myCanvas') as HTMLCanvasElement | null;;
	if (!canvas)
		return ;

	const ctx = canvas.getContext('2d');
	if(!ctx)
		return ;
	
	const socket = io('http://' + process.env.REACT_APP_SOCKET_URL + ':4000', { transports: ['polling'] });
	// useEffect(() => {
		// 	console.log("useeffect?????????????????")
	// 	return () => {
	// 		console.log("000000000000000000000000000000000")
	// 	  socketRef.current.disconnect();
	// 	};
	//   }, []);


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
	console.log("instant win opponent disconnect")
	// const data = {
	// 	myScore: myScore,
	// 	opScore: hisScore,
	// 	opName: opName,
	// 	opRank: opRank,
	// };

	// await api.post('/win', data);
	console.log("after request1")
	await api.post('/status', {status: 1});
	console.log("after request2")
	//disconnect ?
	running = false;
	socket.emit('pong:disconnect', {id: myId});
	console.log("before reload")
	// window.location.replace("http://" + process.env.REACT_APP_BASE_URL + "/pong");
	// window.location.reload();
	return ;
	// console.log("send all ?? win");

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
	console.log("gameId received");
	gameId = data.gameId;
	console.log("gameid = ", gameId);
	console.log("data gameid = ", data);
  
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
	  if (data.id === myId)
	  {
		console.log("myId= true")
	  	vX = 0.0001;
	  }
	  else
	  {
		console.log("myId= false")
	  	vX = -0.0001;
	  }
	} catch (error) {
	  console.log(error);
	  // Handle error here
	  return;
	}
  });

socket.on('pong:name', (data) => {
	opName = data.name;
	// if (data.myId === myId)
	// 	vX = 0.0001;
	// else
	// 	vX = -0.0001;
	console.log(`opponent Name= ${opName}`)
});

socket.on('connect', () => {
	console.log('Connected to NestJS server');
});

socket.on('pong:clientId', (data) => {
	console.log("receive id")
	myId = data;
	console.log(`id is= ${myId}`)
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

socket.on('pong:point', (data) => {
	// hisScore += 1;
	console.log("gain point");
	// if (vX != 0)
	// {
		// console.log("up point");
	myScore = data.point;
	// }
	vX = -0.0001;
	vY = 0;
	ballX = canvas.width / 2;
	ballY = canvas.height / 2;
});

socket.on('pong:hisPoint', (data) => {
	// hisScore += 1;
	console.log("myPointawdawdawdawd point");
	// if (vX != 0)
	// {
		// console.log("up point");
	hisScore = data.point;
	// }
	vX = -0.0001;
	vY = 0;
	ballX = canvas.width / 2;
	ballY = canvas.height / 2;
	// send_forced_info();
});

//========================================================================================================
//========================================================================================================
//                                       Socket EMIT			                                  
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

	function privateParty()
	{
		console.log(`id private party= ${myId}`)
		const info = {
			id: myId,
			option: option,
		};
		socket.emit('pong:privateParty', info);
	}

	function joinPrivateParty()
	{
		console.log(`id private party= ${myId}`)
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
		console.log("send point");
		const info = {
			id: myId,
			gameId: gameId,
			point: hisScore,
		}
		socket.emit('pong:point', info);
		vX = 0.0001;
	}

	function send_my_point()
	{
		if (!gameId || !canvas)
			return ;
		// console.log("send point");
		const info = {
			id: myId,
			gameId: gameId,
			point: myScore,
		}
		socket.emit('pong:myPoint', info);
		myScore++;
		vX = 0.0001;
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
			// width: canvas.width,
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
		// ctx.restore();
		if (!ctx || !canvas)
			return ;
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
		// ctx.lineWidth = 2;
		ctx.fillStyle = 'red ';
		ctx.fill();
	}

 
//========================================================================================================
//========================================================================================================
//                                           Loop
//========================================================================================================
//========================================================================================================


// while (!gameId)
// 	;

  // Define a function to stop the drawing process
  const stopDrawCanvas = async () => {
    running = false;

	console.log("stopDrawCanvas 1")

	if (gameParam.privateParty && !gameId) //delete invite
	{
		console.log("stopDrawCanvas2")
		try{
			// const info = {
				// 	id: myId,
				// 	option: option,
				// };
				// await api.post("status", {status: 1});
				await api.post("deleteInvite", {username: gameParam.username})
		}
		catch (err){
			console.log(err)
		}
	}
	socket.emit('pong:disconnect', {id: myId});
	window.location.replace("http://" + process.env.REACT_APP_BASE_URL + "/pong");
	// window.location.reload();
    // Perform any necessary cleanup tasks
    // ...
  };

async function draw(timestamp: number)
{
	console.log("turning, running= ", running);
	if (!running)
	{
		window.location.replace("http://" + process.env.REACT_APP_BASE_URL + "/pong")
		return ;
	}
	if (!gameId || !canvas )
	{
		// console.log("nogameid score= ", myScore);
		requestAnimationFrame(draw);
		return ;
	}
	if (myScore === maxScore || hisScore === maxScore)
	{
		console.log("maxScore!!!!")
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
			//disconnect ?
			socket.emit('pong:disconnect', {id: myId});

			console.log("send all ?? win");	
		}
		else
		{
			await api.post('/loss', data);
			await api.post('/status', {status: 1});
			socket.emit('pong:disconnect', {id: myId});
			//disconnect ?
			console.log("send loose");
		}
		window.location.replace("http://" + process.env.REACT_APP_BASE_URL + "/pong");
		// window.location.reload();
		return ;
	}

	const deltaTime = timestamp - lastUpdateTime;
	lastUpdateTime = timestamp;
	ballX += vX * deltaTime * canvas.width;
	ballY += vY * deltaTime * canvas.height;

	if (!ctx)
		return ;
		// requestAnimationFrame(draw);
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
	}

	function is_out()
	{
		if (!canvas)
			return ;
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
			vX = 0.0001;
			vY = 0;
			hisScore += 1;
			send_point();
			// send_forced_info();
		}
		if (ballX > (canvas.width * 1.2) && ballX - (vX * 2) > canvas.width)
		{
			console.log("ball out win point pls")
			send_my_point();
			// if (ballX > canvas.width * 2)
			// console.log("win point")
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
				// code à exécuter après 5 secondes
				paddleHeight = canvas.height * 0.25;
				paddleY = canvas.height / 2 - paddleHeight / 2;
				console.log('Cinq secondes se sont écoulées.');
			  }, 5000);
			date = new Date();
			lastPower = date.getTime();
			// console.log("date= ", date.getTime())
		}
	});

	requestAnimationFrame(draw);
	console.log("retuuuuuuuuuuurn")
	return (stopDrawCanvas);
}

export default DrawCanvas