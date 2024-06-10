import { Component } from '@angular/core';
import { Message, ChatService } from '../../../services/chat.service';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs';

@Component({
    selector: 'app-private-chat',
    templateUrl: './private-chat.component.html',
    styleUrl: './private-chat.component.scss'
})
export class PrivateChatComponent {

    public messages: Message[] = [];

    private roomId: string;

    constructor(private readonly chatService: ChatService, private readonly activatedRoute: ActivatedRoute) {
        this.roomId = this.activatedRoute.snapshot.params['roomId'];
        this.chatService.joinRoom(this.roomId);
        this.chatService.receiveChatMessage$('privateRoomChatMessages').pipe(
            // filter(message => message.roomId === this.roomId)
        )
            .subscribe(message => {
                console.log(message);
                this.messages.push(message);
            });
    }

    public sendMessage(message: string): void {
        this.chatService.sendChatMessage('privateRoomChatMessages', message, this.roomId);
    }

}
