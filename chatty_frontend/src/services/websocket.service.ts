//web-socket.service.ts

import { Injectable } from '@angular/core';
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

@Injectable({
    providedIn: 'root',
})
export class WebsocketService {
    private webSocket: Socket;
    constructor(private readonly cookieService: CookieService, private readonly authService: AuthService) {
        const token = this.cookieService.get('auth');
        console.log(token);
        this.webSocket = new Socket({
            url: `${environment.API_URL}`,
            options: {
                auth: { token: this.cookieService.get('auth') }
            },
        });
        this.connectSocket();
    }

    // this method is used to start connection/handhshake of socket with server
    connectSocket() {
        // this.webSocket.emit('connect', { token: this.cookieService.get('auth') });
        this.webSocket.connect();
    }

    // this method is used to send message to server
    sendChatMessage(channel: ChatMessageChannel, message: string, roomId?: string) {
        this.webSocket.emit(channel, { message, roomId });
    }

    // this method is used to get response from server
    receiveChatMessage$(channel: ChatMessageChannel): Observable<Message> {
        return this.webSocket.fromEvent<Message>(channel);
    }

    // this method is used to get response from server
    getRoomsForCurrentUser$(): Observable<ChatRoom[]> {

        return this.webSocket.fromEvent<ChatRoom[]>('roomDiscovery');
    }

    createPrivateChatRoom(username: string): void {
        this.webSocket.emit('createPrivateRoom', { username });
    }

    // this method is used to end web socket connection
    disconnectSocket() {
        this.webSocket.disconnect();
    }

    triggerGetEvent(eventName: string): void {
        this.webSocket.emit(eventName);
    }

    joinRoom(roomId: string) {
        this.webSocket.emit('joinRoom', { roomId });
    }
}
