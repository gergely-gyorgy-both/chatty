import { Component } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { DateTime } from 'luxon';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {

    public usernameFormControl;

    constructor(fb: NonNullableFormBuilder, private readonly authService: AuthService, private readonly router: Router) {
        this.usernameFormControl = fb.control('', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(20)]));
    }

    public login(): void {
        if (this.usernameFormControl.valid) {
            this.authService.login$(this.usernameFormControl.value).subscribe(response => {
                this.router.navigate(['/chat']);
            });
        }
    }


}
