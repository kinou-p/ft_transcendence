import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class PongGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private clients;
    private waitingClients;
    private games;
    afterInit(server: Server): void;
    handleConnection(client: Socket, ...args: any[]): void;
    handleDisconnect(client: Socket): void;
    addMatchmaking(client: Socket, payload: any): void;
    handleMessage(client: Socket, payload: any): void;
    forcedMessage(client: Socket, payload: any): void;
    handlePaddle(client: Socket, payload: any): void;
    handlePoint(client: Socket, payload: any): void;
}
