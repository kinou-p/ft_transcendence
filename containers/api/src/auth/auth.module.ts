// import { Module } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { UsersModule } from '../users/users.module';
// import { PassportModule } from '@nestjs/passport';
// import { LocalStrategy } from './local.strategy';

// @Module({
//   imports: [UsersModule, PassportModule],
//   providers: [AuthService, LocalStrategy],
// })
// export class AuthModule {}


import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';

import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
    //   signOptions: { expiresIn: '60000s' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}


