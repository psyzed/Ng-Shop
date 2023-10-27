import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from '@frontend/products';

@Component({
    selector: 'orders-cart-item',
    templateUrl: './cart-item.component.html',
    styles: []
})
export class CartItemComponent implements OnInit {
    @Input() public cartItem: Product = {} as Product;
    @Input() public itemIndex = 0;
    @Output() onDeleteItemFromCart = new EventEmitter<string>();
    @Output() onUpdateItemQuantity = new EventEmitter<{
        quantity: number;
        itemId: string;
    }>();

    public subtotal = 0;
    public cartItemQuantity = 0;

    ngOnInit(): void {
        this._calculateCartItemSubtotal();
    }

    private _calculateCartItemSubtotal(): void {
        if (this.cartItem.quantity) {
            this.subtotal = this.cartItem.price * this.cartItem.quantity;
        } else {
            this.subtotal = this.cartItem.price;
        }
    }

    updateItemQuantity(quantity: any, itemId: string): void {
        const item = { quantity, itemId };
        this.onUpdateItemQuantity.emit(item);
    }

    onDeleteItem(itemId: string): void {
        this.onDeleteItemFromCart.emit(itemId);
    }
}
