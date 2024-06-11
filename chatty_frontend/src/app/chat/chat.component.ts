import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';

import { FormControl, Validators } from '@angular/forms';
import { Message } from '../../services/chat.service';
import { jwtDecode } from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { DateTime } from 'luxon';
import { BehaviorSubject, distinctUntilChanged, Subscription } from 'rxjs';


@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.scss'
})
export class ChatComponent implements AfterViewInit, OnDestroy {
    @Input({ required: true }) messages!: Message[];
    @Input({ required: true }) hasOlderMessages!: boolean;
    @Output() sendMessageEvent = new EventEmitter<string>();
    @Output() loadOlderMessagesEvent = new EventEmitter<number>();
    @ViewChild('messagesContainer', { static: true }) public messagesContainer!: ElementRef<HTMLElement>;

    public messageFormControl = new FormControl('', Validators.required);

    private scrollBs$ = new BehaviorSubject<number>(0);

    private allowAutoscroll = true;

    private scrollSubscription?: Subscription;

    constructor(private readonly cookieService: CookieService) { }

    public ngAfterViewInit(): void {
        this.scrollSubscription = this.scrollBs$.pipe(
            distinctUntilChanged((prev, current) => prev === current),
        ).subscribe(_ => {
            this.messagesContainer.nativeElement.scrollTo(0, this.messagesContainer.nativeElement.scrollHeight);
        });
    }


    public ngOnDestroy(): void {
        if (this.scrollSubscription) {
            this.scrollSubscription.unsubscribe();
        }
    }

    public messagesTrackBy(_index: number, message: Message): number {
        return message.dateMs;
    }

    public sendMessage(): void {
        if (this.messageFormControl.valid && this.messageFormControl.value) {
            this.allowAutoscroll = true;
            this.sendMessageEvent.emit(this.messageFormControl.value);
            this.messageFormControl.reset();
        }
    }

    public isOwnMessage(senderUsername: string): boolean {
        return jwtDecode<{ username: string }>(this.cookieService.get('refresh')).username === senderUsername;
    }

    public getMessageTimestamp(message: Message): string {
        return DateTime.fromMillis(message.dateMs).toLocaleString(DateTime.DATETIME_MED);
    }

    public loadOlderMessages(): void {
        this.allowAutoscroll = false;
        this.loadOlderMessagesEvent.emit(this.messages[0].dateMs)
    }

    public setScrollHeight(): void {
        if (this.allowAutoscroll) {
            this.scrollBs$.next(this.messagesContainer.nativeElement.scrollHeight);
        }

    }
}
