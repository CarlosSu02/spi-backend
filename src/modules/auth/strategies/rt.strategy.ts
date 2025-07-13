import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';
import { TJwtPayload, TJwtPayloadWithRt } from '../types';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConstants.rtSecret,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: TJwtPayload): TJwtPayloadWithRt {
    const refreshToken = req
      .get('authorization')
      ?.replace('Bearer', '')
      ?.trim();

    // console.log(payload);

    if (!refreshToken) throw new ForbiddenException('Refresh toekn malformed!');

    return {
      ...payload,
      refreshToken,
    };
  }
}
