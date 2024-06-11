import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppLoggerMiddleware } from './request-logger';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JWTSecret } from './constants';
import { AuthService } from './service/auth.service';
import { ChatGateway } from './gateway/chat.gateway';
import { ChatRoom } from './entity/chatroom.entity';
import { ChatService } from './service/chat.service';
import { ChatMessage } from './entity/chat-message.entity';
import { UserService } from './service/user.service';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: 'admin',
            database: 'chatty',
            entities: [User, ChatRoom, ChatMessage],
            synchronize: true
        }),
        TypeOrmModule.forFeature([User, ChatRoom, ChatMessage]),
        JwtModule.register({
            global: true,
            secret: JWTSecret // TODO: provide this as a running argument
        }),
    ],
    controllers: [AppController],
    providers: [AppService, AuthService, ChatGateway, ChatService, UserService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(AppLoggerMiddleware).forRoutes('*');
    }
}
