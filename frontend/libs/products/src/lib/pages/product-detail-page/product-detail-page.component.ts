import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductsService } from '@frontend/products';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { ConfirmationService } from 'primeng/api';

@Component({
    selector: 'products-product-page',
    templateUrl: './product-detail-page.component.html',
    styles: []
})
export class ProductDetailPageComponent implements OnInit, OnDestroy {
    public product: Product = {} as Product;
    public productQuantity = 0;

    private _destoyed$ = new Subject<void>();

    private _activatedRoute = inject(ActivatedRoute);
    private _productService = inject(ProductsService);
    private _confirmationService = inject(ConfirmationService);
    private _router = inject(Router);

    ngOnInit(): void {
        this._getProduct();
    }

    onAddToCart(productId: string): void {
        console.log(this.product);
    }

    onBuyNow(productId: string): void {
        console.log(productId);
    }

    private _getProduct(): void {
        this._activatedRoute.params
            .pipe(
                takeUntil(this._destoyed$),
                switchMap((params) => this._productService.getProductById(params['productId']))
            )
            .subscribe(
                (product) => {
                    this.product = product;
                },
                (error) => {
                    // Error handling
                    console.error('An error occurred:', error);
                    this._confirmationService.confirm({
                        message: 'An unexpected error occurred. Press ok to navigate to the products page.',
                        header: 'Error retrieving product',
                        icon: 'pi pi-exclamation-triangle',
                        accept: () => {
                            this._router.navigate(['products']);
                        }
                    });
                }
            );
    }

    ngOnDestroy(): void {
        this._destoyed$.next();
        this._destoyed$.complete();
    }
}
