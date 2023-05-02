"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const socketio = require("socket.io");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        cors: {
            origin: '*',
            methods: '*',
            allowedHeaders: '*',
        },
    });
    const httpServer = app.getHttpServer();
    const io = new socketio.Server(httpServer);
    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);
        socket.on('customEvent', (data) => {
            console.log('Custom event received:', data);
            socket.emit('customEventResponse', { message: 'Event processed.' });
        });
        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
    await app.listen(4000);
}
bootstrap();
//# sourceMappingURL=main.js.map