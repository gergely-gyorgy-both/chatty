import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { AppService } from '../services/app.service';
import { delay, filter, of, tap } from 'rxjs';
import { AppNotification, NotificationSeverity } from '../models/AppNotification';
import { NotificationService } from '../services/notification.service';


const notificationSeverityCSSLookup: { [key in NotificationSeverity]?: string } = {
    [NotificationSeverity.OK]: 'alert-success',
    [NotificationSeverity.WARNING]: 'alert-warning',
    [NotificationSeverity.ALERT]: 'alert-danger',
};


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
    @ViewChild('alert') alert!: ElementRef;

    public notification: AppNotification = { text: '', severity: NotificationSeverity.OK };

    public constructor(public appService: AppService, private readonly notificationService: NotificationService) { }

    public ngAfterViewInit(): void {
        this.notificationService.currentNotification.pipe(
            filter((notification) => {
                return notification.text !== '';
            }),
            tap((notification: AppNotification) => {
                this.notification.text = notification.text;
                this.notification.severity = notification.severity;
                this.alert.nativeElement.classList.remove('hidden');
                this.alert.nativeElement.classList.add('show');
            }),
            delay(3000),
            tap(_ => {
                this.dismissNotification();
            })
        )
            .subscribe();
    }

    public getNotificationSeverityCSS = ((severity: NotificationSeverity): string | undefined =>
        notificationSeverityCSSLookup[severity]
    );

    public dismissNotification(): void {
        this.alert.nativeElement.classList.remove('show');
        of(true).pipe(
            delay(500)
        ).subscribe(_ => {
            this.alert.nativeElement.classList.add('hidden');
        });
    }

}
