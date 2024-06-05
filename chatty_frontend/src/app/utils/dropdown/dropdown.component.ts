import { Component, ElementRef, Input } from '@angular/core';
import * as bootstrap from 'bootstrap';

@Component({
    selector: 'app-dropdown',
    templateUrl: './dropdown.component.html',
    styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent {

    @Input() toggler!: HTMLElement;
    @Input() content!: HTMLElement;

    public dropdown!: bootstrap.Dropdown;

    title = 'chatty';

    public ngAfterViewInit(): void {
        this.dropdown = new bootstrap.Dropdown(this.content, { reference: this.toggler });
        this.toggler.addEventListener('click', (_event) => { this.dropdown.toggle() });
    }



}
