import { Component, OnInit, inject } from '@angular/core';
import { Product, ProductsService } from '@frontend/products';
import { MessageService } from 'primeng/api';
import { take, tap } from 'rxjs';

@Component({
    selector: 'products-featured-products',
    templateUrl: './featured-products.component.html',
    styles: []
})
export class FeaturedProductsComponent implements OnInit {
    public featuredProducts: Product[] = [];

    private _productsService = inject(ProductsService);
    private _toastMessageService = inject(MessageService);
    private _featuredProductsCount = 4;

    ngOnInit(): void {
        this._getFeaturedProducts();
    }

    private _getFeaturedProducts(): void {
        this._productsService
            .getFeaturedProducts(this._featuredProductsCount)
            .pipe(
                take(1),
                tap((products: Product[]) => {
                    this.featuredProducts = products;
                })
            )
            .subscribe(
                () => {},
                (error) => {
                    this._toastMessageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Products could not be fetched, please try again later'
                    });
                }
            );
    }
}
