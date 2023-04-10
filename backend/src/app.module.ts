// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

// @Module({
//   imports: [],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}



import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService, UsersService } from './app.service.js';
import { User } from './model/item.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from './config/config.service.js';

@Module({
  imports: [
    TypeOrmModule.forRoot(getTypeOrmConfig()),
	TypeOrmModule.forFeature([User]),
	// TypeOrmModule.forFeature([UserRepository]),
  ],
  controllers: [AppController],
  providers: [AppService, UsersService],
})
export class AppModule { }