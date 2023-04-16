import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

@WebSocketGateway({ cors: true })
export class PongGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;

	private clients: Record<string, Socket> = {};

	afterInit(server: Server)
	{
		console.log('PongGateway initialized');
	}

	handleConnection(client: Socket, ...args: any[])
	{
		console.log(`Client connected: ${client.id}`);

		const clientId = uuidv4();
    	this.clients[clientId] = client;
		client.emit('pong:clientId', clientId);

		console.log(`Total connected clients: ${Object.keys(this.clients).length}`);
	}

	handleDisconnect(client: Socket)
	{
		console.log(`Client disconnected: ${client.id}`);

		const disconnectedClientId = Object.keys(this.clients).find(clientId => this.clients[clientId] === client);
		if (disconnectedClientId)
		{
			delete this.clients[disconnectedClientId];
			console.log(`Client disconnected: ${disconnectedClientId}`);
			console.log(`Total connected clients: ${Object.keys(this.clients).length}`);
		}

		// console.log(`Total connected clients: ${this.clients.size}`);
	}

	@SubscribeMessage('pong:message')
	handleMessage(client: Socket, payload: any): void
	{
		console.log(`from: ${client.id}`);
		console.log(payload);
		
		if (Object.keys(this.clients).length === 2)
		{
			const clientIds = Object.keys(this.clients);
			console.log(`id of 0= ${clientIds[0]}`);
			
			// payload.ballX
			// payload.ballY
			// payload.
			
			if (clientIds[0] === payload.id)
			{
				// console.log("client 0 true");
				if (payload.ballX <= payload.width / 2)
					this.clients[clientIds[1]].emit('pong:info', payload);
			}
			else if (clientIds[1] === payload.id)
			{
				if (payload.ballX < payload.width / 2)
					this.clients[clientIds[0]].emit('pong:info', payload);
				// console.log("client 0 true");
			}
		}
		console.log("END OF HANDLE");
	}

	@SubscribeMessage('pong:forced')
	forcedMessage(client: Socket, payload: any): void
	{
		console.log(`from: ${client.id}`);
		console.log(payload);
		
		if (Object.keys(this.clients).length === 2)
		{
			const clientIds = Object.keys(this.clients);
			console.log(`id of 0= ${clientIds[0]}`);
			
			// payload.ballX
			// payload.ballY
			// payload.
			
			if (clientIds[0] === payload.id)
			{
				// console.log("client 0 true");
				// if (payload.ballX <= payload.width / 2)
					this.clients[clientIds[1]].emit('pong:info', payload);
			}
			else if (clientIds[1] === payload.id)
			{
				// if (payload.ballX < payload.width / 2)
					this.clients[clientIds[0]].emit('pong:info', payload);
				// console.log("client 0 true");
			}
		}
		console.log("END OF HANDLE");
	}

	@SubscribeMessage('pong:paddle')
	handlePaddle(client: Socket, payload: any): void
	{
		console.log(`from: ${client.id}`);
		console.log(payload);
		
		if (Object.keys(this.clients).length === 2)
		{
			const clientIds = Object.keys(this.clients);
			console.log(`id of 0= ${clientIds[0]}`);

			if (clientIds[0] === payload.id)
			{
				this.clients[clientIds[1]].emit('pong:paddle', payload);
			}
			else if (clientIds[1] === payload.id)
			{
				this.clients[clientIds[0]].emit('pong:paddle', payload);
			}
		}
		console.log("END OF HANDLE");
	}

	@SubscribeMessage('pong:point')
	handlePoint(client: Socket, payload: any): void
	{
		if (Object.keys(this.clients).length === 2)
		{
			const clientIds = Object.keys(this.clients);
			console.log(`id of 0= ${clientIds[0]}`);

			if (clientIds[0] === payload.id)
			{
				this.clients[clientIds[1]].emit('pong:point', payload);
			}
			else if (clientIds[1] === payload.id)
			{
				this.clients[clientIds[0]].emit('pong:point', payload);
			}
		}
	}
}
