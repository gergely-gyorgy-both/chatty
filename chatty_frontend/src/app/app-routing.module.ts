import { NgModule } from '@angular/core';
import { RouteReuseStrategy, RouterModule, Routes } from '@angular/router';

import { CustomRouteReuseStrategy } from '../services/custom-route-reuse-strategy.service';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { AuthGuard, UserStatus } from '../services/auth.guard';
import { CommonChatComponent } from './chat/common-chat/common-chat.component';


const routes: Routes = [
    {
        path: '', component: LoginComponent,
        canActivate: [AuthGuard(UserStatus.NOT_LOGGED_IN)]
    },
    {
        path: 'chat', component: MainComponent,
        canActivate: [AuthGuard(UserStatus.LOGGED_IN)],
        children: [
            {
                path: '',
                component: CommonChatComponent
            }
        ]
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

