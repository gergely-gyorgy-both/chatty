import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DataListComponent } from './utils/data-list/data-list.component';
import { DialogComponent } from './utils/dialog/dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { DropdownComponent } from './utils/dropdown/dropdown.component';
import { ClickOutsideDirective } from './utils/click-outside.directive';
import { AsObservablePipe } from './utils/as-observable.pipe';
import { NgTemplateStrictTypeDirective } from './utils/ng-template-strict-type.directive';
import { CssInterceptorService } from '../services/css-interceptor.service';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { JWTInterceptorService } from '../services/jwt-interceptor.service';
import { CookieService } from 'ngx-cookie-service';
import { CommonChatComponent } from './chat/common-chat/common-chat.component';
import { ChatComponent } from './chat/chat.component';

@NgModule({
    declarations: [
        AppComponent,
        MainComponent,
        NavbarComponent,
        DataListComponent,
        DialogComponent,
        DropdownComponent,
        LoginComponent,
        ClickOutsideDirective,
        AsObservablePipe,
        NgTemplateStrictTypeDirective,
        CommonChatComponent,
        ChatComponent,
    ],
    imports: [
        BrowserModule,
        CommonModule,
        AppRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: CssInterceptorService,
            multi: true
        }, {
            provide: HTTP_INTERCEPTORS,
            useClass: JWTInterceptorService,
            multi: true
        },
        CookieService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
