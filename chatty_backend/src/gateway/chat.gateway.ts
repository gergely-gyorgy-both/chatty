import { Logger } from '@nestjs/common';
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { EMPTY, forkJoin, from, of } from 'rxjs';
import { catchError, first, switchMap, tap } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import { MessageDto } from 'src/dto/Message';
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

        this.authService.verifyToken(token as string).pipe(
            catchError(_error => {
                client.disconnect();
                return EMPTY;
            })
        ).subscribe((payload: { username: string }) => {
            client.data = {
                ...client.data,
                username: payload.username
            };
        });

    }

    @SubscribeMessage('commonRoomChatMessages')
    commonRoomChatMessages(@ConnectedSocket() client: Socket, @MessageBody() data: { message: string }) {
        const username: string = client.data.username;

        const message: MessageDto = {
            senderUsername: username,
            text: data.message,
            dateMs: Date.now()
        };
        this.chatService.createMessage(message);
        this.server.emit('commonRoomChatMessages', message);
    }

    @SubscribeMessage('roomDiscovery')
    roomDiscovery(@ConnectedSocket() client: Socket) {
        const username: string = client.data.username;
        this.chatService.getChatRoomsForCurrentUser(username).subscribe(
            (rooms) => {
                client.emit('roomDiscovery', rooms);
            }
        );
    }

    @SubscribeMessage('getNChatMessages')
    getNChatMessages(@ConnectedSocket() client: Socket, @MessageBody() data: { numberOfMessagesToRetrieve: number, timestamp: number, roomId?: string }) {
        this.chatService.getNChatMessagesBeforeTimestamp(data.numberOfMessagesToRetrieve, data.timestamp, data.roomId).pipe(
            first(),
            switchMap(messages => forkJoin([of(messages), this.chatService.getChatRoomsForCurrentUser(client.data.username)]))
        ).subscribe(
            ([messages, rooms]) => {
                if (
                    !messages.length
                    || !messages[0].chatroom
                    || messages[0].chatroom.user_one.username === client.data.username
                    || messages[0].chatroom.user_two.username === client.data.username
                    && (
                        !data.roomId
                        || rooms.map(room => room.id).includes(data.roomId)
                    )
                ) {
                    client.emit('getNChatMessages', messages.map(message => ({
                        ...message,
                        senderUsername: message.senderUser?.username
                    }) as MessageDto));
                }
            }
        );
    }

    @SubscribeMessage('createPrivateRoom')
    createPrivateRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { username: string }) {

        const currentUsername: string = client.data.username;
        const otherUsername: string = data.username;
        from(this.userService.getUser(otherUsername)).pipe(
            tap(user => Boolean(user)),
            switchMap(() => this.chatService.createChatRoom(currentUsername, otherUsername)),
            switchMap(() => this.chatService.getChatRoomsForCurrentUser(currentUsername))
        ).subscribe((rooms) => {
            from(this.server.fetchSockets()).subscribe(sockets => {
                sockets.forEach(socket => {
                    if (socket.data.username === otherUsername || socket.data.username === currentUsername) {
                        socket.emit('roomDiscovery', rooms);
                    }
                });
            });
        });
    }

    @SubscribeMessage('privateRoomChatMessages')
    privateRoomChatMessages(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: string, message: string }) {
        const username: string = client.data.username;

        const message: MessageDto = {
            senderUsername: username,
            text: data.message,
            dateMs: Date.now(),
            roomId: data.roomId
        };
        this.chatService.createMessage(message);
        this.server.to(data.roomId).emit('privateRoomChatMessages', message);
    }

    @SubscribeMessage('joinRoom')
    joinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: string }) {
        const currentUsername: string = client.data.username;
        this.chatService.getChatRoomsForCurrentUser(currentUsername).subscribe(rooms => {
            if (rooms.map(room => room.id).includes(data.roomId)) {
                client.join(data.roomId);
            }
        })
    }


}
