import { NgModule } from '@angular/core';
import { RouteReuseStrategy, RouterModule, Routes } from '@angular/router';

import { CustomRouteReuseStrategy } from '../services/custom-route-reuse-strategy.service';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
    {
        path: '', component: LoginComponent,
    },
    {
        path: '**', redirectTo: '',
    },

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [
        // { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy }
    ]
})
export class AppRoutingModule { }

