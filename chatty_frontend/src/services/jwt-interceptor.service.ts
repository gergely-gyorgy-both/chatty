import { Injectable } from '@angular/core';
import { HttpEvent, HttpEventType, HttpHandler, HttpRequest } from "@angular/common/http";
import { iif, Observable, of } from "rxjs";
import { finalize, switchMap, tap } from "rxjs/operators";
import { CookieService } from 'ngx-cookie-service';
import { DateTime } from 'luxon';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class JWTInterceptorService {

    constructor(private readonly cookieService: CookieService, private readonly authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let shouldRefreshToken = (!Boolean(this.cookieService.get('auth')) && Boolean(this.cookieService.get('refresh')));

        if (req.headers.get('Skip-Token-Refresh')) {
            shouldRefreshToken = false;
        }

        req = req.clone({
            setHeaders: {
                'Content-Type': 'application/json; charset=utf-8',
                'Accept': 'application/json',
                'Authorization': `Bearer ${this.cookieService.get('auth')}`,
            },
        });
        return (
            iif(
                () => shouldRefreshToken,
                this.authService.refreshToken$(this.cookieService.get('refresh')).pipe(

                ),
                of(true)
            )
        ).pipe(
            switchMap((_) => {
                return next.handle(req);
            })
        );

    }
}
