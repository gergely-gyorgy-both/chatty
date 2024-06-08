import { Injectable } from '@angular/core';

export interface Message {
    text: string;
    senderUsername: string;
}

@Injectable({
    providedIn: 'root'
})
export class ChatService {

    constructor() { }
}
