import { Controller, Request, Req, Get, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';

// import { Login42 } from './auth/login42'
import { loginClass } from './auth/login42'


@Controller('/api')
export class AppController {
  constructor(private authService: AuthService, 
			  private loginClass: loginClass ) {}

//   @Post('auth/login')
//   async login() {
// 	  const user = Login42();
// 	return this.authService.login(user);
//   }

  @Get('auth/login')
	  async login2(@Req() request: Request) {
		const url = request.url;
		console.log("login function");
		console.log(`url = ${url}`);
		// const user = this.loginClass.Login42(url);
		const user = this.loginClass.Login42(url);
	  return this.authService.login(user);
	}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get(`conversation/:id`)
  getConv(){
	
  }
}