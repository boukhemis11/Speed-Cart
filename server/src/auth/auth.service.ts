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
import { JwtPayload } from './models/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialDto): Promise<void> {
    const { email, password } = authCredentialsDto;
    const userExist = await Promise.resolve( this.userModel.findOne({email}));
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

  async signIn(
    authCredentialsDto: AuthCredentialDto,
  ): Promise<{ accessToken: string; id: string; email: string; roles?: string[] }> {
    const { email, password } = authCredentialsDto;
    const user = await Promise.resolve( this.userModel.findOne({email}) as any);
    const loggedUser = user && (await this.validatePassword(password, user));
    const userEmail = loggedUser ? user.email : null;
    if (!userEmail) {
      throw new UnauthorizedException('Invalid credential');
    }

    const payload: JwtPayload = { email };
    const accessToken = await Promise.resolve( this.jwtService.sign(payload) as any);

    return { accessToken, id: user._id, roles: user.roles, email };
  }


  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  private async validatePassword(password: string, user: User): Promise<boolean> {
    const hash = await bcrypt.hash(password, user.salt);
    return hash === user.password;
  }

}
