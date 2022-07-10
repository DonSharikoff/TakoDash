import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User$ } from '../user/decorator/user.decorator';
import { UserDocument } from '../user/schemas/user.schema';
import { map, Observable, switchMap } from 'rxjs';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { LoginResponse } from './type/login.response';
import { RtAuthGuard } from './guards/rt-auth.guard';
import { TokenResponse } from './type/jwt';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) {}

    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthGuard)
    @ApiBody({type: LoginUserDto})
    @Post('login')
    public login(@User$() user$: Observable<UserDocument>, @Body() body: LoginUserDto): Observable<LoginResponse> {
        return user$.pipe(
            switchMap(user => this.authService.createTokens(user)
                .pipe(map(token => ({user, ...token})))
            )
        )
    }

    @HttpCode(HttpStatus.CREATED)
    @ApiBody({type: CreateUserDto})
    @Post('registration')
    public registration(@Body() dto: CreateUserDto): Observable<LoginResponse> {
        return this.userService.create(dto).pipe(
            switchMap(user => this.authService.createTokens(user)
                .pipe(map(token => ({user, ...token})))
            )
        )
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(RtAuthGuard)
    @Post('fresh')
    public freshRTToken(@User$() user$: Observable<UserDocument>): Observable<TokenResponse> {
        return user$.pipe(
            switchMap(user => this.authService.createTokens((user)))
        )
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    public logout(@User$() user$: Observable<UserDocument>) {
        return user$.pipe(
            switchMap(user => this.userService.update({rtToken: null}, {_id: user.id})),
            map(() => null)
        )
    }
}
