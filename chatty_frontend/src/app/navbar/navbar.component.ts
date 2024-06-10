import { AfterViewInit, Component } from '@angular/core';
import { AppService } from '../../services/app.service';
import { ChatService } from '../../services/chat.service';
import { FormControl, Validators } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { delay, map, of, switchMap } from 'rxjs';
import { AuthService } from '../../services/auth.service';


@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements AfterViewInit {

    public touchStart!: number;
    public touchEnd!: number;

    private initialTransition!: string;

    public privateChatUsernameFormControl = new FormControl('', Validators.compose([Validators.required]));

    constructor(
        private readonly appService: AppService,
        public readonly chatService: ChatService,
        private readonly cookieService: CookieService,
        private readonly authService: AuthService
    ) {
        this.privateChatUsernameFormControl.addAsyncValidators((control) => {
            return of(control).pipe(
                delay(1000),
                switchMap(control => this.authService.checkUsername(control.value)),
                map(doesUserExist => doesUserExist ? null : { userNotFound: true })
            );
        })
        this.privateChatUsernameFormControl.valueChanges.subscribe(() => {
            console.log(this.privateChatUsernameFormControl.errors);
        })
    }

    public ngAfterViewInit(): void {
        const sidebar = document.getElementById('sidebar') as HTMLElement;

        this.initialTransition = sidebar.style.transition;

        let didMove = false;

        document.addEventListener(
            'touchstart',
            (e => {
                didMove = false;
                if (this.appService.isSidebarOpen) {
                    this.touchStart = e.targetTouches[0].clientX;
                    this.touchEnd = e.targetTouches[0].clientX;
                    sidebar.style.setProperty("--transition", 'none');
                }
            })
        )

        document.addEventListener(
            'touchmove',
            (e => {
                didMove = true;
                const isMobileScreen = window.matchMedia('(max-width: 1199px)').matches;
                if (this.appService.isSidebarOpen && isMobileScreen) {
                    const prevTouchEnd = this.touchEnd;
                    this.touchEnd = e.targetTouches[0].clientX
                    if (prevTouchEnd !== this.touchEnd && this.touchEnd < this.touchStart) {
                        sidebar.style.setProperty("--pos-x", (this.touchEnd - this.touchStart).toString());
                    }
                }
            })
        )

        document.addEventListener('touchend', e => {
            const isMobileScreen = window.matchMedia('(max-width: 1199px)').matches;
            if (this.appService.isSidebarOpen && isMobileScreen) {
                const target = e.target as HTMLElement;
                if (this.touchStart - this.touchEnd > 45
                    || (!didMove && document.getElementById('main')?.contains(target))) {
                    this.appService.toggleSidebar();
                }
                sidebar.style.setProperty("--pos-x", '0');
                sidebar.style.setProperty("--transition", this.initialTransition);
            }
        })
    }

    public get currentUsername(): string {
        return jwtDecode<{ username: string }>(this.cookieService.get('refresh')).username
    }

    public addPrivateChatRoom(): void {
        if (this.privateChatUsernameFormControl.valid && this.privateChatUsernameFormControl.value) {
            this.chatService.addPrivateChatRoom(this.privateChatUsernameFormControl.value);
            this.privateChatUsernameFormControl.reset();
        }
    }
}
