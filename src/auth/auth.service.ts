import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

  ) { }


  async create(createUserDto: CreateUserDto) {

    try {

      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create(
        {
          ...userData,
          password: bcrypt.hashSync(password, 10)
        }
      );
      await this.userRepository.save(user);
      delete user.password;
      return user;
      // TODO: Retornar el JWT de acceso

    } catch (error) {

      this.handleError(error);
    }
  }

  private handleError(error: any): never {

    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    throw new InternalServerErrorException("Something went wrong - Check server logs");
  }

  async login(loginUserDto: LoginUserDto) {

    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true }
    });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials (email)");
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException("Invalid credentials (password)");
    }

    return user;

    // TODO: Retornar el JWT de acceso  
  }


}
