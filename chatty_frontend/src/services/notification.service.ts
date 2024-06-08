import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { AppNotification, NotificationSeverity } from "../models/AppNotification";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    public currentNotification = new BehaviorSubject<AppNotification>(
        {
            text: '',
            severity: NotificationSeverity.OK
        }
    );

    constructor(private readonly http: HttpClient) {
    }

    public createNotification(notification: AppNotification) {
        this.currentNotification.next(notification);
    }

    public resetSession(): Observable<void> {
        return this.http.post<void>(`${environment.API_URL}/session/resetTimer`, {});
    }

}
