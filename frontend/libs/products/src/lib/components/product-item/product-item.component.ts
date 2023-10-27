import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '@frontend/products';
import { CartItem, CartService } from '@frontend/orders';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'products-product-item',
    templateUrl: './product-item.component.html'
})
export class ProductItemComponent {
    @Input() product: Product = {} as Product;

    private _router = inject(Router);
    private _cartService = inject(CartService);
    private _messageService = inject(MessageService);

    onNavigateToProduct(productId: string) {
        this._router.navigate(['product', productId]);
    }

    onAddToCart(product: Product) {
        const cartItem: CartItem = { productId: product._id, quantity: 1 };
        this._cartService.setCartItem(cartItem);
        this._messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Product ${product.name} added to cart`
        });
    }
}
