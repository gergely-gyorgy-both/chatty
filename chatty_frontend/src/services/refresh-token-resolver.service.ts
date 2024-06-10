import { inject, Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, ResolveFn } from '@angular/router';
import { iif, Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { CookieService } from 'ngx-cookie-service';


export const RefreshTokenResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> => {
    const authService = inject(AuthService);
    const cookieService = inject(CookieService);
    console.log('resolver works');
    return iif(
        () => Boolean(cookieService.get('auth')),
        of(true),
        authService.refreshToken$(cookieService.get('refresh'))
    );
};
