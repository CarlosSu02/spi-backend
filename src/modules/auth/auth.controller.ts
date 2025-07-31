import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, AuthSigninDto } from './dto';
import { AtGuard, RtGuard } from 'src/common/guards';
import {
  GetCurrentUser,
  GetCurrentUserId,
  Public,
} from 'src/common/decorators';
import { ApiBearerAuth, ApiHeader, ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  signupLocal(@Body() dto: AuthDto) {
    // return this.authService.signupLocal(dto);
    console.log(dto);
    throw new BadRequestException('Esta ruta actualmente no esta disponible!');
  }

  @Public()
  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  signinLocal(@Body() dto: AuthSigninDto) {
    return this.authService.signinLocal(dto);
  }

  @UseGuards(AtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: string) {
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('jwt-refresh')
  @ApiOperation({
    summary: 'Refresh token.',
    description:
      'Este permite obtener un nuevo access token usando el refresh token. En Swagger debe agregar el token de tipo Bearer en el header.',
  })
  // @ApiHeader({
  //   name: 'Authorization',
  //   description: 'Bearer token with the format "Bearer <refreshToken>"',
  //   required: true,
  //   example: 'Bearer your_refresh_token_here',
  //   schema: {
  //     type: 'string',
  //     format: 'Bearer <refreshToken>',
  //   },
  // })
  refresh(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
