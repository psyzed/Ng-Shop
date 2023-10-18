import { Component, OnInit, inject } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductsService } from '@frontend/products';
import { ActivatedRoute, Router } from '@angular/router';
import { take, tap } from 'rxjs';
import { ConfirmationService } from 'primeng/api';

@Component({
    selector: 'products-product-page',
    templateUrl: './product-detail-page.component.html',
    styles: []
})
export class ProductDetailPageComponent implements OnInit {
    public product: Product = {} as Product;
    public productQuantity = 0;

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
        const productId = this._getProductIdFromRoute;
        this._productService
            .getProductById(productId)
            .pipe(
                take(1),
                tap((product: Product) => {
                    this.product = product;
                })
            )
            .subscribe(
                () => {},
                (error) => {
                    this._confirmationService.confirm({
                        message: 'Press ok to navigate to the products page',
                        header: 'Product not found',
                        icon: 'pi pi-exclamation-triangle',
                        accept: () => {
                            this._router.navigate(['products']);
                        }
                    });
                }
            );
    }

    private get _getProductIdFromRoute(): string {
        return this._activatedRoute.snapshot.paramMap.get('productId')!;
    }
}
