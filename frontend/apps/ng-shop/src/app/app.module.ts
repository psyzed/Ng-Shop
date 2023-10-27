import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProductsModule } from '@frontend/products';
import { OrdersModule } from '@frontend/orders';

import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { UiModule } from '@frontend/ui';
import { NavComponent } from './shared/nav/nav.component';
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
        RouterModule.forRoot(appRoutes, {
            initialNavigation: 'enabledBlocking'
        })
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
