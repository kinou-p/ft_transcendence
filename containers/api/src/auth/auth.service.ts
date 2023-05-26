import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
	private usersService: UsersService,
	private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user) {
	const myJSON = JSON.stringify(user);
	// console.log(`in login all user= ${myJSON}`)
	// console.log(`in login user= ${user.username}`)
    const payload = { username: user.username, sub: user.userId };
	// console.log(`in login payload name= ${payload.username}`)
	// console.log(`in login payload sub= ${payload.sub}`)
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
