import { OnEvent } from '@nestjs/event-emitter';
import { CrateTokenEvent } from '../event/crate-token.event'
import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/user.service';

@Injectable()
export class CreateTokenLister {

    public constructor(
        private readonly userService: UserService
    ) {}

    @OnEvent(CrateTokenEvent.eventName)
    public updateUserAfterCreatedToken(event: CrateTokenEvent): void {
        this.userService
            .update({rtToken: event.tokens.rt.token}, {email: event.userEmail})
            .subscribe()
    }
}
