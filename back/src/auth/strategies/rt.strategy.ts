import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as fs from 'fs';
import { FileService } from '../../file/file.service';
import { RTPayload } from '../type/jwt';
import { UserService } from '../../user/user.service';
import { catchError, Observable, throwError } from 'rxjs';
import { UserDocument } from '../../user/schemas/user.schema';
import { Request } from 'express';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(private readonly userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: fs.readFileSync(FileService.publicKeyPemPath, 'utf8'),
            algorithms: ['RS256'],
            passReqToCallback: true,
        });
    }

    public validate(req: Request, {id}: RTPayload): Observable<UserDocument> {
        const refreshToken = req
            ?.get('authorization')
            ?.replace('Bearer', '')
            .trim();
        return this.userService.findUser({_id: id, rtToken: refreshToken}).pipe(
            catchError(() => throwError(() => new UnauthorizedException()))
        );
    }
}
