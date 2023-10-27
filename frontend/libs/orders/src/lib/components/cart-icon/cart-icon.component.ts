import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '@frontend/orders';

@Component({
    selector: 'orders-cart-icon',
    templateUrl: './cart-icon.component.html'
})
export class CartIconComponent implements OnInit {
    public cartItemsCount = '0';

    private _cartSevice = inject(CartService);
    private _router = inject(Router);

    ngOnInit(): void {
        this._cartSevice.cart$.subscribe((res) => {
            if (res.cart === null) {
                this.cartItemsCount = '0';
            }
            res.cart
                ? (this.cartItemsCount = res.cart.items.length.toString())
                : '0';
        });
    }

    navigateToCart(): void {
        this._router.navigate(['cart']);
    }
}
