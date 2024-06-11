import { Component } from '@angular/core';
import { Message, ChatService, DEFAULT_GET_N_MESSAGES_BEFORE_TIMESTAMP } from '../../../services/chat.service';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs';
import { DateTime } from 'luxon';

@Component({
    selector: 'app-private-chat',
    templateUrl: './private-chat.component.html',
    styleUrl: './private-chat.component.scss'
})
export class PrivateChatComponent {

    public messages: Message[] = [];

    public hasOlderMessages = true;

    private roomId: string;

    constructor(private readonly chatService: ChatService, private readonly activatedRoute: ActivatedRoute) {
        this.roomId = this.activatedRoute.snapshot.params['roomId'];
        this.chatService.joinRoom(this.roomId);
        this.getNMessagesBeforeTimestamp(DateTime.now().toMillis());
        this.chatService.receiveChatMessage$('privateRoomChatMessages').pipe(
            filter(message => message.roomId === this.roomId)
        )
            .subscribe(message => {
                this.messages.push(message);
            });
    }

    public sendMessage(message: string): void {
        this.chatService.sendChatMessage('privateRoomChatMessages', message, this.roomId);
    }

    public getNMessagesBeforeTimestamp(timestamp: number): void {
        this.chatService.getNChatMessagesBeforeTimestamp$(DEFAULT_GET_N_MESSAGES_BEFORE_TIMESTAMP, timestamp, this.roomId).subscribe(messages => {
            this.messages = [...messages, ...this.messages];
            this.hasOlderMessages = Boolean(messages.length);
        });
    }

}
