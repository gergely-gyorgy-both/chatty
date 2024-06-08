import { Component } from '@angular/core';
import { AppService } from '../../services/app.service';
import { jwtDecode } from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrl: './main.component.scss'
})
export class MainComponent {

    public username: string;

    public constructor(
        public appService: AppService,
        private readonly authService: AuthService,
        private readonly cookieService: CookieService,
        private readonly router: Router
    ) {
        this.username = jwtDecode<{ username: string }>(this.cookieService.get('refresh')).username;
    }

    public logout(): void {
        this.authService.logout().subscribe(() => {
            this.router.navigate(['/']);
        });
    }
}
