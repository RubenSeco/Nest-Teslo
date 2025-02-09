import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { RawHeaders } from './decorators/get-rawHeaders.decorator';
import { Auth } from './decorators/auth.decorator';
// import { validRoles } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("register")
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post("login")
  @Auth()
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get("check-status")
  @Auth()
  checkAuthStatus(@GetUser() user: User) {

    return this.authService.checkAuthStatus(user);

  }

  @Get("private")
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    // @Req() request: Express.Request
    @GetUser() user: User,
    @GetUser("email") userEmail: string,
    @RawHeaders() rawHeaders: string[]
  ) {


    return {
      ok: true,
      message: "This is a private route",
      user,
      userEmail,
      rawHeaders

    };
  }

  @Get("private3")
  // @SetMetadata("roles", ["admin", "super-user"])
  @Auth()
  privateRoute3(
    @GetUser() user: User
  ) {
    return {
      ok: true,
      user
    };
  }




}
