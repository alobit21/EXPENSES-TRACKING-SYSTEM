import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { AuthService } from './auth.services';
import { AuthMutation } from './resolver/auth.mutation';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),   // ✅ injects Repository<User>
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, AuthMutation],
})
export class AuthModule {}
