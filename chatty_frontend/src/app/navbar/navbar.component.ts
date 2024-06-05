import { AfterViewInit, Component } from '@angular/core';
import { AppService } from '../../services/app.service';


@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements AfterViewInit {

    public touchStart!: number;
    public touchEnd!: number;

    private initialTransition!: string;

    constructor(private readonly appService: AppService) {
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
}
