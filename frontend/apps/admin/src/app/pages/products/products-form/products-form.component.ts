import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    CategoriesService,
    Category,
    Product,
    ProductsService
} from '@frontend/products';
import { filter, switchMap, take, tap, timer } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'admin-products-form',
    templateUrl: './products-form.component.html'
})
export class ProductsFormComponent implements OnInit {
    editMode = false;
    isSubmited = false;
    newProductForm: FormGroup;
    editedProductId: string;
    categories: Category[] = [];
    uploadedImage: string | ArrayBuffer | null;

    constructor(
        private formBuilder: FormBuilder,
        private toastMessageService: MessageService,
        private locationService: Location,
        private categoriesService: CategoriesService,
        private productsService: ProductsService,
        private activeRoute: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this._checkEditMode();
        this._initForm();
        this._getCategories();
    }

    onImageUpload(event: Event) {
        const inputElement = event.target as HTMLInputElement;
        if (
            inputElement &&
            inputElement.files &&
            inputElement.files.length > 0
        ) {
            const file = inputElement.files[0] as File;
            this.productForm['image'].patchValue(file);
            this.productForm['image'].updateValueAndValidity();
            const fileReader = new FileReader();
            fileReader.onload = () => {
                this.uploadedImage = fileReader.result;
            };
            fileReader.readAsDataURL(file);
        }
    }

    onSubmit() {
        this.isSubmited = true;
        if (this.newProductForm.valid) {
            const productFormData = new FormData();
            Object.keys(this.newProductForm.controls).map((key) => {
                productFormData.append(
                    key,
                    this.newProductForm.controls[key].value
                );
            });
            if (this.editMode) {
                this._editProduct(productFormData);
            } else {
                this._addProduct(productFormData);
            }
        }
    }

    private _initForm() {
        this.newProductForm = this.formBuilder.group({
            name: [null, Validators.required],
            brand: [null, Validators.required],
            price: [null, Validators.required],
            category: [null, Validators.required],
            countInStock: [null, Validators.required],
            description: [null, Validators.required],
            richDescription: [null, Validators.required],
            image: [null],
            isFeatured: [false]
        });
    }

    private _getCategories() {
        this.categoriesService
            .getCategories()
            .pipe(take(1))
            .subscribe((categories: Category[]) => {
                this.categories = categories;
            });
    }

    private _checkEditMode() {
        this.activeRoute.params
            .pipe(
                filter((params) => !!params['id']),
                tap((params) => {
                    this.editedProductId = params['id'];
                    this.editMode = true;
                }),
                switchMap((params) =>
                    this.productsService.getProductById(params['id'])
                )
            )
            .pipe(take(1))
            .subscribe((product: Product) => {
                this.productForm['name'].setValue(product.name);
                this.productForm['brand'].setValue(product.brand);
                this.productForm['price'].setValue(product.price);
                this.productForm['countInStock'].setValue(product.countInStock);
                this.productForm['category'].setValue(product.category._id);
                this.productForm['isFeatured'].setValue(product.isFeatured);
                this.productForm['description'].setValue(product.description);
                this.productForm['richDescription'].setValue(
                    product.richDescription
                );
                this.uploadedImage = product.image;
            });
    }

    private _addProduct(product: FormData) {
        this.productsService
            .addProduct(product)
            .pipe(take(1))
            .subscribe(
                (product: Product) => {
                    this.toastMessageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: `Product ${product.name} created`
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
                        detail: 'Product is not created, please try again later'
                    });
                }
            );
    }

    private _editProduct(product: FormData) {
        this.productsService
            .editProduct(product, this.editedProductId)
            .pipe(take(1))
            .subscribe(
                (res) => {
                    this.toastMessageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Product updated'
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
                        detail: 'Product was not updated, please try again later'
                    });
                }
            );
    }

    onGoBack() {
        this.locationService.back();
    }

    get productForm() {
        return this.newProductForm.controls;
    }
}
