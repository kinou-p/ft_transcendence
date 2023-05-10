import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../model/user.entity';


@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User) private userRepository: Repository<User>,
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