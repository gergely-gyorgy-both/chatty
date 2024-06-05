import { TestBed } from '@angular/core/testing';

import { CustomRouteReuseStrategy } from './custom-route-reuse-strategy.service';

describe('CustomRouteReuseStrategyService', () => {
    let service: CustomRouteReuseStrategy;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CustomRouteReuseStrategy);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
