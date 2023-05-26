import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

@WebSocketGateway({ cors: true })
export class PongGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;

	private clients: Record<string, Socket> = {};

	private waitingClients: Set<Socket> = new Set();
	// private waitingClients: Set<Socket> = new Set(); // Utilisateurs cherchant un match
	private games: Map<string, Socket[]> = new Map(); // Parties en cours, identifiées par un ID

	afterInit(server: Server)
	{
		console.log('PongGateway initialized');
	}

	handleConnection(client: Socket, ...args: any[])
	{
		console.log(`Client connected: ${client.id}`);

		const clientId = client.id;
    	this.clients[clientId] = client;
		// client.emit('pong:clientId', clientId);
		client.emit('pong:clientId', client.id);

		console.log(`Total connected clients: ${Object.keys(this.clients).length}`);
	}

	handleDisconnect(client: Socket)
	{
		console.log(`Client disconnected: ${client.id}`);
		this.waitingClients.delete(client);
		delete this.clients[client.id];
		console.log(`Total connected clients: ${Object.keys(this.clients).length}`);
	}

	@SubscribeMessage('pong:matchmaking')
	addMatchmaking(client: Socket, payload: any): void
	{
		console.log("matchmaking");
		console.log(payload);
		// this.waitingClients.add(client);
		this.waitingClients.add(client);
		console.log("Adding client to waiting list...");
		if (this.waitingClients.size >= 2) {
			console.log("Creating new game...");
			const players = Array.from(this.waitingClients).slice(0, 2);
			players.forEach((player) => {
				this.waitingClients.delete(player);
			});
			const gameId = uuidv4();
			this.games.set(gameId, players);
			players.forEach((player) => {
				player.join(gameId);
				console.log(`Player ${player.id} joined game ${gameId}`);
			});
			players.forEach((player) => {
				// const playersIds = game.map(socket => socket.id);
				player.emit('pong:gameId', gameId);
			});
		}
		// console.log(`from: ${client.id}`);
	}

	// @SubscribeMessage('pong:message')
	// handleMessage(client: Socket, payload: any): void
	// {
	// 	console.log(`from: ${client.id}`);
	// 	console.log(payload);
		
	// 	const game = this.games.get(payload.gameId);
	// 	const playersIds = game.map(socket => socket.id);
	// 	// const players = Object.keys(game);

	// 	// if (Object.keys(this.clients).length === 2)
	// 	// {
	// 		// const clientIds = Object.keys(this.clients);
	// 		// console.log(`id of 0= ${clientIds[0]}`);
			
	// 		// payload.ballX
	// 		// payload.ballY
	// 		// payload.
			
	// 		if (clientIds[0] === payload.id)
	// 		{
	// 			// console.log("client 0 true");
	// 			if (payload.ballX <= payload.width / 2)
	// 				this.clients[clientIds[1]].emit('pong:info', payload);
	// 		}
	// 		else if (clientIds[1] === payload.id)
	// 		{
	// 			if (payload.ballX < payload.width / 2)
	// 				this.clients[clientIds[0]].emit('pong:info', payload);
	// 			// console.log("client 0 true");
	// 		}
	// 	// }
	// 	console.log("END OF HANDLE");
	// }

	@SubscribeMessage('pong:message')
	handleMessage(client: Socket, payload: any): void
	{
		console.log(`from: ${client.id}`);
		console.log(payload);
		
		const game = this.games.get(payload.gameId);
		const playersIds = game.map(socket => socket.id);
			if (playersIds[0] === payload.id)
			{
				if (payload.ballX <= payload.width / 2)
					this.clients[playersIds[1]].emit('pong:info', payload);
			}
			else if (playersIds[1] === payload.id)
			{
				if (payload.ballX < payload.width / 2)
					this.clients[playersIds[0]].emit('pong:info', payload);
			}
		console.log("END OF HANDLE");
	}

	// @SubscribeMessage('pong:forced')
	// forcedMessage(client: Socket, payload: any): void
	// {
	// 	console.log(`from: ${client.id}`);
	// 	console.log(payload);
		
	// 	if (Object.keys(this.clients).length === 2)
	// 	{
	// 		const clientIds = Object.keys(this.clients);
	// 		console.log(`id of 0= ${clientIds[0]}`);

	// 		if (clientIds[0] === payload.id)
	// 		{
	// 				this.clients[clientIds[1]].emit('pong:info', payload);
	// 		}
	// 		else if (clientIds[1] === payload.id)
	// 		{
	// 				this.clients[clientIds[0]].emit('pong:info', payload);
	// 		}
	// 	}
	// 	console.log("END OF HANDLE");
	// }

	@SubscribeMessage('pong:forced')
	forcedMessage(client: Socket, payload: any): void
	{
		console.log(`from: ${client.id}`);
		console.log(payload);

		const game = this.games.get(payload.gameId);
		const playersIds = game.map(socket => socket.id);

		console.log(`id of 0= ${playersIds[0]}`);

		if (playersIds[0] === payload.id)
		{
				this.clients[playersIds[1]].emit('pong:info', payload);
		}
		else if (playersIds[1] === payload.id)
		{
				this.clients[playersIds[0]].emit('pong:info', payload);
		}
		console.log("END OF HANDLE");
	}

	// @SubscribeMessage('pong:paddle')
	// handlePaddle(client: Socket, payload: any): void
	// {
	// 	console.log(`from: ${client.id}`);
	// 	console.log(payload);
		
	// 	if (Object.keys(this.clients).length === 2)
	// 	{
	// 		const clientIds = Object.keys(this.clients);
	// 		console.log(`id of 0= ${clientIds[0]}`);

	// 		if (clientIds[0] === payload.id)
	// 		{
	// 			this.clients[clientIds[1]].emit('pong:paddle', payload);
	// 		}
	// 		else if (clientIds[1] === payload.id)
	// 		{
	// 			this.clients[clientIds[0]].emit('pong:paddle', payload);
	// 		}
	// 	}
	// 	console.log("END OF HANDLE");
	// }

	@SubscribeMessage('pong:paddle')
	handlePaddle(client: Socket, payload: any): void
	{
		console.log(`from: ${client.id}`);
		console.log(payload);

		const game = this.games.get(payload.gameId);
		const playersIds = game.map(socket => socket.id);

		console.log(`id of 0= ${playersIds[0]}`);

		if (playersIds[0] === payload.id)
		{
			this.clients[playersIds[1]].emit('pong:paddle', payload);
		}
		else if (playersIds[1] === payload.id)
		{
			this.clients[playersIds[0]].emit('pong:paddle', payload);
		}
		console.log("END OF HANDLE");
	}

	@SubscribeMessage('pong:point')
	handlePoint(client: Socket, payload: any): void
	{
		const game = this.games.get(payload.gameId);
		const playersIds = game.map(socket => socket.id);
		console.log(`id of 0= ${playersIds[0]}`);

		if (playersIds[0] === payload.id)
		{
			this.clients[playersIds[1]].emit('pong:point', payload);
		}
		else if (playersIds[1] === payload.id)
		{
			this.clients[playersIds[0]].emit('pong:point', payload);
		}
	}

	@SubscribeMessage('pong:name')
	getName(client: Socket, payload: any): void
	{
		const game = this.games.get(payload.gameId);
		const playersIds = game.map(socket => socket.id);
		
		console.log(`name of client= ${payload.name}`);

		if (playersIds[0] === payload.id)
		{
			this.clients[playersIds[1]].emit('pong:name', payload.name);
		}
		if (playersIds[1] === payload.id)
		{
			this.clients[playersIds[0]].emit('pong:name', payload.name);
		}
	}

}//end of Web Socket Gateway
