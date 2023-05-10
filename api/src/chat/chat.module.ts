// import { Module } from '@nestjs/common';

// @Module({})
// export class ChatModule {}

import { Module } from '@nestjs/common';
import { ChatService} from './chat.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from '../config/config.service';
import { Chat } from '../model/chat.entity';

@Module({
  imports:
  [
	TypeOrmModule.forRoot(getTypeOrmConfig()),
	TypeOrmModule.forFeature([Chat]),
	// TypeOrmModule.forFeature([UserRepository]),
  ],
  providers:[ChatService],
  exports: [ChatService],
})
export class ChatModule {}
