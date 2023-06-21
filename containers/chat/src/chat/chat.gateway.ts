import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer()
	server: Server;


	private clients: Record<string, Socket> = {};
	// private clientsNames: Record<string, Socket[]> = {};
	private clientsNames: Map<string, string[]> = new Map();
	// private games: Map<string, Socket[]> = new Map();// Chat en cours, identifiées par un ID



	afterInit(server: Server)
	{
		console.log('ChatGateway initialized');
	}
	

	handleConnection(client: Socket, ...args: any[])
	{
		console.log(`Client connected: ${client.id}`);
		// console.log(`Client connected: ${args[0].username}`);

		// const clientId = args[0].username;
		const clientId = client.id;
    	this.clients[clientId] = client;
		// client.emit('chat:clientId', clientId);
		console.log(`Total connected clients: ${Object.keys(this.clients).length}`);
	}

	handleDisconnect(client: Socket)
	{
		console.log(`Client want to deco: ${client.id}`);

		// const disconnectedClientId = Object.keys(this.clients).find(clientId => this.clients[clientId] === client);
		const disconnectedClientId = client.id
		if (disconnectedClientId)
		{
			this.clientsNames.forEach((clientArray, clientName) =>
			{
				// clientArray.
				console.log(`Clients with name ${clientName}:`);
				console.log(`array= ${clientArray}`)
				console.log(`lenght= ${clientArray.length}`)
				clientArray.forEach((targetClient, index) =>
				{
					console.log(`index= ${index}`)
					console.log(`lenght2= ${clientArray.length}`)
					if (targetClient === disconnectedClientId)
					{
						console.log("find it")
						console.log(`target= ${clientArray[index]}`)
						// delete this.clientsNames[clientName][index];
						if (clientArray.length === 1)
						{
							console.log("delete true")
							this.clientsNames.delete(clientName);
							return 
						}
						else
						{
							const newArray = clientArray.filter(item => item !== targetClient);
							this.clientsNames.delete(clientName);
							this.clientsNames.set(clientName, newArray);
						}
							// 
						// this.clientsNames[clientName].delete(index);
						// else
							
						return ;
					}
				});
			});
			delete this.clients[disconnectedClientId];
			// delete this.clientsNames;
			console.log(`Client disconnected: ${disconnectedClientId}`);
			console.log(`Total connected clients: ${Object.keys(this.clients).length}`);
		}
	}	
	
	@SubscribeMessage('connection')
	connectClient(client: any, payload: any): void {
		console.log("connect client")
		console.log(`connect name: ${payload.username}`);
		if (this.clientsNames.has(payload.username)) {
			console.log("get it")
			const clientArray = this.clientsNames.get(payload.username); // Retrieve the array
			clientArray.push(client.id); // Add the new client to the array
		  } else {
			console.log("create")
			this.clientsNames.set(payload.username, [client.id]); // Create a new array with the new client as the value
		  }
  }

//   @SubscribeMessage('socket.io')
//   socketConnect(client: any, payload: any): void {
// 	console.log("/socket.io")
// }

@SubscribeMessage('ban')
banUser(client: any, payload: any): void {
	if (!this.clientsNames.has(payload.username))
	{
		console.log("No user found.");
		return;
	}
	const bannedClients = this.clientsNames.get(payload.username);
	bannedClients.forEach(client => {
		console.log("Banning client:", client);
		// Perform ban operation on each client, e.g., emit a 'ban' event
		console.log("clietn socket=", this.clients[client])
		this.clients[client].emit('ban', payload);
	  });
	//   console.log("/ban")
//   console.log("in ban username=", payload.username)
//   if (!this.clientsNames[payload.username])
//   {
// 	console.log("no user ??")
// 	return ;	
//   }
// 	this.clientsNames[payload.username].forEach()
// 	console.log("client=", this.clientsNames)
//   this.clients[payload.username].emit('ban', payload)
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
		console.log("Banning client:", client);
		// Perform ban operation on each client, e.g., emit a 'ban' event
		console.log("clietn socket=", this.clients[client])
		this.clients[client].emit('mute', payload);
	});
	console.log("/mute")
}
  

	@SubscribeMessage('sendMessage')
	handleMessage(client: Socket, payload: any): void {
	//   console.log(`message received: ${payload}`);
	//   console.log(`message sender: ${payload.sender}`);
	//   console.log(`client id: ${client.id}`);
	//   console.log(`conversation ID: ${payload.convId}`);
	//   console.log(`members: ${payload.members}`);
	
	  this.clientsNames.forEach((clientArray, clientName) =>
	  {
		// console.log(`		5Clients with name ${clientName}:`);
		if (payload.members.includes(clientName))
		{
			clientArray.forEach((targetClient, index) =>
			{
			//   console.log(`client id: ${client.id}`);
			//   console.log(`target: ${targetClient}`);
			//   console.log(`target id: ${targetClient}`);
			  if (targetClient && targetClient !== client.id)
			  {
				// console.log("Sending to someone");
				// console.log(`index= ${index}`);
				// console.log(`target: ${targetClient}`); // Perform actions on each target client
				this.clients[targetClient].emit('message', payload)

			  }
			  else {
				console.log("not sending");
			  }
			});
		}
	});
	}


	}



