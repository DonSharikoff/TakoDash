import { UserResponse } from '../../user/type/user.response';
import { TokenResponse } from './jwt';

export type LoginResponse = UserResponse & TokenResponse;
