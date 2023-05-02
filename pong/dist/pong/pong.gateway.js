"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PongGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const uuid_1 = require("uuid");
let PongGateway = class PongGateway {
    constructor() {
        this.clients = {};
        this.waitingClients = new Set();
        this.games = new Map();
    }
    afterInit(server) {
        console.log('PongGateway initialized');
    }
    handleConnection(client, ...args) {
        console.log(`Client connected: ${client.id}`);
        const clientId = client.id;
        this.clients[clientId] = client;
        client.emit('pong:clientId', client.id);
        console.log(`Total connected clients: ${Object.keys(this.clients).length}`);
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
        this.waitingClients.delete(client);
        delete this.clients[client.id];
        console.log(`Total connected clients: ${Object.keys(this.clients).length}`);
    }
    addMatchmaking(client, payload) {
        console.log("matchmaking");
        console.log(payload);
        this.waitingClients.add(client);
        console.log("Adding client to waiting list...");
        if (this.waitingClients.size >= 2) {
            console.log("Creating new game...");
            const players = Array.from(this.waitingClients).slice(0, 2);
            players.forEach((player) => {
                this.waitingClients.delete(player);
            });
            const gameId = (0, uuid_1.v4)();
            this.games.set(gameId, players);
            players.forEach((player) => {
                player.join(gameId);
                console.log(`Player ${player.id} joined game ${gameId}`);
            });
            players.forEach((player) => {
                player.emit('pong:gameId', gameId);
            });
        }
    }
    handleMessage(client, payload) {
        console.log(`from: ${client.id}`);
        console.log(payload);
        const game = this.games.get(payload.gameId);
        const playersIds = game.map(socket => socket.id);
        if (playersIds[0] === payload.id) {
            if (payload.ballX <= payload.width / 2)
                this.clients[playersIds[1]].emit('pong:info', payload);
        }
        else if (playersIds[1] === payload.id) {
            if (payload.ballX < payload.width / 2)
                this.clients[playersIds[0]].emit('pong:info', payload);
        }
        console.log("END OF HANDLE");
    }
    forcedMessage(client, payload) {
        console.log(`from: ${client.id}`);
        console.log(payload);
        const game = this.games.get(payload.gameId);
        const playersIds = game.map(socket => socket.id);
        console.log(`id of 0= ${playersIds[0]}`);
        if (playersIds[0] === payload.id) {
            this.clients[playersIds[1]].emit('pong:info', payload);
        }
        else if (playersIds[1] === payload.id) {
            this.clients[playersIds[0]].emit('pong:info', payload);
        }
        console.log("END OF HANDLE");
    }
    handlePaddle(client, payload) {
        console.log(`from: ${client.id}`);
        console.log(payload);
        const game = this.games.get(payload.gameId);
        const playersIds = game.map(socket => socket.id);
        console.log(`id of 0= ${playersIds[0]}`);
        if (playersIds[0] === payload.id) {
            this.clients[playersIds[1]].emit('pong:paddle', payload);
        }
        else if (playersIds[1] === payload.id) {
            this.clients[playersIds[0]].emit('pong:paddle', payload);
        }
        console.log("END OF HANDLE");
    }
    handlePoint(client, payload) {
        const game = this.games.get(payload.gameId);
        const playersIds = game.map(socket => socket.id);
        console.log(`id of 0= ${playersIds[0]}`);
        if (playersIds[0] === payload.id) {
            this.clients[playersIds[1]].emit('pong:point', payload);
        }
        else if (playersIds[1] === payload.id) {
            this.clients[playersIds[0]].emit('pong:point', payload);
        }
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], PongGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('pong:matchmaking'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], PongGateway.prototype, "addMatchmaking", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('pong:message'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], PongGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('pong:forced'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], PongGateway.prototype, "forcedMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('pong:paddle'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], PongGateway.prototype, "handlePaddle", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('pong:point'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], PongGateway.prototype, "handlePoint", null);
PongGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: true })
], PongGateway);
exports.PongGateway = PongGateway;
//# sourceMappingURL=pong.gateway.js.map