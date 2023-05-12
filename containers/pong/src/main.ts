// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import * as cors from 'cors';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   app.enableCors({
// 	origin: 'http://localhost:8080',
// 	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
// 	allowedHeaders: ['Content-Type', 'Authorization'],
// 	credentials: true,
//   });

//   await app.listen(3000);
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import { Server } from 'socket.io';
import * as socketio from 'socket.io';

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

  await app.listen(4000);
}

bootstrap();