import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { RegisterInput } from './dto/input/register.input';
import * as argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly jwtSecret: string;

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new InternalServerErrorException('JWT_SECRET not defined in environment');
    }
    this.jwtSecret = secret;
  }

  async register(input: RegisterInput): Promise<User> {
    const hashedPassword = await argon2.hash(input.password);
    const user = this.userRepo.create({ ...input, password: hashedPassword });
    return this.userRepo.save(user);
  }

  async login(input: { email: string; password: string }): Promise<{ accessToken: string; user: User }> {
    const user = await this.userRepo.findOne({ where: { email: input.email } });
    if (!user || !(await argon2.verify(user.password, input.password))) {
      throw new Error('Invalid credentials');
    }

    const payload = { sub: user.id };
    const token = this.jwtService.sign(payload, {
      secret: this.jwtSecret, // ✅ guaranteed string
      expiresIn: '1h',        // optional: token expiry
    });

    return {
      accessToken: token,
      user,
    };
  }
}
