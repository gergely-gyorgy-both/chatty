//web-socket.service.ts

import { Injectable, OnDestroy } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { environment } from '../environments/environment';
import { iif, Observable, of } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Message } from './chat.service';
import { AuthService } from './auth.service';

export type ChatMessageChannel = 'commonRoomChatMessages' | `privateRoomChatMessages`;


export interface ChatRoom {
    id: number;

    username_one: string;

    username_two: string;
}

@Injectable()
export class WebsocketService implements OnDestroy {
    private webSocket: Socket;
    constructor(private readonly cookieService: CookieService, private readonly authService: AuthService) {
        this.webSocket = new Socket({
            url: `${environment.API_URL}`,
            options: {
                auth: { token: this.cookieService.get('auth') }
            },
        });
        this.connectSocket();
    }

    public ngOnDestroy(): void {
        this.disconnectSocket();
    }


    public sendChatMessage(channel: ChatMessageChannel, message: string, roomId?: string): void {
        this.webSocket.emit(channel, { message, roomId });
    }


    public receiveChatMessage$(channel: ChatMessageChannel): Observable<Message> {
        return this.webSocket.fromEvent<Message>(channel);
    }

    public getNChatMessagesBeforeTimestamp$(numberOfMessagesToRetrieve: number, timestamp: number, roomId?: string): Observable<Message[]> {
        this.webSocket.emit('getNChatMessages', { numberOfMessagesToRetrieve, timestamp, roomId });
        return this.webSocket.fromEvent<Message[]>('getNChatMessages');
    }


    public getRoomsForCurrentUser$(): Observable<ChatRoom[]> {
        return this.webSocket.fromEvent<ChatRoom[]>('roomDiscovery');
    }

    public createPrivateChatRoom(username: string): void {
        this.webSocket.emit('createPrivateRoom', { username });
    }

    public triggerGetEvent(eventName: string): void {
        this.webSocket.emit(eventName);
    }

    public joinRoom(roomId: string): void {
        this.webSocket.emit('joinRoom', { roomId });
    }

    private connectSocket(): void {
        this.webSocket.connect();
    }

    private disconnectSocket() {
        this.webSocket.disconnect();
    }

}
