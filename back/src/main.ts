import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const port = process.env.START_PORT || 3000;

    useContainer(app.select(AppModule), {fallbackOnErrors: true});
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true,
        stopAtFirstError: false
    }));

    const config = new DocumentBuilder()
        .setTitle('TakoDash')
        .setVersion('1.0')
        .addBearerAuth({
            type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header'
        }, 'JWT')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);


    await app.listen(port, () => {
        console.log(`Port is ${port}`)
    });
}

bootstrap();
