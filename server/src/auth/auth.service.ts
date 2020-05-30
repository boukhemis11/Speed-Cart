import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

import { User } from './models/user.model';
import { AuthCredentialDto } from './dto/auth-credential.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialDto): Promise<void> {
    const { email, password } = authCredentialsDto;
    const userExist = await this.userModel.findOne({email});
    if (userExist) {
      throw new ConflictException('Username already exist');
    }
    const user = new this.userModel(authCredentialsDto);
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exist');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }


  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

}
