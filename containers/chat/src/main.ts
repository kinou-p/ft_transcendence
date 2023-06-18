import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import { Server } from 'socket.io';
import * as socketio from 'socket.io';
import * as dotenv from 'dotenv';

dotenv.config();
console.log(process.env);

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
	cors: {
	  origin: '*',
	  methods: '*',
	//   preflightContinue: false,
	//   optionsSuccessStatus: 204,
	//   credentials: true,
	  allowedHeaders: '*',
	},
  });
// const app = await NestFactory.create(AppModule);

  const httpServer = app.getHttpServer();
  const io = new socketio.Server(httpServer);

  io.on('connection', (socket) => {
	console.log('Client connected:', socket.id);
  
	// Gestion des événements personnalisés ici
	socket.on('customEvent', (data) => {
	  console.log('Custom event received:', data);
  
	  // Exemple de réponse à un événement personnalisé
	  socket.emit('customEventResponse', { message: 'Event processed.' });
	});
  
	socket.on('disconnect', () => {
	  console.log('Client disconnected:', socket.id);
	});
  });

  await app.listen(parseInt(process.env.CHAT_PORT) || 4001);
}

bootstrap();
