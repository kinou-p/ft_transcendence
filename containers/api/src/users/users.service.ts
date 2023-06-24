/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   users.service.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: apommier <apommier@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/06/17 01:00:07 by apommier          #+#    #+#             */
/*   Updated: 2023/06/24 19:29:33 by apommier         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../model/user.entity';
import { MatchLog } from '../model/user.entity';


@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User) private userRepository: Repository<User>,
		@InjectRepository(MatchLog) private readonly matchRepository: Repository<MatchLog>,
		) {}
		
	getHello(): string {
	  return 'Hello World!';
	}
	
	async create(user: User): Promise<User> {
	  return await this.userRepository.save(user);
	}
	
	async findAll(): Promise<User[]> {
		return await this.userRepository.find();
	}
	
	async findOne(username: string): Promise<User> {
		return await this.userRepository.findOneBy({username: username});
	}

	async findNickname(username: string): Promise<User> {
		return await this.userRepository.findOneBy({nickname: username});
	}

	async save(user: User): Promise<User> {
		return await this.userRepository.save(user);
	}

	async saveChild(user: User, match: MatchLog): Promise<User> {
		// user.match = savedChild;
		user.children.push(match)
		await this.matchRepository.save(match);
		return await this.userRepository.save(user);
	  }

	async getFriends(username: string) {
		const user = await this.findOne(username)
		let friendsTab = user.friends
		console.log(friendsTab)
		// friendsTab = ['apommier', 'syd']
		const friends = await this.userRepository.query("SELECT * FROM \"User\" WHERE username = ANY ($1);", [friendsTab]);
		console.log(friends)
		return (friends)
	}

	async newInvite(user: User, username: string) {
		if (!(await this.findOne(username)))
			return (0);
		// user.friendRequest = user.friendRequest || [];
		// console.log("newInvite")
		// console.log(user.friendRequest)
		user.friendRequest = user.friendRequest || [];
		if (user.friendRequest.find(item => item === username))
			return (1);
		if (user.friends.find(item => item === username))
			return (1);
		user.friendRequest.push(username);
		this.save(user);	
		return (1);
	}

	async getInvite(username: string) {
		const user = await this.findOne(username)
		let friendsTab = user.friendRequest
		// console.log(friendsTab[0])
		// console.log(friendsTab[1])
		console.log(friendsTab)
		// friendsTab = ['apommier', 'syd']
		const friends = await this.userRepository.query("SELECT * FROM \"User\" WHERE username = ANY ($1);", [friendsTab]);
		console.log(friends)
		return (friends)
	}

	async refuseInvite(user: User, username: string) {
		user.friendRequest = user.friendRequest.filter((item) => item !== username);
		this.save(user);
	}

	async getHistory(username: string) {
		const user = await this.findOne(username);

		if (user)
		{

			// const ret = await this.matchRepository.query("SELECT * FROM \"MatchLog\" WHERE id = ($1);", [user.id]);
			const ret = await this.matchRepository.query("SELECT * FROM \"MatchLog\"");
			console.log("all match= ", ret);
		}
		//   const children = user.children;
		//   console.log(user); 
		//   console.log(user.children); // or perform any operations with the children
		//   return children;
			
		// }
	}

	async addFriend(user: User, username: string) {
		const user2 = await this.findOne(username)
		if (!user)
			return (0);
			// user.friendRequest = user.friendRequest || [];
		user.friends = user.friends || [];
		if (user.friends.find(item => item === username))
		{
			user.friendRequest = user.friendRequest.filter((item) => item !== username);
			this.save(user);
			return (1);
		}
		user.friends.push(username);
		user.friendRequest = user.friendRequest.filter((item) => item !== username);
		user2.friends = user2.friends || [];
		user2.friends.push(user.username);
		this.save(user2);
		this.save(user);
		return (1);
	}

	async addBlocked(user: User, username: string) {
		if (!(await this.findOne(username)))
			return (0);
		user.blocked = user.blocked || [];
		if (user.blocked.find(item => item === username))
			return (1);
		user.blocked.push(username);
		this.save(user);
		return (1);
	}

	async getRanking() {
		return await this.userRepository.query("SELECT * FROM \"User\" ORDER BY rank DESC;");
	}

	async getPic( username: string) {
		// const user = await this.findOne(username);
		let result =  await this.userRepository.query("select encode(photo, 'base64') FROM public.\"User\" WHERE username = $1;", [username]);
		if (result.length > 0) {
			const encodedPhoto = result[0].encode;
			console.log(`pic!!! =`)
			return encodedPhoto;
		  }
		  console.log(`no pic`)
		return undefined
	}
}


// }
// type orm here

// This should be a real class/interface representing a user entity
// export type User = any;

// @Injectable()
// export class UsersService {
//   private readonly users = [
//     {
//       userId: 1,
//       username: 'john',
//       password: 'changeme',
//     },
//     {
//       userId: 2,
//       username: 'maria',
//       password: 'guess',
//     },
//   ];

//   async findOne(username: string): Promise<User | undefined> {
//     return this.users.find(user => user.username === username);
//   }