import { Component } from '@angular/core';
import { ChatService, DEFAULT_GET_N_MESSAGES_BEFORE_TIMESTAMP, Message } from '../../../services/chat.service';
import { DateTime } from 'luxon';


@Component({
    selector: 'app-common-chat',
    templateUrl: './common-chat.component.html',
    styleUrl: './common-chat.component.scss'
})
export class CommonChatComponent {

    public messages: Message[] = [];

    public hasOlderMessages = true;

    constructor(private readonly chatService: ChatService) {
        this.getNMessagesBeforeTimestamp(DateTime.now().toMillis());
        this.chatService.receiveChatMessage$('commonRoomChatMessages').subscribe(message => {
            this.messages.push(message);
        });
    }

    public sendMessage(message: string): void {
        this.chatService.sendChatMessage('commonRoomChatMessages', message);
    }

    public getNMessagesBeforeTimestamp(timestamp: number): void {
        this.chatService.getNChatMessagesBeforeTimestamp$(DEFAULT_GET_N_MESSAGES_BEFORE_TIMESTAMP, timestamp).subscribe(messages => {
            this.messages = [...messages, ...this.messages];
            this.hasOlderMessages = Boolean(messages.length);
        });
    }
}
