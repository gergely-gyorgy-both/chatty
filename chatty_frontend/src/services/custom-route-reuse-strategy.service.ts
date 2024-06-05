import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, BaseRouteReuseStrategy } from '@angular/router';
import { isNotNullish } from '../app/utils/utils';



export class CustomRouteReuseStrategy extends BaseRouteReuseStrategy {

    override shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        const shouldNotReuse =
            isNotNullish(future.data['shouldReuseRoute'])
            && !future.data['shouldReuseRoute'];
        return shouldNotReuse ? false : super.shouldReuseRoute(future, curr);
    }
}
