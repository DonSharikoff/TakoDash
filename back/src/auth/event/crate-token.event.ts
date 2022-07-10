import { TokenResponse } from '../type/jwt';

export class CrateTokenEvent {
    public static readonly eventName = 'token.create';

    public constructor(
        public readonly tokens: TokenResponse,
        public readonly userEmail: string
    ) {}
}
