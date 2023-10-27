import { NgModule, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from './services/cart.service';
import { CartIconComponent } from './components/cart-icon/cart-icon.component';
import { UiModule } from '@frontend/ui';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { OrdersRoutingModule } from './lib.routes';
import { CartItemComponent } from './components/cart-item/cart-item.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CartSummaryComponent } from './components/cart-summary/cart-summary.component';
import { CheckoutPageComponent } from './pages/checkout-page/checkout-page.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        UiModule,
        OrdersRoutingModule
    ],
    declarations: [
        CartIconComponent,
        CartPageComponent,
        CartItemComponent,
        CartSummaryComponent,
        CheckoutPageComponent
    ],
    exports: [
        CartIconComponent,
        CartPageComponent,
        OrdersRoutingModule,
        CartSummaryComponent,
        CheckoutPageComponent
    ]
})
export class OrdersModule {
    private _cartService = inject(CartService);

    constructor() {
        this._cartService.initCartLocalStorage();
    }
}
