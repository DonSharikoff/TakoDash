import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import * as fs from 'fs';
import { FileService } from '../file/file.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RtStrategy } from './strategies/rt.strategy';
import { CreateTokenLister } from './lister/create-token.lister';

@Module({
    imports: [
        JwtModule.register({
            privateKey: fs.readFileSync(FileService.privateKeyPemPath, 'utf8'),
            publicKey: fs.readFileSync(FileService.publicKeyPemPath, 'utf8'),
            signOptions: {
                algorithm: 'RS256'
            }
        }),
        UserModule
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy, RtStrategy, CreateTokenLister]
})
export class AuthModule {}
