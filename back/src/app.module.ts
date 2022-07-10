import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db/db.module';
import { UserModule } from './user/user.module';
import { FileModule } from './file/file.module';
import { AuthModule } from './auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true}),
        EventEmitterModule.forRoot(),
        DbModule,
        FileModule,
        AuthModule,
        UserModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
