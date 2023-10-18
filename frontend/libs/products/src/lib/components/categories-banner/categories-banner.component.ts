import { Component, OnInit, inject } from '@angular/core';
import { Category } from '../../models/category.model';
import { CategoriesService } from '../../services/categories/categories.service';
import { take } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
    selector: 'products-categories-banner',
    templateUrl: './categories-banner.component.html',
    styles: []
})
export class CategoriesBannerComponent implements OnInit {
    private _categoriesService = inject(CategoriesService);
    private _toastMessageService = inject(MessageService);
    private _router = inject(Router);
    public categories: Category[] = [];

    ngOnInit(): void {
        this._getCategories();
    }

    goToCategory(categoryId: string) {
        this._router.navigate([`products/category/${categoryId}`]);
    }

    private _getCategories() {
        this._categoriesService
            .getCategories()
            .pipe(take(1))
            .subscribe(
                (categories: Category[]) => {
                    this.categories = categories;
                },
                (error) => {
                    this._toastMessageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Categories could not be fetched, please try again later'
                    });
                }
            );
    }
}
