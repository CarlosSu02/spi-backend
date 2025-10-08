import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
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
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { CookieOptions, Response } from 'express';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { envs } from 'src/config';

@Controller('auth')
export class AuthController {
  private cookieOptions: CookieOptions = {
    secure: envs.nodeEnv === 'production',
    sameSite: envs.nodeEnv === 'production' ? 'none' : 'lax',
    // path: '/auth/refresh',
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 7, // Cambiar al mismo del refreshToken, colocar este valor como una constante
    signed: true,
  };

  constructor(private readonly authService: AuthService) {}

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
  async signinLocal(
    @Body() dto: AuthSigninDto,
    @Res({
      passthrough: true,
    })
    res: Response,
  ) {
    const { refresh_token, access_token } =
      await this.authService.signinLocal(dto);

    res.cookie('refresh_token', refresh_token, this.cookieOptions);

    return {
      access_token,
    };
  }

  @UseGuards(AtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(
    @GetCurrentUserId() userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.clearCookie('refresh_token');

    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  // @ApiBearerAuth('jwt-refresh')
  @ApiOperation({
    summary: 'Refresh token.',
    description:
      'Este permite obtener un nuevo access token usando el refresh token (cookies).',
  })
  async refresh(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refresh_token, access_token } =
      await this.authService.refreshTokens(userId, refreshToken);

    res.cookie('refresh_token', refresh_token, this.cookieOptions);

    return {
      access_token,
    };
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    type: ForgotPasswordDto,
  })
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    type: ResetPasswordDto,
  })
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
