import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { TTokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthDto, AuthSigninDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // async signupLocal(dto: AuthDto): Promise<TTokens> {
  //   const hash = await argon.hash(dto.password);
  //
  //   const existsUser = await this.prisma.user
  //     .findUnique({
  //       where: {
  //         email: dto.email,
  //       },
  //     })
  //     .catch((err) => console.log(err));
  //
  //   const newUser = await this.prisma.user
  //     .create({
  //       data: {
  //         email: dto.email,
  //         hash,
  //       },
  //     })
  //     .catch((err) => {
  //       if (err instanceof Prisma.PrismaClientKnownRequestError) {
  //         if (err.code === EPrismaClientErrors.UNIQUE.toString())
  //           throw new ForbiddenException('Credentials incorrect!');
  //       }
  //
  //       throw err;
  //     });
  //   // .catch((err) => console.log(err));
  //
  //
  //   if (!newUser) throw new BadRequestException('Error!');
  //
  //   const tokens = await this.getTokens(newUser.id, newUser.email);
  //   await this.updateRtHash(newUser.id, tokens.refresh_token);
  //
  //   return tokens;
  // }

  async signinLocal(dto: AuthSigninDto): Promise<TTokens> {
    const { code, email, password } = dto;

    if (!code && !email)
      throw new BadRequestException(
        'Debe ingresar el código de usuario o el email para poder iniciar sesión.',
      );

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { code }],
      },
      select: {
        id: true,
        email: true,
        code: true,
        hash: true,
        role: true,
      },
    });

    if (!user) throw new ForbiddenException('Access denied!');

    const passwordMatches = await argon.verify(user.hash, password);

    if (!passwordMatches) throw new ForbiddenException('Access denied!');

    const tokens = await this.getTokens(user.id, user.email ?? user.code, [
      user.role.name,
    ]);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async logout(userId: string) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    });

    return;
  }

  async refreshTokens(userId: string, rt: string): Promise<TTokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        code: true,
        hash: true,
        hashedRt: true,
        role: true,
      },
    });

    if (!user || !user.hashedRt) throw new ForbiddenException('Access denied!');

    const rtMatches = await argon.verify(user.hashedRt, rt);

    if (!rtMatches) throw new ForbiddenException('Access denied!');

    const tokens = await this.getTokens(user.id, user.email ?? user.code, [
      user.role.name,
    ]);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async updateRtHash(userId: string, rt: string): Promise<void> {
    const hash = await argon.hash(rt);

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: hash,
      },
    });
    // return;
  }

  // hashData(data: string) {
  //   return bcrypt.hash(data, 10);
  // }

  async getTokens(
    userId: string,
    email: string,
    roles: string[],
  ): Promise<TTokens> {
    const [at, rt] = await Promise.all([
      // access token
      this.jwtService.signAsync(
        { sub: userId, email, roles },
        // { secret: jwtConstants.atSecret, expiresIn: 60 * 15 }, // 15 minutes => '15m'
      ),
      // refresh token
      this.jwtService.signAsync(
        { sub: userId, email },
        { secret: jwtConstants.rtSecret, expiresIn: 60 * 60 * 24 * 7 }, // 7 days => '7d'
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
