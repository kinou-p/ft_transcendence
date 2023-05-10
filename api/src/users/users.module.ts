import { Module } from '@nestjs/common';
import { UsersService} from './users.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from '../config/config.service';
import { User } from '../model/user.entity';

@Module({
  imports:
  [
	TypeOrmModule.forRoot(getTypeOrmConfig()),
	TypeOrmModule.forFeature([User]),
	// TypeOrmModule.forFeature([UserRepository]),
  ],
  providers:[UsersService],
  exports: [UsersService],
})
export class UsersModule {}
