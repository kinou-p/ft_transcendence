/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   pong.gateway.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: apommier <apommier@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/06/19 15:18:38 by apommier          #+#    #+#             */
/*   Updated: 2023/06/26 07:04:47 by apommier         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

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
		client.emit('pong:clientId', client.id);
		console.log(`Total connected clients: ${Object.keys(this.clients).length}`);
	}

	handleDisconnect(client: Socket)
	{
		this.waitingClients.forEach((item) => {
			if (item.client === client)
				this.waitingClients.delete(item);
		  });

		  this.games.forEach((sockets, gameId) => {
			const index = sockets.indexOf(client);
			if (index !== -1)
			{
				if (index === 0)
					sockets[1].emit("pong:win")
				else
					sockets[0].emit("pong:win")
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
		  this.waitingClients.forEach((item) => {
			if (item.client === client)
				this.waitingClients.delete(item);
		  });

		  this.games.forEach((sockets, gameId) => {
			const index = sockets.indexOf(client);
			if (index !== -1)
			{
				if (index === 0)
					sockets[1].emit("pong:win")
				else
					sockets[0].emit("pong:win")
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
  this.waitingClients.add({ client, option: payload.option });
  console.log("Adding client to waiting list...");

  const matchingClients = Array.from(this.waitingClients).filter(
    (waitingClient) =>
      waitingClient.option === payload.option && waitingClient.client !== client
  );

  if (matchingClients.length > 0) {
    console.log("Creating new game...");
    const players = [matchingClients[0].client, client];
    players.forEach((player) => {
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
}



//========================================================================================================
//========================================================================================================
//                                         Private Match
//========================================================================================================
//========================================================================================================


@SubscribeMessage('pong:joinParty')
joinPrivateParty(client: Socket, payload: any): void {
	const game = this.games.get(payload.gameId);
	if (game)
	{
		game.push(client);
		const playersIds = game.map(socket => socket.id);
		this.clients[playersIds[0]].emit('pong:gameId', payload);
		this.clients[playersIds[1]].emit('pong:gameId', payload);
	}
	else
		client.emit("pong:win")
}


@SubscribeMessage('pong:privateParty')
addPrivateParty(client: Socket, payload: any): void {
    const gameId = uuidv4();
	const players = [client];
    this.games.set(gameId, players);
	client.emit('pong:privateId', gameId);

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
		
		const game = this.games.get(payload.gameId);
		const playersIds = game.map(socket => socket.id);
			if (playersIds[0] === payload.id)
					this.clients[playersIds[1]].emit('pong:power', payload);
			else if (playersIds[1] === payload.id)
					this.clients[playersIds[0]].emit('pong:power', payload);
	}

	@SubscribeMessage('pong:message')
	handleMessage(client: Socket, payload: any): void
	{
		console.log(`from: ${client.id}`);
		
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
	}

	@SubscribeMessage('pong:forced')
	forcedMessage(client: Socket, payload: any): void
	{
		const game = this.games.get(payload.gameId);
		const playersIds = game.map(socket => socket.id);

		if (playersIds[0] === payload.id)
		{
				this.clients[playersIds[1]].emit('pong:info', payload);
		}
		else if (playersIds[1] === payload.id)
		{
				this.clients[playersIds[0]].emit('pong:info', payload);
		}
	}

	@SubscribeMessage('pong:paddle')
	handlePaddle(client: Socket, payload: any): void
	{
		const game = this.games.get(payload.gameId);
		const playersIds = game.map(socket => socket.id);
		if (playersIds[0] === payload.id)
		{
			this.clients[playersIds[1]].emit('pong:paddle', payload);
		}
		else if (playersIds[1] === payload.id)
		{
			this.clients[playersIds[0]].emit('pong:paddle', payload);
		}
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
			this.clients[playersIds[1]].emit('pong:hisPoint', payload);
		else if (playersIds[1] === payload.id)
			this.clients[playersIds[0]].emit('pong:hisPoint', payload);
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
