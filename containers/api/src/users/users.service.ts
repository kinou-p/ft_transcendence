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

	async save(user: User): Promise<User> {
		return await this.userRepository.save(user);
	}

	async saveChild(user: User, match: MatchLog): Promise<User> {
		// user.match = savedChild;
		await this.matchRepository.save(match);
		return await this.userRepository.save(user);
	  }

	async getFriends(username: string) {
		const user = await this.findOne(username)
		let friendsTab = user.friends
		console.log(friendsTab)
		friendsTab = ['apommier']
		const friends = await this.userRepository.query("SELECT * FROM \"User\" WHERE username = ANY ($1);", [friendsTab]);
		console.log(friends)
		return (friends)
	}

	async getHistory(username: string) {
		const user = await this.findOne(username);
		
		if (user) {
		  const children = user.children;
		  console.log(user); 
		  console.log(user.children); // or perform any operations with the children
		  return children;
		  // You can also access specific properties of each child
		  // children.forEach((child) => {
		  //   console.log(child.id);
		  //   console.log(child.opponent);
		  //   // Access other child properties as needed
		  // });
		}
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