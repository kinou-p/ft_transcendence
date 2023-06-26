import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { loginClass } from './auth/login42';
import { UsersModule } from './users/users.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports:
  [
	AuthModule,
	UsersModule,
	ChatModule,
],
controllers: [AppController],
providers: [AppService, loginClass,],
})
export class AppModule {}
