// import { Module } from '@nestjs/common';

// @Module({})
// export class ChatModule {}

import { Module } from '@nestjs/common';
import { ChatService} from './chat.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from '../config/config.service';
import { Conv } from '../model/chat.entity';
import { Message } from '../model/chat.entity';

@Module({
  imports:
  [
	TypeOrmModule.forRoot(getTypeOrmConfig()),
	TypeOrmModule.forFeature([Conv]),
	TypeOrmModule.forFeature([Message]),
	// TypeOrmModule.forFeature([UserRepository]),
  ],
  providers:[ChatService],
  exports: [ChatService],
})
export class ChatModule {}
