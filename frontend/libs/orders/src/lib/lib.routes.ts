import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { CheckoutPageComponent } from './pages/checkout-page/checkout-page.component';
import { authGuard } from '@frontend/users';
import { ThankYouPageComponent } from './pages/thank-you-page/thank-you-page.component';

export const ordersRoutes: Route[] = [
    { path: 'cart', component: CartPageComponent },
    {
        path: 'checkout',
        component: CheckoutPageComponent,
        canActivate: [authGuard()]
    },
    { path: 'success', component: ThankYouPageComponent }
];

@NgModule({
    imports: [RouterModule.forChild(ordersRoutes)],
    exports: [RouterModule]
})
export class OrdersRoutingModule {}
