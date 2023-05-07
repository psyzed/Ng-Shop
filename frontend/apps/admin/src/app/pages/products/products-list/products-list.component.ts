import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product, ProductsService } from '@frontend/products';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs';

@Component({
    selector: 'admin-products-list',
    templateUrl: './products-list.component.html'
})
export class ProductsListComponent implements OnInit {
    products: Product[] = [];

    constructor(
        private productsService: ProductsService,
        private toastMessageService: MessageService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this._getProducts();
    }

    private _getProducts() {
        this.productsService
            .getProducts()
            .pipe(take(1))
            .subscribe(
                (products: Product[]) => {
                    this.products = products;
                },
                (error) => {
                    this.toastMessageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Products could not be fetched, please try again later'
                    });
                }
            );
    }

    onDeleteProduct(productId: string) {}

    onEditProduct(productId: string) {
        this.router.navigate([`products/form/${productId}`]);
    }
}
