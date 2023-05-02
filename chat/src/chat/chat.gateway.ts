import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  
	
	private clients: Record<string, Socket> = {};

	afterInit(server: Server)
	{
		console.log('ChatGateway initialized');
	}

	handleConnection(client: Socket, ...args: any[])
	{
		console.log(`Client connected: ${client.id}`);

		const clientId = uuidv4();
    	this.clients[clientId] = client;
		client.emit('chat:clientId', clientId);

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
	}	
	
	
	@SubscribeMessage('message')
	handleMessage(client: any, payload: any): string {
		return 'Hello world!';
  }
}
