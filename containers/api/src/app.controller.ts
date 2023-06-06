import { Controller, Request, Req, Get, Post, UseGuards, Redirect, Res, Body } from '@nestjs/common';

import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AuthService } from './auth/auth.service';
import { loginClass } from './auth/login42'
import { ChatService } from './chat/chat.service';
import { UsersService } from './users/users.service';

import { MatchLog } from './model/user.entity'
import { generate } from 'rxjs';
import { generateQRcode } from './users/2fa';

// import { initStorage, getUser, setUser } from './storage';

// import { AuthGuard } from '@nestjs/passport';
// import { Login42 } from './auth/login42'
// import { loginClass } from './auth/test'


@Controller('/api')
export class AppController {
  constructor(private authService: AuthService, 
			  private loginClass: loginClass,
			  private chatService: ChatService,
			  private userService: UsersService, ) {}

	kFactor = 36;
	scaleFactor = 400;

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
	}

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@Request() req) {
	  const myJSON = JSON.stringify(req.user);
	  console.log(`req user api= ${req.user}`)
	  console.log(`json user api= ${myJSON}`)
	  return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user')
  async getUser( @Body() data: any) {
	return await this.userService.findOne(data.username);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/win')
  async addWin(@Request() req, @Body() data: any) {
	const user = await this.userService.findOne(req.user.username);
	user.win++;
	const Esp = 1 / (1 + Math.pow(10, (data.opRank - user.rank) / this.scaleFactor))
	const newRank = user.rank + this.kFactor * (1 - Esp);

	user.rank = newRank;
	console.log(`win new rank= ${newRank}`);
	console.log(`data win = ${data}`)

	const newMatch = new MatchLog;
	newMatch.myScore = data.myScore;
	newMatch.opScore = data.opScore;
	newMatch.opponent = data.opName;
	newMatch.parent = user;

	await this.userService.saveChild(user, newMatch);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/loss')
  async addLoss(@Request() req, @Body() data: any) {
	const user = await this.userService.findOne(req.user.username);
	user.loss++;

	const Esp = 1 / (1 + Math.pow(10, (data.opRank - user.rank) / this.scaleFactor))
	const newRank = user.rank + this.kFactor * (0 - Esp);
	
	user.rank = newRank;
	console.log(`loss new rank= ${newRank}`);
	console.log(`data loss = ${data}`)

	const newMatch = new MatchLog;
	newMatch.myScore = data.myScore;
	newMatch.opScore = data.opScore;
	newMatch.opponent = data.opName;
	newMatch.parent = user;

	await this.userService.saveChild(user, newMatch);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/rank')
  async getRank(@Request() req)
  {
	const user = await this.userService.findOne(req.user.username);
	return user.rank;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/2fa')
  async get2fa(@Request() req)
  {
	const user = await this.userService.findOne(req.user.username);
	return user.doubleAuth;
  }


  @UseGuards(JwtAuthGuard)
  @Get('/QRcode')
  async createQrCode(@Request() req)
  {
	return (await generateQRcode(req));
  }

  @UseGuards(JwtAuthGuard)
  @Post('/quit')
  async setOffline(@Request() req) {
	
	const user = await this.userService.findOne(req.user.username);

	user.status = 0;
	await this.userService.save(user);
	console.log("User quit");
  }

  @Post('/conv')
  async createConv(@Request() req, @Body() data: any) {
	///create conv and return it ? id?
	console.log(`data post /conv= ${data}`);
	// let test = {id: 2, members: "cc"};
	return await this.chatService.createConv(data);
	// res.json(messages);
  }

//   @UseGuards(JwtAuthGuard)
  @Get('/conv')
  async getConv(@Request() req, @Body() data: any) {
	///create conv and return it ? id?
	// console.log(`data get /conv= ${data}`);
	// let test = {id: 2, members: "cc"};

	// let tab = [data.member, "test"];
	// console.log(`tab= ${tab}`);
	return await this.chatService.getConv(data.member);
	// return await this.chatService.getConv(req.user.username);
	
	
	// res.json(messages);
  }

//   @UseGuards(JwtAuthGuard)
  @Post('/message')
  async postMessage(@Request() req, @Body() data: any) {
	//if i can post post ?
	let message = 
	{
		convid: data.convId,
		sender: data.sender,
		text: data.text,
		// createdAt: null,
		id: null,
	}
	console.log(data);
	return await this.chatService.createMessage(message);
  }

  @Post('/member')
  async getMember(@Body() data: any) {
	console.log(data);
	console.log(`get member= ${data.convId}`);
	return await this.chatService.findConv(data.convId);
  }

  @Post('/getMessage')
  async getMessage(@Body() data: any) {
	console.log(data);
	// console.log(req.query)
	console.log(`data get /conv= ${data.convId}`);
	// let test = {id: 2, members: "cc"};


	return await this.chatService.getMessages(data.convId);
	// return await this.chatService.getConv(req.user.username);
	
	
	// res.json(messages);
  }

} 