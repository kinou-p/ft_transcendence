import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller()
export class AppController2 {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('login')
  getHello(): string {
    return this.appService.getHello();
  }
  @Post('login')
  getHello2(): string {
    return "post";
  }
}

// "clean": "rm -rf /usr/src/app/src && rm -rf /usr/src/app/model && rm -rf /usr/src/app/config && rm -rf *.ts",