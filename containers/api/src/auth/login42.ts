import axios from 'axios';
import { UsersService } from '../users/users.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class loginClass {
	constructor(private readonly usersService: UsersService) {};

	async Login42(url: string)
	{
		let token = null;
		let userId = null;
		let userName = null;

		const params = new URLSearchParams(url.split('?')[1]);
		const code = params.get('code');

		const data = {
			grant_type: 'authorization_code',
			client_id: process.env.CLIENT_UID,
			client_secret: process.env.API_SECRET,
			code: code,
			redirect_uri: process.env.REDIRECT_URI,
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
		}
		catch(error)
		{
			console.log(error);
			return ;
		}
		let user = await this.usersService.findOne(userName);
		if (!user) {
			user = {
				id: null,
				partyInvite: null,
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
				sessionNumber: 0,
			  };
			await this.usersService.create(user);
		}
		const myJSON = JSON.stringify(user);
		return (user);
	}
}
