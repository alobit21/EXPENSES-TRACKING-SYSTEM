import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { User } from '../user/user.entity';
import { AuthService } from './auth.services';
import { AuthMutation } from './resolver/auth.mutation';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module'; // ✅ import UserModule

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),

    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '1h' },
    }),

    UserModule, // ✅ this makes UserService available
  ],
  providers: [
    AuthService,
    AuthMutation,
    JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
