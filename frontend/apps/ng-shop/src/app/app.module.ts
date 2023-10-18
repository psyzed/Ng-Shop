import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProductsModule } from '@frontend/products';

import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { UiModule } from '@frontend/ui';
import { AccordionModule } from 'primeng/accordion';
import { NavComponent } from './shared/nav/nav.component';
import { ProductsRoutingModule } from 'libs/products/src/lib/products-routing.module';
@NgModule({
    declarations: [AppComponent, HomePageComponent, HeaderComponent, FooterComponent, NavComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        UiModule,
        AccordionModule,
        ProductsModule,
        ProductsRoutingModule,
        RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' })
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
