import { Component, OnInit, inject } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductsService } from '../../services/products/products.service';
import { take, tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Category } from '../../models/category.model';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'products-list',
    templateUrl: './products-list.component.html',
    styles: []
})
export class ProductsListComponent implements OnInit {
    public products: Product[] = [];
    public categories: Category[] = [];

    private _productsService = inject(ProductsService);
    private _toastMessageService = inject(MessageService);
    private _activatedRoute = inject(ActivatedRoute);

    ngOnInit(): void {
        this._getCategories();
        this._checkRouteParamsBeforeFetchingProducts();
    }

    onFilterCategory(event: any): void {
        const selectedCategories = this.categories.filter((category) => category.checked);
        const selectedCategoriesIds = selectedCategories.map((category) => category._id);

        this._getProducts(selectedCategoriesIds);
    }

    private _getProducts(categoriesIds?: string[]): void {
        this._productsService
            .getProducts(categoriesIds)
            .pipe(
                take(1),
                tap((products: Product[]) => {
                    this.products = products;
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

    private _getCategories(): void {
        this._activatedRoute.data
            .pipe(
                take(1),
                tap((res) => {
                    this.categories = res['categories'];
                })
            )
            .subscribe(
                () => {},
                (error) => {
                    this._toastMessageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Categories could not be fetched, please try again later'
                    });
                }
            );
    }

    private _checkRouteParamsBeforeFetchingProducts(): void {
        const paramRoute = this._activatedRoute.firstChild;
        if (paramRoute) {
            paramRoute.params.pipe(take(1)).subscribe((params) => {
                const categoryId = params['categoryId'];
                if (categoryId) {
                    this._updateCategoriesArrayWithCheckedCategories(categoryId);
                    this._getProducts([categoryId]);
                }
            });
        } else {
            this._getProducts();
        }
    }

    private _updateCategoriesArrayWithCheckedCategories(categoriesId: string): void {
        const categoryIndex = this.categories.findIndex((category) => category._id === categoriesId);
        if (categoryIndex !== -1) {
            this.categories[categoryIndex].checked = true;
            this.categories = [...this.categories];
            console.log(this.categories);
        }
    }
}
