import { Controller, Request, Req, Get, Post, UseGuards, Redirect, Res, Body, UploadedFile, UseInterceptors} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AuthService } from './auth/auth.service';
import { loginClass } from './auth/login42'
import { ChatService } from './chat/chat.service';
import { UsersService } from './users/users.service';

import { MatchLog } from './model/user.entity'
import { generate } from 'rxjs';

// import { generateQRcode } from './users/2fa';
import { generateOTP } from './users/2fa';
import { VerifyOTP } from './users/2fa';
import { ValidateOTP } from './users/2fa';


//2fa


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


//========================================================================================================
//========================================================================================================
//                                              User			                                  
//========================================================================================================
//========================================================================================================

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async getProfile(@Request() req) {
	//   const myJSON = JSON.stringify(req.user);
	//   console.log(`req user api= ${req.user}`)
	//   console.log(`json user api= ${myJSON}`)
	//   return req.user;
	return await this.userService.findOne(req.user.username);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/user')
  async getUser( @Body() data: any) {
	console.log(`usernamewwww= ${data.username}`)
	return await this.userService.findOne(data.username);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/users')
  async getUsers( @Body() data: any) {
	console.log(`usernamewwww= ${data.username}`)
	return await this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/friends')
  async getFriends(@Request() req) {
	// return await this.userService.getFriends(req.user.username);
	return await this.userService.getFriends(req.user.username);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/friend')//need to do it 2 time when user accept one for each
  async newFriend(@Request() req, @Body() data: any) {
	// return await this.userService.getFriends(req.user.username);
	console.log(`user= ${req.user.username}`)
	const user = await this.userService.findOne(req.user.username)
	if (!user)
		return (0);
	return await this.userService.addFriend(user, data.username);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/block')
  async newBlocked(@Request() req, @Body() data: any) {
	// return await this.userService.getFriends(req.user.username);
	console.log(`user= ${req.user.username}`)
	const user = await this.userService.findOne(req.user.username)
	return await this.userService.addBlocked(user, data.username);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/invite')
  async newInvite(@Request() req, @Body() data: any) {
	console.log(`user= ${req.user.username}`)
	const user = await this.userService.findOne(data.username)
	if (!user)
		return (0);
	return await this.userService.newInvite(user, req.user.username);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/inviteRequest')
  async getInvite(@Request() req) {
	// return await this.userService.getFriends(req.user.username);
	console.log(`useawdawd\n\n\nr= ${req.user.username}`)
	// const user = await this.userService.findOne(req.user.username)
	return await this.userService.getInvite(req.user.username);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/refuseInvite')
  async refuseInvite(@Request() req, @Body() data: any) {
	// return await this.userService.getFriends(req.user.username);
	// console.log(`useawdawd\n\n\nr= ${req.user.username}`)
	const user = await this.userService.findOne(req.user.username) 
	return await this.userService.refuseInvite(user, data.username);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/status')
  async setStatus(@Request() req, @Body() data: any) {
  	const user = await this.userService.findOne(req.user.username);

  	user.status = data.status;
  	await this.userService.save(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/nickname')
  async setNickname(@Request() req, @Body() data: any) {
	// let user = req.user
	// user.nickname = data.nickname
	console.log(`user= ${req.user.username}`)
	let user = await this.userService.findOne(req.user.username)
	user.nickname = data.nickname;
	// return await this.userService.getFriends(req.user.username);
	return await this.userService.save(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/picture')
  @UseInterceptors(FileInterceptor('photo'))
  async setProfilPicture(@Request() req, @UploadedFile() file: Express.Multer.File) {
	let user = await this.userService.findOne(req.user.username)
	if (!file)
		user.photo = null;
	else
		user.photo = file.buffer;
	return await this.userService.save(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/getPicture')
  async getProfilPicture(@Body() data: any) {
	// console.log(`dataaaaa= ${data.username}`)
	return await this.userService.getPic(data.username)

	// return user.photo
	// const photoData = user.photo;
	// Buffer.from(user.photo, 'binary').buffer;
	// const arrayBuffer = ArrayBuffer.from(photoData, 'binary');
	// return await this.userService.save(user);
  }

//========================================================================================================
//========================================================================================================
//                                              Pong			                                  
//========================================================================================================
//========================================================================================================

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

//   @UseGuards(JwtAuthGuard)
  @Get('/ranking')
  async getRanking()
  {
	return await this.userService.getRanking();
  }

  @UseGuards(JwtAuthGuard)
  @Post('/history')
  async getHistory(@Body() data: any)
  {
	// const user = await this.userService.findOne(req.user.username);
	// return user.rank;
	return await this.userService.getHistory(data.username);
	
	//   if (user) {
	// 	const children = user.children;
	// 	console.log(user); 
	// 	console.log(user.children); // or perform any operations with the children
	// 	return children;
	// 	// You can also access specific properties of each child
	// 	// children.forEach((child) => {
	// 	//   console.log(child.id);
	// 	//   console.log(child.opponent);
	// 	//   // Access other child properties as needed
	// 	// });
	//   }
  }


//========================================================================================================
//========================================================================================================
//                                              Auth			                                  
//========================================================================================================
//========================================================================================================

// import { Prisma } from "@prisma/client";
// import { Request, Response, NextFunction } from "express";
// import { prisma } from "../server";



@Redirect('http://'localhost'/token', 302)
@Get('auth/login')
  async login2(@Req() request: Request) {
	  const url = request.url;
	  const user = await this.loginClass.Login42(url);
	  console.log(`user in auth/login= ${user}`);
	  console.log(`user in auth/login= ${user.username}`);
	  const data = await this.authService.login(user);
	  console.log(`all data in api = ${data}`)
	  
	  const myJSON = JSON.stringify(data);
	  console.log(`all data json version= ${myJSON}`)
	  
	  console.log(`data in api = ${(await data).access_token}`)
	//   console.log(`data i = ${(await data).access_token}`)
	  const token = (await data).access_token;
	//   console
	  await this.userService.save(user);
	  return { url: `http://localhost/token?data=${encodeURIComponent(JSON.stringify(token))}` };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/2fa')
  async get2fa(@Request() req)
  {
	const user = await this.userService.findOne(req.user.username);
	return user.otp_enabled;
  }


  @UseGuards(JwtAuthGuard)
  @Post('/otp')
  async createOTP(@Request() req)
  {
	const user = await this.userService.findOne(req.user.username);
	// const user2 = await this.userService.findOne(req.user.username);
	const res = await generateOTP(user);
	await this.userService.save(user);
	// console.log(user);
	return res;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/verifyOtp')
  async verifyOTP(@Request() req, @Body() data: any)
  {
	const user = await this.userService.findOne(req.user.username);
	const res = await VerifyOTP(user, data.token)
	await this.userService.save(user);
	return res
  }

  @UseGuards(JwtAuthGuard)
  @Post('/validateOtp')
  async validateOTP(@Request() req, @Body() data: any)
  {
	const user = await this.userService.findOne(req.user.username);
	const res = await ValidateOTP(user, data.token)
	// await this.userService.save(user);
	return res
  }

//   @UseGuards(JwtAuthGuard)
//   @Get('/QRcode')
//   async createQrCode(@Request() req)
//   {
// 	return (await generateQRcode(req));
//   }

  @UseGuards(JwtAuthGuard)
  @Post('/quit')
  async setOffline(@Request() req) {
	
	const user = await this.userService.findOne(req.user.username);

	user.status = 0;
	await this.userService.save(user);
	console.log("User quit");
  }


//========================================================================================================
//========================================================================================================
//                                              Chat			                                  
//========================================================================================================
//========================================================================================================

  @UseGuards(JwtAuthGuard)
  @Post('/conv')
  async createConv(@Request() req, @Body() data: any) {
	///create conv and return it ? id?
	console.log(`data post /conv= ${data}`);
	console.log(`data post /conv= ${data.members}`);
	console.log(`data post /conv= ${data.name}`);

	// const param = data;
	const amIhere = data.members.includes(req.user.username);
	if (!amIhere)
		data.members.push(req.user.username)
	// let test = {id: 2, members: "cc"};
	data.owner = req.user.username
	return await this.chatService.createConv(data);
	// res.json(messages);
  }



  @UseGuards(JwtAuthGuard)
  @Get('/conv')
  async getConv(@Request() req) {
	return await this.chatService.getConv(req.user.username);
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