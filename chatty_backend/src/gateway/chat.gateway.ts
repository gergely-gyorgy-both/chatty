import { Logger, UnauthorizedException } from '@nestjs/common';
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from '@nestjs/websockets';
import { forkJoin, from, Observable } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import { Message } from 'src/dto/Message';
import { AuthService } from 'src/service/auth.service';
import { ChatService } from 'src/service/chat.service';
import { UserService } from 'src/service/user.service';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ChatGateway implements OnGatewayConnection {
    @WebSocketServer()
    server: Server;

    constructor(private readonly authService: AuthService, private readonly chatService: ChatService, private readonly userService: UserService) { }

    handleConnection(client: Socket, ...args: any[]) {
        const token = client.handshake.auth.token;
        try {
            this.authService.verifyToken(token as string).subscribe((payload: { username: string }) => {
                client.data = {
                    ...client.data,
                    username: payload.username
                };
            });
        } catch (e) {
            throw new UnauthorizedException();
        }
    }

    @SubscribeMessage('commonRoomChatMessages')
    receiveNewMessage(@ConnectedSocket() client: Socket, @MessageBody() data: { message: string }) {
        const username: string = client.data.username;

        const message: Message = {
            senderUsername: username,
            text: data.message
        };
        this.server.emit('commonRoomChatMessages', message);
    }

    @SubscribeMessage('roomDiscovery')
    roomDiscovery(@ConnectedSocket() client: Socket) {
        const username: string = client.data.username;
        this.chatService.getChatRoomForCurrentUser(username).subscribe(
            (rooms) => {
                client.emit('roomDiscovery', rooms);
            }
        );
    }

    @SubscribeMessage('createPrivateRoom')
    createNewRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { username: string }) {

        const currentUsername: string = client.data.username;
        const otherUsername: string = data.username;
        from(this.userService.getUser(otherUsername)).pipe(
            tap(user => Boolean(user)),
            switchMap(() => this.chatService.createChatRoom(currentUsername, otherUsername)),
            switchMap(() => this.chatService.getChatRoomForCurrentUser(currentUsername))
        ).subscribe((rooms) => {
            client.emit('roomDiscovery', rooms);
        });
    }

    @SubscribeMessage('privateRoomChatMessages')
    privateRoomChatMessages(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: string, message: string }) {
        const username: string = client.data.username;

        const message: Message = {
            senderUsername: username,
            text: data.message,
            roomId: data.roomId
        };
        this.server.to(data.roomId).emit('privateRoomChatMessages', message);
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: string }) {
        client.join(data.roomId);
    }


}
