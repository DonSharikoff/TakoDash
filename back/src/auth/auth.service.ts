import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { combineLatest, first, from, map, Observable, of, Subject, switchMap, tap, throwError } from 'rxjs';
import * as bcrypt from 'bcrypt';
import { UserDocument } from '../user/schemas/user.schema';
import * as moment from 'moment';
import { JWTPayload, RTPayload, TokenResponse } from './type/jwt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CrateTokenEvent } from './event/crate-token.event';

@Injectable()
export class AuthService {

    public constructor(
        private readonly usersService: UserService,
        private readonly jwtService: JwtService,
        private readonly eventEmitter: EventEmitter2
    ) {}

    public validateUser(email: string, pass: string): Observable<UserDocument> {
        return this.usersService.findUser({email}).pipe(
            switchMap(user => this.compareHash(user.password, pass)
                .pipe(switchMap(result =>
                    (result) ? of(user) : throwError(() => new UnauthorizedException())
                ))
            )
        );
    }

    private compareHash(hash: string, pureString: string): Observable<boolean> {
        const final$: Subject<boolean> = new Subject();
        bcrypt.compare(pureString, hash, (err, result) => {
            if (err) return new UnauthorizedException();
            final$.next(result);
            final$.complete();
        });
        return final$.pipe(first());
    }

    public createTokens(user: UserDocument): Observable<TokenResponse> {
        const JWTPayload: JWTPayload = {email: user.email};
        const  RtPayload: RTPayload = {id: user.id};

        const jwtTime: number = +process.env.JWT_LIFTIME.slice(0, -1);
        const jwtUnit: any = process.env.JWT_LIFTIME.slice(-1);

        const rtTime: number = +process.env.RT_LIFTIME.slice(0, -1);
        const rtUnit: any = process.env.RT_LIFTIME.slice(-1);

        const expiredJWT = moment().add(jwtTime, jwtUnit).unix();
        const expiredRT = moment().add(rtTime, rtUnit).unix();

        return combineLatest({
            jwt: from(this.jwtService.signAsync(JWTPayload, {expiresIn: process.env.JWT_LIFTIME})).pipe(
                map(token => ({token, expired: expiredJWT}))
            ),
            rt: from(this.jwtService.signAsync(RtPayload, {expiresIn: process.env.RT_LIFTIME})).pipe(
                map(token => ({token, expired: expiredRT})),
            )
        }).pipe(tap(tokens => this.eventEmitter.emit(CrateTokenEvent.eventName, new CrateTokenEvent(tokens, user.email))))
    }

    async login(user: any) {
        const payload = {username: user.username, sub: user.userId};
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
