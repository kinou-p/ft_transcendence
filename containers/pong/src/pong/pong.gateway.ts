/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   pong.gateway.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: apommier <apommier@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/06/19 15:18:38 by apommier          #+#    #+#             */
/*   Updated: 2023/06/24 17:20:24 by apommier         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

//0.0001

import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';


//========================================================================================================
//========================================================================================================
//                                     Connection/Disconnection
//========================================================================================================
//========================================================================================================

@WebSocketGateway({ cors: true })
export class PongGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;

	private clients: Record<string, Socket> = {};

	private waitingClients: Set<{ client: Socket, option: number }> = new Set();
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
		console.log(`Normal disconnected: ${client.id}`);

		this.waitingClients.forEach((item) => {
			if (item.client === client)
				this.waitingClients.delete(item);
		  });

		  // Delete the socket from the 'games' map
		  this.games.forEach((sockets, gameId) => {
			const index = sockets.indexOf(client);
			if (index !== -1)
			{
				if (index === 0)
				{
					console.log("emit boy1")
					sockets[1].emit("pong:win")
					// sockets[0].emit("/win")
				}
				else
				{
					console.log("emit boy2")
					sockets[0].emit("pong:win")
					// sockets[1].emit("/win")
				}
				this.games.delete(gameId);
				delete this.clients[client.id];
			}
		})

		console.log(`Total connected clients: ${Object.keys(this.clients).length}`);
	}


	@SubscribeMessage('pong:disconnect')
	disconnectClient(client: Socket, payload: any): void {
		console.log("disconnect forced client= ", client.id)
		
		for (const key in this.clients) {
			if (this.clients.hasOwnProperty(key) && this.clients[key] === client) 
				delete this.clients[key];
		}
		  // Delete the socket from the 'waitingClients' set
		  this.waitingClients.forEach((item) => {
			if (item.client === client)
				this.waitingClients.delete(item);
		  });

		  // Delete the socket from the 'games' map
		  this.games.forEach((sockets, gameId) => {
			const index = sockets.indexOf(client);
			if (index !== -1)
			{
				if (index === 0)
				{
					console.log("emit boy1")
					sockets[1].emit("pong:win")
					// sockets[0].emit("/win")
				}
				else
				{
					console.log("emit boy2")
					sockets[0].emit("pong:win")
					// sockets[1].emit("/win")
				}
				this.games.delete(gameId);
				delete this.clients[client.id];
			}
			
		})
	}

//========================================================================================================
//========================================================================================================
//                                           Matchmaking
//========================================================================================================
//========================================================================================================

@SubscribeMessage('pong:matchmaking')
addMatchmaking(client: Socket, payload: any): void {
  console.log("matchmaking");
  console.log(payload);
  console.log(`option= ${payload.option}`);
  // Add the client to the waitingClients set along with their chosen option
  this.waitingClients.add({ client, option: payload.option });
  console.log("Adding client to waiting list...");

  // Filter the waitingClients set to find clients with the same option
  const matchingClients = Array.from(this.waitingClients).filter(
    (waitingClient) =>
      waitingClient.option === payload.option && waitingClient.client !== client
  );


  if (matchingClients.length > 0) {
    console.log("Creating new game...");
    const players = [matchingClients[0].client, client]; // Add the current client to the players array
    players.forEach((player) => {
    //   this.waitingClients.delete(
    //     this.waitingClients.find(
    //       (waitingClient) => waitingClient.client === player
    //     )
    //   );
		const matchingClient = Array.from(this.waitingClients).find(
			(waitingClient) => waitingClient.client === player
	  	);
	  	if (matchingClient) {
			this.waitingClients.delete(matchingClient);
	  	}
    });
    const gameId = uuidv4();
    this.games.set(gameId, players);
    players.forEach((player) => {
      player.join(gameId);
      console.log(`Player ${player.id} joined game ${gameId}`);
    });
	payload.gameId = gameId;
    players.forEach((player) => {
      player.emit('pong:gameId', payload);
    });
  }

  // console.log(`from: ${client.id}`);
}



//========================================================================================================
//========================================================================================================
//                                         Private Match
//========================================================================================================
//========================================================================================================



// @SubscribeMessage('pong:invite')
// createPrivateGame(client: Socket, payload: any): void {
// 	//after invite accepted ?
// 	//set the two user in a game ?

// }


@SubscribeMessage('pong:joinParty')
joinPrivateParty(client: Socket, payload: any): void {
	console.log(" join PrivateParty")
	
	const game = this.games.get(payload.gameId);
	if (game)
	{
		game.push(client);
		const playersIds = game.map(socket => socket.id);
		this.clients[playersIds[0]].emit('pong:gameId', payload);
		this.clients[playersIds[1]].emit('pong:gameId', payload);
	}
	else
	{
		console.log("emit else")
		client.emit("pong:win")
	}
		// console.log("no game ???")

}


@SubscribeMessage('pong:privateParty')
addPrivateParty(client: Socket, payload: any): void {
	console.log("addPrivateParty")

    const gameId = uuidv4();
	const players = [client];
    this.games.set(gameId, players);
	console.log("game created private")
	client.emit('pong:privateId', gameId);
	//create game 
	//emit private gameId to canvas (don't launch canvas)

}






//========================================================================================================
//========================================================================================================
//                                             In Game
//========================================================================================================
//========================================================================================================



	@SubscribeMessage('pong:power')
	sendPower(client: Socket, payload: any): void
	{
		console.log(`from: ${client.id}`);
		console.log(payload);
		
		const game = this.games.get(payload.gameId);
		const playersIds = game.map(socket => socket.id);
			if (playersIds[0] === payload.id)
					this.clients[playersIds[1]].emit('pong:power', payload);
			else if (playersIds[1] === payload.id)
					this.clients[playersIds[0]].emit('pong:power', payload);
		console.log("END OF HANDLE");
	}

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

	@SubscribeMessage('pong:myPoint')
	handleMyPoint(client: Socket, payload: any): void
	{
		const game = this.games.get(payload.gameId);
		const playersIds = game.map(socket => socket.id);
		console.log(`id of 0 mypoint= ${playersIds[0]}`);

		if (playersIds[0] === payload.id)
		{
			this.clients[playersIds[1]].emit('pong:hisPoint', payload);
			
		}
		else if (playersIds[1] === payload.id)
		{
			this.clients[playersIds[0]].emit('pong:hisPoint', payload);
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
			this.clients[playersIds[1]].emit('pong:name', payload);
		}
		if (playersIds[1] === payload.id)
		{
			this.clients[playersIds[0]].emit('pong:name', payload);
		}
	}

}//end of Web Socket Gateway
