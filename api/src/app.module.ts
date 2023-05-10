import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

import { loginClass } from './auth/login42';
// import { UsersService } from './users/users.service'; // in add

// import { TypeOrmModule } from '@nestjs/typeorm';
// import { getTypeOrmConfig } from './config/config.service';
// import { User } from './model/item.entity';
// import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
// import { ChatService } from './chat/chat.service';
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

//   providers: [AppService, UsersService],//in add
})
export class AppModule {}
