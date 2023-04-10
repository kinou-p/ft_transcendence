import { Body, Controller, Get, Post } from '@nestjs/common';
// import { AppService } from './app.service.js';
import { UsersService } from './app.service.js';
import { User } from './model/item.entity.js';


@Controller()
export class AppController2 {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getHello(): string {
    return this.usersService.getHello();
  }
}

@Controller('api')
export class AppController {
  constructor(private readonly usersService: UsersService) {}
//   constructor(private readonly appService: AppService) {}

  @Get('login')
  getHello(): string {
    return this.usersService.getHello();
  }
  @Post('login')
  async create(@Body() user: User) {
    return this.usersService.create(user);
  }

//   @Get('test')
//   getHello(): string {
//     return this.appService.getHello();
//   }
}

// "clean": "rm -rf /usr/src/app/src && rm -rf /usr/src/app/model && rm -rf /usr/src/app/config && rm -rf *.ts",