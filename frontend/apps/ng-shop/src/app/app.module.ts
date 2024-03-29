import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProductsModule } from '@frontend/products';
import { OrdersModule } from '@frontend/orders';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { UiModule } from '@frontend/ui';
import { NavComponent } from './shared/nav/nav.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from '@frontend/users';
import { NgxStripeModule } from 'ngx-stripe';
import { environment } from '@env/environment';
@NgModule({
    declarations: [
        AppComponent,
        HomePageComponent,
        HeaderComponent,
        FooterComponent,
        NavComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        UiModule,
        OrdersModule,
        ProductsModule,
        NgxStripeModule.forRoot(
            'pk_test_51LB19UL8s2T2UvuTcFKvt2wd1WYSMTrwmnil2yAFop7c0iCbIhqg89neZcdmjFboUP6bmOAIZVEuJGZ5s52OYDrE00VVPxCRse'
        ),
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        RouterModule.forRoot(appRoutes, {
            initialNavigation: 'enabledBlocking'
        }),
        !environment.production ? StoreDevtoolsModule.instrument() : []
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
