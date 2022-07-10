import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User$ } from './decorator/user.decorator';
import { Observable } from 'rxjs';
import { UserDocument } from './schemas/user.schema';
import { combineLatest } from 'rxjs';

@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('all')
    public all(@User$() user$: Observable<UserDocument>) {
        return combineLatest({
            user: user$,
            all: this.userService.all()
        });
    }
}
