import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product, ProductsService } from '@frontend/products';
import { ConfirmationService, MessageService } from 'primeng/api';
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
        private confirmationService: ConfirmationService,
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

    onDeleteProduct(productId: string) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete this product?',
            header: 'Delete Product',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.productsService
                    .deleteProduct(productId)
                    .pipe(take(1))
                    .subscribe(
                        (product: Product) => {
                            this.toastMessageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: `Product Deleted!`
                            });
                            this._getProducts();
                        },
                        (error) => {
                            this.toastMessageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Product was not deleted, please try again later'
                            });
                        }
                    );
            }
        });
    }

    onEditProduct(productId: string) {
        this.router.navigate([`products/form/${productId}`]);
    }
}
