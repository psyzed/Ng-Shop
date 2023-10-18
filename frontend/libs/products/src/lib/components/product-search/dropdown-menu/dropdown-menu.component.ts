import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../../models/product.model';

@Component({
    selector: 'dropdown-menu',
    templateUrl: './dropdown-menu.component.html',
    styles: []
})
export class DropdownMenuComponent {
    @Input() public products: Product[] = [];

    @Output() public onProductSelected = new EventEmitter<string>();

    onSelectProduct(productId: string) {
        this.onProductSelected.emit(productId);
    }
}
