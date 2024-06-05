import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import * as bootstrap from 'bootstrap';

export enum ModalSize {
    SMALL = 'modal-sm',
    MEDIUM = '',
    LARGE = 'modal-lg',
    XLARGE = 'modal-xl'
}

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements AfterViewInit, OnDestroy {

    @Input() modalSize: ModalSize = ModalSize.MEDIUM;

    @ViewChild('modal', { static: false }) private modalElement!: ElementRef;

    public modal?: bootstrap.Modal;

    public ngAfterViewInit(): void {
        this.modal = new bootstrap.Modal(this.modalElement.nativeElement, {});
        this.modal?.show();
    }

    public ngOnDestroy(): void {
        this.modal?.hide();
    }




    constructor() { }

}
