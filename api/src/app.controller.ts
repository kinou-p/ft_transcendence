import { Controller, Request, Req, Get, Post, UseGuards, Redirect, Res } from '@nestjs/common';

import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AuthService } from './auth/auth.service';
import { loginClass } from './auth/login42'
import { ChatService } from './chat/chat.service';
import { UsersService } from './users/users.service';

// import { AuthGuard } from '@nestjs/passport';
// import { Login42 } from './auth/login42'
// import { loginClass } from './auth/test'


@Controller('/api')
export class AppController {
  constructor(private authService: AuthService, 
			  private loginClass: loginClass,
			  private chatService: ChatService,
			  private userService: UsersService, ) {}

//   @Post('auth/login')
//   async login() {
// 	  const user = Login42();
// 	return this.authService.login5(user);
//   }

  @Redirect('http://localhost/token', 302)
  @Get('auth/login')
	async login2(@Req() request: Request) {
		const url = request.url;
		const user = await this.loginClass.Login42(url);
		console.log(`user in auth/login= ${user}`);
		const data = this.authService.login(user);
		console.log(`all data in api = ${data}`)
		
		const myJSON = JSON.stringify(data);
		console.log(`all data json version= ${myJSON}`)
		
		console.log(`data in api = ${(await data).access_token}`)
		const token = (await data).access_token;
		return { url: `http://localhost/token?data=${encodeURIComponent(JSON.stringify(token))}` };
		// console.log("login function");
		// console.log(`url = ${url}`);
		// const user = this.loginClass.Login42(url);
		// console.log("login42 done");
		// console.log(`user= ${user}`);
		// console.log(`dataaaa = ${data}`);
		// console.log("before return");
		// return { data };
	}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
	  const myJSON = JSON.stringify(req.user);
	  console.log(`req user api= ${req.user}`)
	  console.log(`json user api= ${myJSON}`)
	  return req.user;
	// const user = req.user;
    // const returned = {
    //   username: user.username,
    //   sub: user.sub,
    // };
	// console.log(`user in api = ${returned}`)
	// return returned;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/win')
  async addWin(@Request() req) {
	const user = await this.userService.findOne(req.user.username);
	user.win++;
	this.userService.save(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/loss')
  async addLoss(@Request() req) {
	const user = await this.userService.findOne(req.user.username);
	user.loss++;
	this.userService.save(user);
  }

//   @UseGuards(JwtAuthGuard)
//   @Post('/api/victory')
//   addVictory() {
// 	this.userService.findOneBy()
//   }
  
  @Get('/api/chat')
  async Chat(@Res() res) {
	const messages = await this.chatService.getMessages();
	res.json(messages);
  }
}