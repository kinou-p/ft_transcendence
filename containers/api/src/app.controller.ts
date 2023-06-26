/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   app.controller.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: apommier <apommier@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/06/17 01:00:00 by apommier          #+#    #+#             */
/*   Updated: 2023/06/26 02:23:56 by apommier         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

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
import { privateDecrypt } from 'crypto';
import { formatWithOptions } from 'util';


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
	if (user.friends.find(item => item === data.username))
	{
		user.friendRequest = user.friendRequest.filter((item) => item !== data.username);
		this.userService.save(user);
		return (1);
	}
	//create personnal conv for user
	//await this.userService.addFriend(user, data.username);



	// const amIhere = data.members.includes(req.user.username);
	// if (!amIhere)
	const conv = {
		id: null,
		name: req.user.username + ", " + data.username,
		banned: [],
		admin: [],
		muted: [],
		members: [],
		owner: req.user.username,
		password: null,
		messages: null,
		group: false,
		private: false,
	};
	conv.members.push(req.user.username);
	conv.members.push(data.username);
	await this.chatService.createConv(conv);

	return await this.userService.addFriend(user, data.username);

  }

  @UseGuards(JwtAuthGuard)
  @Post('/block')
  async newBlocked(@Request() req, @Body() data: any) {
	// return await this.userService.getFriends(req.user.username);
	console.log(`user= ${req.user.username}`)
	if (data.username === req.user.username)
		return (0);
	const user = await this.userService.findOne(req.user.username)
	return await this.userService.addBlocked(user, data.username);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/invite')
  async newInvite(@Request() req, @Body() data: any) {
	console.log(`user= ${req.user.username}`)
	if (data.username === req.user.username)
		return (0);
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
	const taken = await this.userService.findNickname(data.nickname)
	if (taken)
		return (0);
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
	console.log("WIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIN: ", req.user.username)
	const user = await this.userService.findOne(req.user.username);
	console.log("User", user)
	// const user2 = await this.userService.findOne(data.opName);
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
	console.log(`newMatch WIIIN = ${newMatch}`);
	await this.userService.saveChild(user, newMatch);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/loss')
  async addLoss(@Request() req, @Body() data: any) {
	console.log("LOOOOOOOOOOOOOOOSE: ", req.user.username)
	const user = await this.userService.findOne(req.user.username);
	console.log("User", user)
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
	console.log(`newMatch Loose= ${newMatch}`);
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
  @Post('/partyInvite')
  async partyInvite(@Request() req, @Body() data: any)
  {
		//find data.username and add invite to list
		console.log("data post priv invite=", data);
		const user = await this.userService.findOne(data.username);
		user.partyInvite = user.partyInvite || [];
		user.partyInvite.push({ username: req.user.username, gameId: data.gameId });
		console.log("usr === ", user)
		await this.userService.save(user);
		// user.partyInvite.push(data);
		console.log("invite === ", user.partyInvite)
  }

  @UseGuards(JwtAuthGuard)
  @Get('/partyInvite')
  async getPartyInvite(@Request() req, @Body() data: any)
  {
		//find data.username and add invite to list
		const user = await this.userService.findOne(req.user.username);
		user.partyInvite = user.partyInvite || [];
		// this.userService.save(user);
		// user.partyInvite.push(data);
		// console.log("data invite === ", data.username)
		return user.partyInvite;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/deleteInvite')
  async deleteInvite(@Request() req, @Body() data: any)
  {
	console.log("delete invite user= ", data.username)
	const user = await this.userService.findOne(req.user.username);


	// user.partyInvite = user.partyInvite.filter(item => Object.values(item)[1] !== req.user.username);
	console.log("user.partyInvite before", user.partyInvite)
	user.partyInvite = user.partyInvite.filter((item) => Object.values(item)[1] !== data.username);
	console.log("user.partyInvite after", user.partyInvite)
	this.userService.save(user);
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



@Redirect('http://' + process.env.BASE_URL + '/token', 302)
@Get('auth/login')
  async login2(@Req() request: Request) {
	  const url = request.url;
	  const user = await this.loginClass.Login42(url);
	  console.log(`user in auth/login= ${user}`);
	  console.log(`user in auth/login= ${user.username}`);
	  const data = await this.authService.login(user);
	  console.log(`all data in api = ${data}`);
	  const myJSON = JSON.stringify(data);
	  console.log(`all data json version= ${myJSON}`);
	  console.log(`data in api = ${(await data).access_token}`);
	//   console.log(`data i = ${(await data).access_token}`)
	const token = (await data).access_token;
	//   console
	  await this.userService.save(user);
	  return { url: 'http://' + process.env.BASE_URL + `/token?data=${encodeURIComponent(JSON.stringify(token))}` };
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
	console.log('token in verify=', data.token)
	console.log('res in verify=', res)
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

  @UseGuards(JwtAuthGuard)
  @Post('/deleteOtp')
  async deleteOTP(@Request() req, @Body() data: any)
  {
	const user = await this.userService.findOne(req.user.username);
	user.otp_verified = false;
	await this.userService.save(user);
	// const res = await ValidateOTP(user, data.token)
	// await this.userService.save(user);
	// return res
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
	user.sessionNumber-- ;
	if (!user.sessionNumber)
		user.status = 0;
	await this.userService.save(user);
	console.log("User quit");
  }

  @UseGuards(JwtAuthGuard)
  @Post('/addSession')
  async addSession(@Request() req) {

	const user = await this.userService.findOne(req.user.username);
	user.sessionNumber++ ;
	await this.userService.save(user);
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
	// console.log(`data post /conv= ${data.name}`);

	// const param = data;
	const amIhere = data.members.includes(req.user.username);
	if (!amIhere)
		data.members.push(req.user.username)
	// let test = {id: 2, members: "cc"};
	data.admin = []
	data.admin.push(req.user.username)
	data.owner = req.user.username
	data.group = true;
	return await this.chatService.createConv(data);
	// res.json(messages);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/conv')
  async getConv(@Request() req) {
	return await this.chatService.getConv(req.user.username);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/convs')
  async getConvs() {
	return await this.chatService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('/convId')
  async getConvById(@Body() data: any) {
	return await this.chatService.findConv(data.convId);
  }


  @UseGuards(JwtAuthGuard)
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
	return await this.chatService.createMessage(message, req.user.username);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/member')
  async getMember(@Body() data: any) {
	console.log(data);
	console.log(`get member= ${data.convId}`);
	return await this.chatService.findConv(data.convId);
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Post('/name')
  async setName(@Body() data: any) {
	//find conv
	// data.convId
	return await this.chatService.setName(data.convId, data.name)
  }

  @UseGuards(JwtAuthGuard)
  @Post('/password')
  async setPassword(@Body() data: any) {
	  return await this.chatService.setPassword(data.convId, data.password)
  }

  @UseGuards(JwtAuthGuard)
  @Post('/verifyPassword')
  async verifyPassword(@Body() data: any) {
	  return await this.chatService.verifyPassword(data.convId, data.password)
	}

  @UseGuards(JwtAuthGuard)
  @Post('/invite')
  async inviteUser(@Body() data: any) {
      return await this.chatService.inviteUser(data.convId, data.username)
	}

  @UseGuards(JwtAuthGuard)
  @Post('/ban')
  async banUser(@Body() data: any) {
	if (!data.username)
		return ;
	  return await this.chatService.banUser(data.convId, data.username)
	}

  @UseGuards(JwtAuthGuard)
  @Post('/admin')
  async setAdmin(@Body() data: any) {
	if (!data.username)
		return ;
	return await this.chatService.setAdmin(data.convId, data.username)
  }

  @UseGuards(JwtAuthGuard)
  @Post('/mute')
  async muteUser(@Body() data: any) {
	if (!data.username)
		return ;
	return await this.chatService.muteUser(data.convId, data.username, data.time)
  }

  @UseGuards(JwtAuthGuard)
  @Post('/isAdmin')
  async isAdmin(@Request() req, @Body() data: any) {
	console.log("isdamin= ", req.user.username, " id=", data.convId)
	return await this.chatService.isAdmin(data.convId, req.user.username)
  }

  @UseGuards(JwtAuthGuard)
  @Post('/private')
  async setPrivate(@Body() data: any) {
	return await this.chatService.setPrivate(data.convId, true)
  }

  @UseGuards(JwtAuthGuard)
  @Post('/public')
  async setPublic(@Body() data: any) {
	return await this.chatService.setPrivate(data.convId, false)
  }

  @UseGuards(JwtAuthGuard)
  @Post('/allowed')
  async isAllowed(@Request() req, @Body() data: any) {
	return await this.chatService.isAllowed(data.convId, req.user.username)
  }

  @UseGuards(JwtAuthGuard)
  @Post('/join')
  async joinChannel(@Request() req, @Body() data: any) {
	return await this.chatService.joinChannel(data.convId, req.user.username)
  }

}
