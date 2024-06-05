import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DataListComponent } from './utils/data-list/data-list.component';
import { DialogComponent } from './utils/dialog/dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { DropdownComponent } from './utils/dropdown/dropdown.component';
import { ClickOutsideDirective } from './utils/click-outside.directive';
import { AsObservablePipe } from './utils/as-observable.pipe';
import { NgTemplateStrictTypeDirective } from './utils/ng-template-strict-type.directive';
import { CssInterceptorService } from '../services/css-interceptor.service';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        DataListComponent,
        DialogComponent,
        DropdownComponent,
        ClickOutsideDirective,
        AsObservablePipe,
        NgTemplateStrictTypeDirective,
    ],
    imports: [
        BrowserModule,
        CommonModule,
        AppRoutingModule,
        ReactiveFormsModule,
        HttpClientModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: CssInterceptorService,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
