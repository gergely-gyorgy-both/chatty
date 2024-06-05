import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AppService {

    constructor() { }

    public toggleSidebar(): void {
        if (this.isSidebarOpen) {
            document.body.classList.remove('toggle-sidebar');
        } else {
            document.body.classList.add('toggle-sidebar');
        }
    }

    public get isSidebarOpen(): boolean {
        return document.body.classList.contains('toggle-sidebar');
    }
}
