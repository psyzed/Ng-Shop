import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductsService } from '@frontend/products';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CartItem, CartService } from '@frontend/orders';

@Component({
    selector: 'products-product-page',
    templateUrl: './product-detail-page.component.html',
    styles: []
})
export class ProductDetailPageComponent implements OnInit, OnDestroy {
    public product: Product = {} as Product;
    public productQuantity = 1;

    private _destoyed$ = new Subject<void>();

    private _activatedRoute = inject(ActivatedRoute);
    private _productService = inject(ProductsService);
    private _confirmationService = inject(ConfirmationService);
    private _router = inject(Router);
    private _cartService = inject(CartService);
    private _messageService = inject(MessageService);

    ngOnInit(): void {
        this._getProduct();
    }

    onAddToCart(product: Product) {
        const cartItem: CartItem = {
            productId: product._id,
            quantity: this.productQuantity
        };
        this._cartService.setCartItem(cartItem);
        this._messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Product ${product.name} added to cart`
        });
    }

    onBuyNow(productId: string): void {
        console.log(productId);
    }

    private _getProduct(): void {
        this._activatedRoute.params
            .pipe(
                takeUntil(this._destoyed$),
                switchMap((params) =>
                    this._productService.getProductById(params['productId'])
                )
            )
            .subscribe(
                (product) => {
                    this.product = product;
                },
                (error) => {
                    this._confirmationService.confirm({
                        message:
                            'An unexpected error occurred. Press ok to navigate to the products page.',
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
