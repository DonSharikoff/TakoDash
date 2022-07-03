import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: () => ({
                uri: `mongodb://${process.env.DATABASE_HOST}/`,
                user: process.env.DATABASE_USER,
                pass: process.env.DATABASE_PASSWORD,
                dbName: process.env.DATABASE_NAME
            }),
        }),

    ]
})
export class DbModule {}
