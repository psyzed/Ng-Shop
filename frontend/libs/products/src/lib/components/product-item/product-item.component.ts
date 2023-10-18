import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '@frontend/products';

@Component({
    selector: 'products-product-item',
    templateUrl: './product-item.component.html',
    styles: []
})
export class ProductItemComponent {
    @Input() product: Product = {} as Product;

    private router = inject(Router);

    onNavigateToProduct(productId: string) {
        this.router.navigate(['product', productId]);
    }
}
