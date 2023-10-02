import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriesService, Category } from '@frontend/products';
import { ConfirmationService, MessageService } from 'primeng/api';
import { take } from 'rxjs';

@Component({
    selector: 'admin-categories-list',
    templateUrl: './categories-list.component.html'
})
export class CategoriesListComponent implements OnInit {
    categories: Category[] = [];

    constructor(
        private categoriesService: CategoriesService,
        private toastMessageService: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this._getCategories();
    }

    editCategory(categoryId: string) {
        this.router.navigate([`categories/form/${categoryId}`]);
    }

    onDeleteCategory(categoryId: string) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete this category?',
            header: 'Delete Category',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.categoriesService
                    .deleteCategory(categoryId)
                    .pipe(take(1))
                    .subscribe(
                        (category: Category) => {
                            this.toastMessageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: `Category ${category.name} deleted`
                            });
                            this._getCategories();
                        },
                        (error) => {
                            this.toastMessageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Category was not deleted, please try again later'
                            });
                        }
                    );
            }
        });
    }

    private _getCategories() {
        this.categoriesService
            .getCategories()
            .pipe(take(1))
            .subscribe(
                (categories: Category[]) => {
                    this.categories = categories;
                },
                (error) => {
                    this.toastMessageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Categories could not be fetched, please try again later'
                    });
                }
            );
    }
}
