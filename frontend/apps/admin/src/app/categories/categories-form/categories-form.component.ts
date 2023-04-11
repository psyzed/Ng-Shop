import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriesService, Category } from '@frontend/products';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';

@Component({
    selector: 'admin-categories-form',
    templateUrl: './categories-form.component.html'
})
export class CategoriesFormComponent implements OnInit {
    newCategoryForm: FormGroup;
    isSubmited = false;

    constructor(
        private formBuilder: FormBuilder,
        private categoriesService: CategoriesService,
        private toastMessageService: MessageService,
        private locationService: Location
    ) {}

    ngOnInit(): void {
        this.newCategoryForm = this.formBuilder.group({
            name: [null, [Validators.required]],
            icon: [null, [Validators.required]]
        });
    }

    onSubmit() {
        this.isSubmited = true;
        if (this.newCategoryForm.valid) {
            const category: Category = {
                name: this.categoryForm['name'].value,
                icon: this.categoryForm['icon'].value
            };
            this.categoriesService.createCategory(category).subscribe(
                (res) => {
                    this.toastMessageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Category created'
                    });
                    timer(2000)
                        .toPromise()
                        .then((done) => {
                            this.locationService.back();
                        });
                },
                (error) => {
                    this.toastMessageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Category is not created, please trye again later'
                    });
                }
            );
        }
    }

    get categoryForm() {
        return this.newCategoryForm.controls;
    }
}
