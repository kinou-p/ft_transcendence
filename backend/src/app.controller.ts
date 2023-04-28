import { Body, Controller, Get, Post, Query, InternalServerErrorException } from '@nestjs/common';
// import { AppService } from './app.service.js';
import { UsersService } from './app.service';
import { User } from './model/item.entity';
// import { HttpService } from '@nestjs/common';
// import { HttpService } from '@nestjs/axios'
import axios from 'axios';
import { AxiosResponse } from 'axios';


@Controller()
export class AppController2 {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getHello(): string {
    return this.usersService.getHello();
  }
}

@Controller('api')
export class AppController
{
  constructor(private readonly usersService: UsersService) {}

  @Post('token')
  async getToken(@Body('code') code: string): Promise<any>
  {
	const http = axios;
	console.log(`here is the code= ${code}`);
    const data = {
      grant_type: 'authorization_code',
      client_id: 'u-s4t2ud-6d29dfa49ba7146577ffd8bf595ae8d9e5aaa3e0a9615df18777171ebf836a41',
      client_secret: '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',
      code: code,
      redirect_uri: 'http://localhost:8080/login42',
    };
	try {
		const response: AxiosResponse = await http.post('https://api.intra.42.fr/oauth/token', data);
		// console.log(`response= ${response}`);
		return response;
	}
	catch (error)
	{
		console.error(error);
		throw new InternalServerErrorException('Failed to get access token');
	}
  }

  @Post('login')
  async create(@Body() user: User)
  {
    return this.usersService.create(user);
  }
}