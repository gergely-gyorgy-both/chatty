import { Pipe, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Pipe({
    name: 'asObservable',
    pure: true
})
export class AsObservablePipe<T> implements PipeTransform {

    private bs$ = new BehaviorSubject<T | undefined>(undefined);


    public transform(value: T): Observable<T | undefined> {
        this.bs$.next(value);
        return this.bs$;
    }

}
