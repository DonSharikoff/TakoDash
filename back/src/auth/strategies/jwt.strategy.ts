import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as fs from 'fs';
import { FileService } from '../../file/file.service';
import { JWTPayload } from '../type/jwt';
import { UserService } from '../../user/user.service';
import { catchError, Observable, throwError } from 'rxjs';
import { UserDocument } from '../../user/schemas/user.schema';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: fs.readFileSync(FileService.publicKeyPemPath, 'utf8'),
            algorithms: ['RS256'],
            passReqToCallback: true,
        });
    }

    public validate(req: Request, payload: JWTPayload): Observable<UserDocument> {
        return this.userService.findUser({email: payload.email}).pipe(
            catchError(() => throwError(() => new UnauthorizedException()))
        );
    }
}
