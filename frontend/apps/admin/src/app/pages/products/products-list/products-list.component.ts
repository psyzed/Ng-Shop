import { Component } from '@angular/core';

@Component({
    selector: 'admin-products-list',
    templateUrl: './products-list.component.html'
})
export class ProductsListComponent {
    products = [];

    constructor() {}

    onDeleteProduct(productId: string) {}

    onEditProduct(productId: string) {}
}
