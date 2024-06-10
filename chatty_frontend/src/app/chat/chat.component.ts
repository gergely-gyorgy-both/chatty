import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FormControl, Validators } from '@angular/forms';
import { Message } from '../../services/chat.service';
import { jwtDecode } from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';


@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.scss'
})
export class ChatComponent {
    @Input({ required: true }) messages!: Message[];
    @Output() sendMessageEvent = new EventEmitter<string>();

    public messageFormControl = new FormControl('', Validators.required);

    constructor(private readonly cookieService: CookieService) { }

    public sendMessage(): void {
        if (this.messageFormControl.valid && this.messageFormControl.value) {
            this.sendMessageEvent.emit(this.messageFormControl.value);
        }
    }

    public isOwnMessage(senderUsername: string): boolean {
        return jwtDecode<{ username: string }>(this.cookieService.get('refresh')).username === senderUsername;
    }
}
