import { Injectable } from '@angular/core';
import { ChatMessageChannel, ChatRoom, WebsocketService } from './websocket.service';
import { Observable } from 'rxjs';

export interface Message {
    text: string;
    senderUsername: string;
    roomId?: string;
}

@Injectable({
    providedIn: 'root'
})
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
