import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
    selector: '[clickOutside]'
})
export class ClickOutsideDirective {
    private mouseDownInside!: boolean;

    @Output() public readonly clickOutside = new EventEmitter<void>();

    constructor(private readonly elementRef: ElementRef) { }

    @HostListener('document:mousedown', ['$event.target']) public onMouseDown(target: Element): void {
        this.mouseDownInside = (this.elementRef.nativeElement as HTMLElement).contains(target);
    }


    @HostListener('document:mouseup', ['$event.target']) public onMouseUp(target: Element): void {
        const mouseUpInside = (this.elementRef.nativeElement as HTMLElement).contains(target);
        if (!this.mouseDownInside && !mouseUpInside) {
            this.clickOutside.emit();
        }
    }



}
