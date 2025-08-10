import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';
import { TJwtPayload, TJwtPayloadWithRt } from '../types';

interface IRequestWithRT extends Request {
  cookies: {
    refresh_token: string;
  };
}

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConstants.rtSecret,
      passReqToCallback: true,
    });
  }

  private static extractJWT(req: IRequestWithRT): string | null {
    if (
      (!req.cookies && !('refresh_token' in req.cookies)) ||
      (req.cookies.refresh_token && req.cookies.refresh_token?.length === 0)
    )
      throw new ForbiddenException('Refresh token malformed!');

    return req.cookies.refresh_token;
  }

  validate(req: IRequestWithRT, payload: TJwtPayload): TJwtPayloadWithRt {
    const refreshToken =
      req.cookies.refresh_token ??
      req.get('authorization')?.replace('Bearer', '')?.trim();

    if (!refreshToken) throw new ForbiddenException('Refresh token malformed!');

    return {
      ...payload,
      refreshToken,
    };
  }
}
