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
		if (this.clientsNames.has(payload.username)) {
			console.log("get it")
			const clientArray = this.clientsNames.get(payload.username); // Retrieve the array
			clientArray.push(client.id); // Add the new client to the array
		  } else {
			console.log("create")
			this.clientsNames.set(payload.username, [client.id]); // Create a new array with the new client as the value
		  }
		// let clientLenght = Object.keys(this.clientsNames[payload.username]).length
		// const clientArray = this.clientsNames.get(payload.username)
		// let clientLenght = clientArray.
		// console.log(`lenght= ${clientLenght}`)
		
		// this.clientsNames[payload.username][clientLenght] = this.clients[client.id];
		// console.log(`clients: ${Object.keys(this.clientsNames).length}`)
		// this.clients[clientId] = client;

		//add a new client with socket and name for key
		//payload.username
  }
  

	// @SubscribeMessage('sendMessage')
	// handleMessage(user: any, payload: any): void {
	// 	console.log(`message recceveid: ${payload}`)
	// 	console.log(`message recceveid: ${payload.sender}`)
	// 	console.log(`message recceveid: ${payload.convId}`)
	// 	console.log(`message recceveid: ${payload.members}`)

	// 	console.log(`client id: ${user.id}`)

	// 	this.clientsNames.forEach((clientArray, clientName) => {
	// 		console.log(`Clients with name ${clientName}:`);
			
	// 		// clientArray.forEach((client) => {
	// 		this.clientsNames[clientName]
	// 		// .forEach(client => {
	// 		// 	// if(client.id != user.id)
	// 		// 	// {
	// 		// 		console.log("send to someone")
	// 		// 		console.log(client); // Perform actions on each client
	// 		// 		// clients.emit('message', payload)
	// 		// 		client.emit('message')
	// 		// 	// }
	// 		// });
			
	// 		// .forEach((client) => {
	// 			// if(client.id != user.id)
	// 			// {
	// 			// 	console.log("send to someone")
	// 			// 	console.log(client); // Perform actions on each client
	// 			// 	// clients.emit('message', payload)
	// 			// 	client.emit('message')
	// 			// }
	// 		});
	// 	  };

	@SubscribeMessage('sendMessage')
	handleMessage(client: Socket, payload: any): void {
	//   console.log(`message received: ${payload}`);
	  console.log(`message sender: ${payload.sender}`);
	  console.log(`client id: ${client.id}`);
	  console.log(`conversation ID: ${payload.convId}`);
	  console.log(`members: ${payload.members}`);
	
	  this.clientsNames.forEach((clientArray, clientName) =>
	  {
		console.log(`		5Clients with name ${clientName}:`);
		if (payload.members.includes(clientName))
		{
			clientArray.forEach((targetClient, index) =>
			{
			  console.log(`client id: ${client.id}`);
			  console.log(`target: ${targetClient}`);
			  console.log(`target id: ${targetClient}`);
			  if (targetClient && targetClient !== client.id)
			  {
				console.log("Sending to someone");
				console.log(`index= ${index}`);
				console.log(`target: ${targetClient}`); // Perform actions on each target client
				// targetClient.emit('message')
				// this.clientsNames[clientName].emit('message')
				// this.clientsNames["apommier"].emit('message')
				this.clients[targetClient].emit('message', payload)
				// console.log(test)
				// console.log(test)
				// this.clientsNames[clientName][index].emit('message');
				// const socket = this.server.sockets.sockets.get(targetClient.id);
				// if (socket) {
				//   socket.emit('message', payload);
				// } else {
				//   console.log(`Socket with ID ${client.id} not found.`);
				// }
				// targetClient.emit('message', payload);
				// targetClient.emit('message', payload);
			  }
			  else {
				console.log("not sending");
			  }
			});
		}
	});
	}


	}




		// for (let key in this.clientsNames) {
		// 	if (payload.members.includes(key)) {
		// 		console.log("Key exists in the array");
		// 		// if (key !== payload.sender)
		// 		// {
		// 			for (let key2 in this.clientsNames[key])
		// 			{
		// 				if (client.id !== this.clientsNames[key][key2])
		// 				{
		// 					console.log("send to someone")
		// 					this.clientsNames[key][key2].emit('message', payload)
		// 				}
		// 			}
		// 		// }
		// 		//if member socket different from mine
		// 			//send
		// 	  } else {
		// 		console.log("Key does not exist in the array");
		// 	  }
			//if key is in member
				
			// let socket = this.clients[key];
			// console.log("Clé:", key);
			// console.log("Socket:", socket);
		// }
		//		payload.convId // conv user instead ? 
		//find user to send message to 
		//const res = {
			//convId: payload.convId
			//sender: payload.sender

		// }
		//while (user of conv)//how to get conv user
			// if (user connected)
				//send res to user
//   }

