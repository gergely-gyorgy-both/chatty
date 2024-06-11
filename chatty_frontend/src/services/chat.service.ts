import { Injectable } from '@angular/core';
import { ChatMessageChannel, ChatRoom, WebsocketService } from './websocket.service';
import { first, Observable } from 'rxjs';

export const DEFAULT_GET_N_MESSAGES_BEFORE_TIMESTAMP = 20;

export interface Message {
    text: string;
    senderUsername: string;
    dateMs: number;
    roomId?: string;
}


@Injectable()
export class ChatService {

    constructor(private readonly websocketService: WebsocketService) {
        this.websocketService.triggerGetEvent('roomDiscovery'); // initialize the rooms
    }

    public sendChatMessage(channel: ChatMessageChannel, message: string, roomId?: string): void {
        this.websocketService.sendChatMessage(channel, message, roomId);
    }

    public receiveChatMessage$(channel: ChatMessageChannel): Observable<Message> {
        return this.websocketService.receiveChatMessage$(channel);
    }

    public getNChatMessagesBeforeTimestamp$(numberOfMessagesToRetrieve: number, timestamp: number, roomId?: string): Observable<Message[]> {
        return this.websocketService.getNChatMessagesBeforeTimestamp$(numberOfMessagesToRetrieve, timestamp, roomId).pipe(
            first()
        );
    }

    public getRoomsForCurrentUser$(): Observable<ChatRoom[]> {
        return this.websocketService.getRoomsForCurrentUser$();
    }

    public addPrivateChatRoom(username: string): void {
        this.websocketService.createPrivateChatRoom(username);
    }

    public joinRoom(roomId: string): void {
        this.websocketService.joinRoom(roomId);
    }


}
