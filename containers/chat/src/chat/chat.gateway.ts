import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer()
	server: Server;

	private clients: Record<string, Socket> = {};
	private clientsNames: Map<string, string[]> = new Map();

	afterInit(server: Server)
	{
		console.log('ChatGateway initialized');
	}

	handleConnection(client: Socket, ...args: any[])
	{
		console.log(`Client connected: ${client.id}`);
		const clientId = client.id;
    	this.clients[clientId] = client;
		console.log(`Total connected clients: ${Object.keys(this.clients).length}`);
	}

	handleDisconnect(client: Socket)
	{
		const disconnectedClientId = client.id
		if (disconnectedClientId)
		{
			this.clientsNames.forEach((clientArray, clientName) =>
			{
				clientArray.forEach((targetClient, index) =>
				{
					if (targetClient === disconnectedClientId)
					{
						if (clientArray.length === 1)
						{
							this.clientsNames.delete(clientName);
							return 
						}
						else
						{
							const newArray = clientArray.filter(item => item !== targetClient);
							this.clientsNames.delete(clientName);
							this.clientsNames.set(clientName, newArray);
						}
						return ;
					}
				});
			});
			delete this.clients[disconnectedClientId];
			console.log(`Client disconnected: ${disconnectedClientId}`);
			console.log(`Total connected clients: ${Object.keys(this.clients).length}`);
		}
	}	
	
	@SubscribeMessage('connection')
	connectClient(client: any, payload: any): void {
		if (this.clientsNames.has(payload.username)) {
			const clientArray = this.clientsNames.get(payload.username);
			clientArray.push(client.id);
		  } else {
			this.clientsNames.set(payload.username, [client.id]);
		  }
  }


@SubscribeMessage('ban')
banUser(client: any, payload: any): void {
	if (!this.clientsNames.has(payload.username))
	{
		console.log("No user found.");
		return;
	}
	const bannedClients = this.clientsNames.get(payload.username);
	bannedClients.forEach(client => {
		this.clients[client].emit('ban', payload);
	  });
}

@SubscribeMessage('mute')
muteUser(client: any, payload: any): void {
	if (!this.clientsNames.has(payload.username))
	{
		console.log("No user found.");
		return;
	}
	const mutedClients = this.clientsNames.get(payload.username);
	mutedClients.forEach(client => {
		this.clients[client].emit('mute', payload);
	});
}
  

	@SubscribeMessage('sendMessage')
	handleMessage(client: Socket, payload: any): void {
	  this.clientsNames.forEach((clientArray, clientName) =>
	  {
		if (payload.members.includes(clientName))
		{
			clientArray.forEach((targetClient, index) =>
			{
			  if (targetClient && targetClient !== client.id)
				this.clients[targetClient].emit('message', payload)
			});
		}
	  });
    }
}



