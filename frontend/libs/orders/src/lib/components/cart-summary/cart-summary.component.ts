import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'orders-cart-summary',
    templateUrl: './cart-summary.component.html',
    styles: []
})
export class CartSummaryComponent {
    @Input() public totalItemsPrice = 0;
    @Input() public totalOrderPrice = 0;
    @Input() public shippingPrice: number = 0;
    @Input() public isShippingFree = false;
    @Input() public btnText = 'Checkout';
    @Input() public isBtnEnabled = true;
    @Output() public confirm = new EventEmitter<void>();

    onConfirm(): void {
        this.confirm.emit();
    }
}
