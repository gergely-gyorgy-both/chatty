import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateFn, Router } from "@angular/router";
import { AuthService } from "./auth.service";

export enum UserStatus {
    LOGGED_IN = 'LOGGED_IN',
    NOT_LOGGED_IN = 'NOT_LOGGED_IN'
};


export const AuthGuard = (allowInCaseOf: UserStatus): CanActivateFn => (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
    const authService = inject(AuthService);
    const isUserLoggedIn = authService.isLoggedIn();
    const router = inject(Router);

    if (allowInCaseOf === UserStatus.LOGGED_IN) {
        if (!isUserLoggedIn) {
            router.navigate(['/']);
        }
        return isUserLoggedIn;
    }
    if (isUserLoggedIn) {
        router.navigate(['/chat']);
    }
    return !isUserLoggedIn;
}
