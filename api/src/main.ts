import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(3000);
// }
// bootstrap();


async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		cors: {
		  origin: '*',
		  methods: '*',
		//   preflightContinue: false,
		//   optionsSuccessStatus: 204,
		  credentials: true,
		  allowedHeaders: '*',
		},
	  });
	app.use(
		session({
		  secret: 'your_secret_key',
		  resave: false,
		  saveUninitialized: false,
		}),
	  );
  await app.listen(3000);
}
bootstrap();