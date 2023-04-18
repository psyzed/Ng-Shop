import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService, Category } from '@frontend/products';
import { MessageService } from 'primeng/api';
import { filter, switchMap, take, tap, timer } from 'rxjs';

@Component({
    selector: 'admin-categories-form',
    templateUrl: './categories-form.component.html'
})
export class CategoriesFormComponent implements OnInit {
    newCategoryForm: FormGroup;
    isSubmited = false;
    editMode = false;
    editedCategoryId: string;

    constructor(
        private formBuilder: FormBuilder,
        private categoriesService: CategoriesService,
        private toastMessageService: MessageService,
        private locationService: Location,
        private activeRoute: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.newCategoryForm = this.formBuilder.group({
            name: [null, [Validators.required]],
            icon: [null, [Validators.required]],
            color: ['#fff']
        });

        this._checkEditMode();
    }

    onSubmit() {
        this.isSubmited = true;
        if (this.newCategoryForm.valid) {
            const category: Category = {
                _id: this.editedCategoryId,
                name: this.categoryForm['name'].value,
                icon: this.categoryForm['icon'].value,
                color: this.categoryForm['color'].value
            };

            if (this.editMode) {
                this._editCategory(category);
            } else {
                this._createCategory(category);
            }
        }
    }

    private _checkEditMode() {
        this.activeRoute.params
            .pipe(
                filter((params) => !!params['id']),
                tap((params) => {
                    this.editedCategoryId = params['id'];
                    this.editMode = true;
                }),
                switchMap((params) =>
                    this.categoriesService.getCategoryById(params['id'])
                )
            )
            .pipe(take(1))
            .subscribe((res: Category) => {
                this.categoryForm['name'].setValue(res.name);
                this.categoryForm['icon'].setValue(res.icon);
                this.categoryForm['color'].setValue(res.color);
            });
    }

    private _createCategory(category: Category) {
        this.categoriesService
            .createCategory(category)
            .pipe(take(1))
            .subscribe(
                (category: Category) => {
                    this.toastMessageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: `Category ${category.name} created`
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

    private _editCategory(category: Category) {
        this.categoriesService
            .editCategory(category)
            .pipe(take(1))
            .subscribe(
                (res) => {
                    this.toastMessageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Category updated'
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
                        detail: 'Category is not updated, please trye again later'
                    });
                }
            );
    }

    onGoBack() {
        this.locationService.back();
    }

    get categoryForm() {
        return this.newCategoryForm.controls;
    }
}
