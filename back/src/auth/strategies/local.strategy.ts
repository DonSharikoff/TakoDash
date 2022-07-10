import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { catchError, Observable, throwError } from 'rxjs';
import { UserDocument } from '../../user/schemas/user.schema';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({usernameField: 'email'});
    }

    public validate(email: string, password: string): Observable<UserDocument> {
        return this.authService.validateUser(email, password).pipe(
            catchError(() => throwError(() => new UnauthorizedException()))
        );
    }
}
