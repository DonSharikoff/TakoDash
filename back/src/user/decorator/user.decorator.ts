import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserDocument } from '../schemas/user.schema';

export const User$ = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): Observable<UserDocument> => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);

export const ReqToken = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.tokenPayload;
    },
);
