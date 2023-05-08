// import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UsersService } from '../users/users.service';
import { Injectable } from '@nestjs/common';

import { Repository } from 'typeorm';

import { User } from '../model/item.entity';

@Injectable()
export class loginClass {
	// const userService = new UsersService();
	constructor(private readonly usersService: UsersService) {};

	async Login42(url: string)
	{
		// const [token, setToken] = useState(null);
		// const [userId, setUserId] = useState(null);
		// const [userName, setUserName] = useState(null);
		// const usersService = UsersService;
		// constructor(private readonly usersService: UsersService) {}

		let token = null;
		let userId = null;
		let userName = null;

		// const usersService = UsersService;
		// const private , usersService: UsersService

		// const url = new URL(urlString);
		console.log("you said yes to connect with 42");
		const params = new URLSearchParams(url.split('?')[1]);
		// const params = new URLSearchParams(url);
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

		axios.post('https://api.intra.42.fr/oauth/token', data)
		.then(response => {
	    	// handle success response
	// console.log(response);
			token = response.data.access_token;
			// setToken(token);
			// console.log(`token= ${token}`);
			  axios.get('https://api.intra.42.fr/oauth/token/info', {
				headers: {
				  Authorization: `Bearer ${token}`
				}
			  })
			  .then(response => {
		// console.log(response)
				userId = response.data.resource_owner_id;
				// setUserId(userId);
		// console.log(userId);
				// axios.get(`https://api.intra.42.fr/v2/users/${userId}`)
				// axios.get(`https://api.intra.42.fr/v2/me`)
				axios.get('https://api.intra.42.fr/v2/me', {
					headers: {
					  Authorization: `Bearer ${token}`
					}
				  })
	  			.then(response => {
	  	//   console.log(response);
				//   const login = response.data.login;
				//   console.log(`login= ${login}`);
				//   setUserName(response.data.login);
				  userName = response.data.login

		//   console.log(`username= ${userName}`);
	  			  // Gérer les données de réponse ici
	  			})
	  			.catch(error => {
	  			  console.error(error);
	  			  // Gérer les erreurs ici
	  			});
			  })
			  .catch(error => {
				console.error(error);
			  });

	  	})
		.catch(error => {
			// handle error response
			console.error(error);
		});


		// async findOne(username: string): Promise<User> {
		let user = await this.usersService.findOne(userName);
		if (!user) {
			//   throw new NotFoundException(`User with username '${userName}' not found`);
			// user = { nickname: userName};
			const user = {
				name: null,
				description: null,
				id: null,
				password: null,
				nickname: userName,
				win: 0, 
				loose: 0,
				rank: 0,
			  };
			await this.usersService.create(user);
		}
		return user;
	}
}