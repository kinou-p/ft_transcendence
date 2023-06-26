/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   app.controller.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: apommier <apommier@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/06/17 01:00:00 by apommier          #+#    #+#             */
/*   Updated: 2023/06/26 10:16:19 by apommier         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Controller, Request, Req, Get, Post, UseGuards, Redirect, Res, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AuthService } from './auth/auth.service';
import { loginClass } from './auth/login42'
import { ChatService } from './chat/chat.service';
import { UsersService } from './users/users.service';
import { MatchLog } from './model/user.entity'
import { generateOTP } from './users/2fa';
import { VerifyOTP } from './users/2fa';
import { ValidateOTP } from './users/2fa';



@Controller('/api')
export class AppController {
	constructor(private authService: AuthService,
		private loginClass: loginClass,
		private chatService: ChatService,
		private userService: UsersService,) { }

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
		return await this.userService.findOne(req.user.username);
	}

	@UseGuards(JwtAuthGuard)
	@Post('/logout')
	async logout(@Request() req, @Body() data: any) {
		const user = await this.userService.findOne(req.user.username)
		// return await this.userService.refuseInvite(user, data.username);
		if(!user)
			return ;
		if (user.sessionNumber === 1)
		{
			user.status = 0;
		}
		user.sessionNumber--;
		this.userService.save(user);
	}

	@UseGuards(JwtAuthGuard)
	@Post('/user')
	async getUser(@Body() data: any) {
		return await this.userService.findOne(data.username);
	}

	@UseGuards(JwtAuthGuard)
	@Get('/users')
	async getUsers(@Body() data: any) {
		return await this.userService.findAll();
	}

	@UseGuards(JwtAuthGuard)
	@Get('/friends')
	async getFriends(@Request() req) {
		return await this.userService.getFriends(req.user.username);
	}

	@UseGuards(JwtAuthGuard)
	@Post('/friend')
	async newFriend(@Request() req, @Body() data: any) {
		const user = await this.userService.findOne(req.user.username)
		if (!user)
			return (0);
		if (user.friends.find(item => item === data.username)) {
			user.friendRequest = user.friendRequest.filter((item) => item !== data.username);
			this.userService.save(user);
			return (1);
		}
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
		if (data.username === req.user.username)
			return (0);
		const user = await this.userService.findOne(req.user.username)
		return await this.userService.addBlocked(user, data.username);
	}

	@UseGuards(JwtAuthGuard)
	@Post('/invite')
	async newInvite(@Request() req, @Body() data: any) {
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
		return await this.userService.getInvite(req.user.username);
	}

	@UseGuards(JwtAuthGuard)
	@Post('/refuseInvite')
	async refuseInvite(@Request() req, @Body() data: any) {
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
	const taken = await this.userService.findNickname(data.nickname)
	if (taken)
		return (0);
	let user = await this.userService.findOne(req.user.username)
	user.nickname = data.nickname;
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
	return await this.userService.getPic(data.username)
  }

  @UseGuards(JwtAuthGuard)
  @Post('/addSession')
  async addSession(@Request() req) {
	  const user = await this.userService.findOne(req.user.username);
	  user.sessionNumber += 1;
	  if (user.status !== 2)
		  user.status = 1;
	  await this.userService.save(user);
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
	user.status = 1;
	const Esp = 1 / (1 + Math.pow(10, (data.opRank - user.rank) / this.scaleFactor))
	const newRank = user.rank + this.kFactor * (0 - Esp);
	user.rank = newRank;
	const newMatch = new MatchLog;
	newMatch.myScore = data.myScore;
	newMatch.opScore = data.opScore;
	newMatch.opponent = data.opName;
	newMatch.parent = user;
	await this.userService.saveChild(user, newMatch);
  }

	@UseGuards(JwtAuthGuard)
	@Get('/rank')
	async getRank(@Request() req) {
		const user = await this.userService.findOne(req.user.username);
		return user.rank;
	}

  @Get('/ranking')
  async getRanking()
  {
	return await this.userService.getRanking();
  }

  @UseGuards(JwtAuthGuard)
  @Post('/partyInvite')
  async partyInvite(@Request() req, @Body() data: any)
  {
		const user = await this.userService.findOne(data.username);
		user.partyInvite = user.partyInvite || [];
		user.partyInvite.push({ username: req.user.username, gameId: data.gameId });
		await this.userService.save(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/partyInvite')
  async getPartyInvite(@Request() req)
  {
		const user = await this.userService.findOne(req.user.username);
		user.partyInvite = user.partyInvite || [];
		return user.partyInvite;
	}

  @UseGuards(JwtAuthGuard)
  @Post('/deleteInvite')
  async deleteInvite(@Request() req, @Body() data: any)
  {
	const user = await this.userService.findOne(req.user.username);
	user.partyInvite = user.partyInvite.filter((item) => Object.values(item)[1] !== data.username);
	this.userService.save(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/history')
  async getHistory(@Body() data: any)
  {
	return await this.userService.getHistory(data.username);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/quit')
  async setOffline(@Request() req) {
	  const user = await this.userService.findOne(req.user.username);
	  if (!user)
	  	return ;
	  user.sessionNumber--;
	  console.log("seesion number=", user.sessionNumber)
	  if (!user.sessionNumber)
		  user.status = 0;
	  await this.userService.save(user);
  }

//========================================================================================================
//========================================================================================================
//                                              Auth
//========================================================================================================
//========================================================================================================


@Redirect('http://' + process.env.BASE_URL + '/token', 302)
@Get('auth/login')
  async login2(@Req() request: Request) {
	  const url = request.url;
	  const user = await this.loginClass.Login42(url);
	  const data = await this.authService.login(user);
	  const myJSON = JSON.stringify(data);
  	  const token = (await data).access_token;
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
	const res = await generateOTP(user);
	await this.userService.save(user);
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
	return res
  }

  @UseGuards(JwtAuthGuard)
  @Post('/deleteOtp')
  async deleteOTP(@Request() req, @Body() data: any)
  {
	const user = await this.userService.findOne(req.user.username);
	user.otp_verified = false;
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
		const amIhere = data.members.includes(req.user.username);
		if (!amIhere)
			data.members.push(req.user.username)
		data.admin = []
		data.admin.push(req.user.username)
		data.owner = req.user.username
		data.group = true;
		return await this.chatService.createConv(data);
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
		let message =
		{
			convid: data.convId,
			sender: data.sender,
			text: data.text,
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
		return await this.chatService.getMessages(data.convId);
	}

	@UseGuards(JwtAuthGuard)
	@Post('/name')
	async setName(@Body() data: any) {
		return await this.chatService.setName(data.convId, data.name)
	}

	@UseGuards(JwtAuthGuard)
	@Post('/password')
	async setPassword(@Body() data: any) {
		// console.log("PASSSSSSSSSSSSSSSSSSSSSSSSSSs= ", data.password);
		return await this.chatService.setPassword(data.convId, data.password)
	}

	@UseGuards(JwtAuthGuard)
	@Post('/verifyPassword')
	async verifyPassword(@Request() req, @Body() data: any) {
		// const user = await this.userService.findOne(req.user.username);
		return await this.chatService.verifyPassword(data.convId, data.password, req.user.username)
	}

	@UseGuards(JwtAuthGuard)
	@Post('/inviteConv')
	async inviteUser(@Body() data: any) {
		return await this.chatService.inviteUser(data.convId, data.username)
	}

	@UseGuards(JwtAuthGuard)
	@Post('/ban')
	async banUser(@Body() data: any) {
		if (!data.username)
			return;
		return await this.chatService.banUser(data.convId, data.username)
	}

	@UseGuards(JwtAuthGuard)
	@Post('/admin')
	async setAdmin(@Body() data: any) {
		if (!data.username)
			return;
		return await this.chatService.setAdmin(data.convId, data.username)
	}

	@UseGuards(JwtAuthGuard)
	@Post('/mute')
	async muteUser(@Body() data: any) {
		if (!data.username)
			return;
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
