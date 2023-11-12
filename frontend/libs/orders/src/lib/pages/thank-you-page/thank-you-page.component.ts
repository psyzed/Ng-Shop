import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { OrdersService } from '../../services/orders.service';
import { CartService, Order } from '@frontend/orders';
import { Subject, takeUntil, tap } from 'rxjs';

@Component({
    selector: 'orders-thank-you-page',
    templateUrl: './thank-you-page.component.html'
})
export class ThankYouPageComponent implements OnInit, OnDestroy {
    private _ordersService = inject(OrdersService);
    private _cartService = inject(CartService);

    public orderData: Order | null = null;

    private destroyed$ = new Subject<void>();

    ngOnInit(): void {
        this.orderData = this._getOrderData();
        this._placeOrder();
    }

    private _getOrderData(): Order | null {
        return this._ordersService.getCachedOrderData();
    }

    private _placeOrder(): void {
        if (this.orderData) {
            this._ordersService
                .createOrder(this.orderData)
                .pipe(takeUntil(this.destroyed$))
                .subscribe(() => {
                    this._cartService.resetCart();
                    this._ordersService.removeCachedOrderData();
                });
        }
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
