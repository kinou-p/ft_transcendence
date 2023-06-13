import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as dotenv from 'dotenv';

dotenv.config();
console.log(process.env);

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
  await app.listen(parseInt(process.env.API_PORT) || 3000);
}
bootstrap();