import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserMutation } from './resolver/user.mutation';
import { UserInfoQuery } from './resolver/user.query';
import { UserService } from './user.service';
 
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserMutation, UserInfoQuery,UserService], // <-- include both resolvers
  exports:[UserService]
})
export class UserModule {}


