import { Component } from '@angular/core';
import { ChatService, Message } from '../../../services/chat.service';

@Component({
    selector: 'app-common-chat',
    templateUrl: './common-chat.component.html',
    styleUrl: './common-chat.component.scss'
})
export class CommonChatComponent {

    public messages: Message[] = [];

    constructor(private readonly chatService: ChatService) {
        this.chatService.receiveChatMessage$('commonRoomChatMessages').subscribe(message => {
            this.messages.push(message);
        });
    }

    public sendMessage(message: string): void {
        this.chatService.sendChatMessage('commonRoomChatMessages', message);
    }
}
