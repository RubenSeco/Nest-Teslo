import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity'; // Ensure you have the correct path to the User entity
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService],

  imports: [
    TypeOrmModule.forFeature([User]),

    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {

        console.log("jwt secret", configService.get('JWT_SECRET'));
        console.log("JWT_SECRET", process.env.JWT_SECRET);
        return {
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '1d' }
        };
      },

    }),

  ]
})
export class AuthModule { }
