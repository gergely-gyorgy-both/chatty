import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppLoggerMiddleware } from './request-logger';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JWTSecret } from './constants';
import { AuthService } from './service/auth.service';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: 'admin',
            database: 'chatty',
            entities: [User],
            synchronize: true
        }),
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
            global: true,
            secret: JWTSecret, // TODO: provide this as a running argument
            // signOptions: { expiresIn: '60s' },
        }),
    ],
    controllers: [AppController],
    providers: [AppService, AuthService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(AppLoggerMiddleware).forRoutes('*');
    }
}
