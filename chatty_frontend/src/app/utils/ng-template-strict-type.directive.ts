import { Directive, Input } from '@angular/core';

interface Context<T> {
    dataPrototype: T;
    $implicit: T;
    rowProperties: {
        [key in string]: any
    };
    rowIdx: number;
}

@Directive({
    selector: 'ng-template[dataPrototype]',
})
export class NgTemplateStrictTypeDirective<T> {
    @Input() dataPrototype!: T[] | T;

    static ngTemplateContextGuard<T>(_dir: NgTemplateStrictTypeDirective<T>, ctx: any): ctx is Context<T> {
        return true;
    }

}
