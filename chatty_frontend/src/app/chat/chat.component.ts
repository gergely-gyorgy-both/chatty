import { Component, Input } from '@angular/core';
import { Message } from '../../services/chat.service';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.scss'
})
export class ChatComponent {
    @Input({ required: true }) messages: Message[] = [{ text: 'Hello', senderUsername: 'John' }, { text: 'Hi', senderUsername: 'Jane' }];
}
