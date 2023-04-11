import { Component, OnInit } from '@angular/core';
import { CategoriesService, Category } from '@frontend/products';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
    selector: 'admin-categories-list',
    templateUrl: './categories-list.component.html'
})
export class CategoriesListComponent implements OnInit {
    categories: Category[] = [];

    constructor(
        private categoriesService: CategoriesService,
        private toastMessageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this._getCategories();
    }

    private _getCategories() {
        this.categoriesService
            .getCategories()
            .subscribe((categories: Category[]) => {
                this.categories = categories;
            });
    }

    onDeleteCategory(id: string) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete this category?',
            header: 'Delete Category',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.categoriesService.deleteCategory(id).subscribe(
                    (res) => {
                        this.toastMessageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Category deleted'
                        });
                        this._getCategories();
                    },
                    (error) => {
                        this.toastMessageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Category is not deleted, please trye again later'
                        });
                    }
                );
            },
            reject: () => {}
        });
    }
}
