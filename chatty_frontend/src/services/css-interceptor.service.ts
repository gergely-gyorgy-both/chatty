import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { finalize, tap } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class CssInterceptorService {

    constructor() {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.headers.get('Skip-Loading-Spinner')) {
            return next.handle(req);
        }
        return next.handle(req).pipe(
            tap(_ => {
                document.getElementById('loadingSpinner')!.style.display = 'block';
            }),
            finalize(() => {
                document.getElementById('loadingSpinner')!.style.display = 'none';
            })
        );
    }
}
