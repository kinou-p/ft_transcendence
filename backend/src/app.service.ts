import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './model/item.entity';
// import { User } from './entity/user.entity';


@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User) private userRepository: Repository<User>,
	  ) {}
//   constructor(
//     @InjectRepository(User)
//     private usersRepository: Repository<User>,
//   ) {}
//   constructor(
//     @InjectRepository(User)
//     private usersRepository: Repository<User>,
//   ) {}
	// constructor(private usersRepository: Repository<User>) {}

  getHello(): string {
    return 'Hello World!';
  }	

  async create(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOneBy({id: id});
  }

}