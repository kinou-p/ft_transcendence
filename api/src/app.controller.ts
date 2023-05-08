import { Controller, Request, Req, Get, Post, UseGuards, Redirect } from '@nestjs/common';

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

  @Redirect('http://localhost/token', 302)
  @Get('auth/login')
	async login2(@Req() request: Request) {
		const url = request.url;
		console.log("login function");
		console.log(`url = ${url}`);
		// const user = this.loginClass.Login42(url);
		const user = this.loginClass.Login42(url);
		console.log("login42 done");
		console.log(`user= ${user}`);
		const data2 = this.authService.login(user);
		const data = (await data2).access_token;
		console.log(`dataaaa = ${data}`);
		console.log("before return");
		// return { data };
		return { url: `http://localhost/token?data=${encodeURIComponent(JSON.stringify(data))}` };
	}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
	console.log("in profile get")
    return req.user;
  }

  @Get(`conversation/:id`)
  getConv(){
	
  }
}