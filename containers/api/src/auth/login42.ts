// import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UsersService } from '../users/users.service';
import { Injectable } from '@nestjs/common';

import { Repository } from 'typeorm';

import { MatchLog } from '../model/user.entity';

@Injectable()
export class loginClass {
	constructor(private readonly usersService: UsersService) {};

	async Login42(url: string)
	{
		let token = null;
		let userId = null;
		let userName = null;
		// let  = null;

		
		const params = new URLSearchParams(url.split('?')[1]);
		const code = params.get('code');

		const data = {
			grant_type: 'authorization_code',
			client_id: process.env.CLIENT_UID || 'u-s4t2ud-6d29dfa49ba7146577ffd8bf595ae8d9e5aaa3e0a9615df18777171ebf836a41',
			// client_secret: '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',
			client_secret: process.env.API_SECRET,
			code: code,
			redirect_uri: process.env.REDIRECT_URI || 'http://localhost:80/api/auth/login',
		  };

		try {
		const response = await axios.post('https://api.intra.42.fr/oauth/token', data);
		token = response.data.access_token;

		const response2 = await axios.get('https://api.intra.42.fr/v2/me', {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		userName = response2.data.login;
		userId = parseInt(response2.data.id, 10);
		// console.log(`all user data= ${response2.data}`)
		// const myJSON = JSON.stringify(response2.data);
		// console.log(`json version= ${myJSON}`)
		}
		catch(error)
		{
			console.log(error);
			return ;
		}
		console.log(`username before serach= ${userName}`)
		console.log(`ID before serach= ${userId}`)
		let user = await this.usersService.findOne(userName);
		if (!user) {
			console.log(`no user, creating one`);
			user = {
				id: null,
				password: null,
				username: userName,
				nickname: userName,
				win: 0, 
				loss: 0,
				rank: 1200,
				userId: userId,
				otp_base32: null,	
				children: null,
				status: 1,
				// doubleAuth: 0,
				otp_enabled: false,
				otp_verified: false,
				friendRequest: null,
				friends: null,
				blocked: null,
				photo: null,
			  };
			await this.usersService.create(user);
		}
		// console.log(`in login42 user= ${user}`)
		const myJSON = JSON.stringify(user);
		console.log(`in login42 user= ${myJSON}`)
		
		console.log("end of login");
		return (user);
		// return (await this.usersService.findOne(userName));
	}
}