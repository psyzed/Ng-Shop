import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'admin-categories-form',
    templateUrl: './categories-form.component.html'
})
export class CategoriesFormComponent implements OnInit {
    newCategoryForm: FormGroup;
    isSubmited = false;

    constructor(private formBuilder: FormBuilder) {}

    ngOnInit(): void {
        this.newCategoryForm = this.formBuilder.group({
            name: [null, [Validators.required]],
            icon: [null, [Validators.required]]
        });
    }

    onSubmit() {
        this.isSubmited = true;
        if (this.newCategoryForm.valid) {
            console.log(this.newCategoryForm.value);
        }
    }

    get categoryForm() {
        return this.newCategoryForm.controls;
    }
}
