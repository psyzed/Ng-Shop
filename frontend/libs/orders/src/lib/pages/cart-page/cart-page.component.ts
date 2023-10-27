import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CartItem, CartService, OrdersService } from '@frontend/orders';
import { Product } from '@frontend/products';
import { MessageService } from 'primeng/api';
import { Subject, map, takeUntil } from 'rxjs';

@Component({
    selector: 'orders-cart-page',
    templateUrl: './cart-page.component.html',
    styles: []
})
export class CartPageComponent implements OnInit, OnDestroy {
    public products: Product[] = [];
    public totalItemsPrice = 0;
    public shippingCosts: number = 0;
    public totalOrderPrice = 0;
    public isShippingFree = false;

    private _destroyed$ = new Subject<void>();
    private _freeShippingLimit = 1500;
    private _shippingAndPackagingCosts = 20;

    private _router = inject(Router);
    private _cartService = inject(CartService);
    private _ordersService = inject(OrdersService);
    private _messageService = inject(MessageService);

    ngOnInit(): void {
        this._getCart();
    }

    onUpdateItemQuantity(item: { quantity: number; itemId: string }): void {
        this._cartService.updateCartItem({
            productId: item.itemId,
            quantity: item.quantity
        });
    }

    onDeleteItemFromCart(itemId: string): void {
        this._cartService.deleteCartItem(itemId);
        this._messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Product deleted from cart`
        });
        if (this.products.length === 0) {
            this._resetPrices();
        }
    }

    onNavigate(path: string): void {
        if (path === '/checkout') {
            const orderData = {
                totalItemsPrice: this.totalItemsPrice,
                shippingCosts: this.shippingCosts,
                totalOrderPrice: this.totalOrderPrice,
                isShippingFree: this.isShippingFree,
                products: this.products
            };
            this._router.navigate([path], { state: orderData });
        } else {
            this._router.navigate([path]);
        }
    }

    private _getCart(): void {
        let cartItems: CartItem[] = [];
        this._cartService.cart$
            .pipe(takeUntil(this._destroyed$))
            .subscribe((res) => {
                if (
                    res.cart &&
                    res.cart.items.length > 0 &&
                    res.getProducts === true
                ) {
                    cartItems = res.cart.items;
                    this._getProducts(cartItems);
                } else if (res.cart && res.cart.items.length > 0) {
                    cartItems = res.cart.items;
                } else {
                    this.products = [];
                }
                this._calculatePrices();
            });
    }

    private _getProducts(cartItems: CartItem[]): void {
        const productIds = cartItems.map((item) => item.productId);

        this._ordersService
            .getProductsByIds(productIds)
            .pipe(
                takeUntil(this._destroyed$),
                map((res) => {
                    return res.data.map((product) => {
                        const item = cartItems.find(
                            (item) => item.productId === product._id
                        );
                        return { ...product, quantity: item?.quantity };
                    });
                })
            )
            .subscribe((products) => {
                this.products = products;
                this._calculatePrices();
            });
    }

    private _calculatePrices(): void {
        this.totalItemsPrice = this.products.reduce((total, product) => {
            return (
                total +
                (product.quantity
                    ? product.quantity * product.price
                    : product.price)
            );
        }, 0);

        if (this.products.length === 0) {
            this._resetPrices();
        } else {
            this._calculateShippingCosts();
        }
    }

    private _calculateShippingCosts() {
        if (this.totalItemsPrice > this._freeShippingLimit) {
            this.shippingCosts = 0;
            this.isShippingFree = true;
            this.totalOrderPrice = this.totalItemsPrice;
        } else {
            this.shippingCosts = this._shippingAndPackagingCosts;
            this.isShippingFree = false;
            this.totalOrderPrice = this.totalItemsPrice + this.shippingCosts;
        }
    }

    private _resetPrices() {
        this.shippingCosts = 0;
        this.isShippingFree = false;
        this.totalItemsPrice = 0;
        this.totalOrderPrice = 0;
    }

    ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }
}
