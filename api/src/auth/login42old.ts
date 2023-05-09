// import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UsersService } from '../users/users.service';
import { Injectable } from '@nestjs/common';

import { Repository } from 'typeorm';

import { User } from '../model/item.entity';

@Injectable()
export class loginClass {
	constructor(private readonly usersService: UsersService) {};

	async Login42(url: string)
	{
		let token = null;
		let userId = 0;
		let userName = null;
		// let  = null;

		console.log("you said yes to connect with 42");
		const params = new URLSearchParams(url.split('?')[1]);
		console.log(`params is= ${params}`);
		const code = params.get('code');
		console.log(`code is= ${code}`);

		const data = {
			grant_type: 'authorization_code',
			client_id: 'u-s4t2ud-6d29dfa49ba7146577ffd8bf595ae8d9e5aaa3e0a9615df18777171ebf836a41',
			client_secret: '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',
			code: code,
			redirect_uri: 'http://localhost:80/api/auth/login',
		  };

		await axios.post('https://api.intra.42.fr/oauth/token', data)
		.then(response => {
			token = response.data.access_token;
			console.log("HEEEEEEEERRREEEEEEE")
			axios.get('https://api.intra.42.fr/oauth/token/info', {
				headers: {
				Authorization: `Bearer ${token}`
				}
			  })
			  .then(response => {
				userId = response.data.resource_owner_id;
				axios.get('https://api.intra.42.fr/v2/me', {
					headers: {
					  Authorization: `Bearer ${token}`
					}
				  })
	  			.then(response => {
				  console.log(`data get success data= ${response.data}`)
				  userName = response.data.login
	  			})
	  			.catch(error => {
	  				console.log("ERROR BITCH");
					console.error(error);
	  			});
			  })
			  .catch(error => {
				console.log("ERROR BITCH");
				console.error(error);
			  });

	  	})
		.catch(error => {
			console.log("ERROR BITCH");
			console.error(error);
		});
		console.log(`username before serach= ${userName}`)
		let user = await this.usersService.findOne(userName);
		if (!user) {
			console.log(`no user, creating one`)
			user = {
				name: null,
				description: null,
				id: null,
				password: null,
				username: userName,
				nickname: userName,
				win: 0, 
				loose: 0,
				rank: 0,
				userId: userId,
			  };
			await this.usersService.create(user);
		}
		console.log(`in login42 user= ${user}`)
		const myJSON = JSON.stringify(user);
		console.log(`in login42 user2= ${myJSON}`)
		
		console.log("end of login");
		return (await this.usersService.findOne(userName));
	}
}