import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

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
  await app.listen(3000);
}
bootstrap();
