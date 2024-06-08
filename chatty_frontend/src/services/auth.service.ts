import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, EMPTY, Observable, of, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { NotificationService } from './notification.service';
import { NotificationSeverity } from '../models/AppNotification';
import { CookieService } from 'ngx-cookie-service';
import { DateTime } from 'luxon';

export interface UserLoginResponse {
    accessToken: string;
    refreshToken: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private readonly http: HttpClient, private readonly notificationService: NotificationService, private readonly cookieService: CookieService) { }

    public isLoggedIn(): boolean {
        return Boolean(this.cookieService.get('auth')) || Boolean(this.cookieService.get('refresh'));
    }

    public login$(username: string): Observable<UserLoginResponse> {
        return this.http.post<UserLoginResponse>(`${environment.API_URL}/user/login`, { username }).pipe(
            tap(response => {
                this.notificationService.createNotification({ text: 'Login successful', severity: NotificationSeverity.OK });
                this.setCookie({ key: 'auth', value: response.accessToken, expiry: DateTime.now().plus({ hours: 1 }).toJSDate() });
                this.setCookie({ key: 'refresh', value: response.refreshToken, expiry: DateTime.now().plus({ days: 7 }).toJSDate() });
            }),
            catchError((error: HttpErrorResponse) => {
                console.error(error);
                this.notificationService.createNotification({ text: `Login failed.${error.status === 400 ? 'Username already taken.' : ''}`, severity: NotificationSeverity.ALERT });
                return EMPTY;
            })
        );
    }

    public refreshToken$(refreshToken: string): Observable<UserLoginResponse> {

        return this.http.post<UserLoginResponse>(`${environment.API_URL}/user/refresh`, { refreshToken }, {
            headers: {
                'Skip-Token-Refresh': 'true'
            }
        }).pipe(
            tap(response => {
                this.setCookie({ key: 'auth', value: response.accessToken, expiry: DateTime.now().plus({ hours: 1 }).toJSDate() });
                this.setCookie({ key: 'refresh', value: response.refreshToken, expiry: DateTime.now().plus({ days: 7 }).toJSDate() });
            })
        );
    }

    public logout(): Observable<void> {
        return this.http.delete<void>(`${environment.API_URL}/user/logout`).pipe(
            tap(() => {
                this.notificationService.createNotification({ text: 'Logout successful', severity: NotificationSeverity.OK });
                this.cookieService.delete('auth');
                this.cookieService.delete('refresh');
            })
        );
    }

    private setCookie(data: { key: string, value: string, expiry: Date }): void {
        this.cookieService.set(data.key, data.value, {
            expires: data.expiry,
            secure: true,
            sameSite: 'Strict'
        });
    }
}
