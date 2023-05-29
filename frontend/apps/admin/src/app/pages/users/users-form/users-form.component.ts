import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserApiResponse, UsersService } from '@frontend/users';
import { MessageService } from 'primeng/api';
import { catchError, filter, of, switchMap, take, tap } from 'rxjs';

@Component({
    selector: 'admin-users-form',
    templateUrl: './users-form.component.html'
})
export class UsersFormComponent implements OnInit {
    newUserForm: FormGroup;
    editMode = false;
    isSubmited = false;
    editedUserId: string;
    countries: string[];

    constructor(
        private formBuilder: FormBuilder,
        private usersService: UsersService,
        private toastMessageService: MessageService,
        private locationService: Location,
        private activeRoute: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.newUserForm = this.formBuilder.group({
            name: [null, Validators.required],
            email: [null, [Validators.required, Validators.email]],
            password: [null, Validators.required],
            phone: [null, Validators.required],
            isAdmin: [false],
            street: [null],
            apartment: [null],
            zip: [null],
            city: [null],
            country: [null]
        });

        this._checkEditMode();
    }

    onSubmit() {}

    onGoBack() {
        this.locationService.back();
    }

    private _checkEditMode() {
        this.activeRoute.params
            .pipe(
                filter((params) => !!params['id']),
                tap((params) => {
                    this.editedUserId = params['id'];
                    this.editMode = true;
                }),
                switchMap((params) =>
                    this.usersService.getUserById(params['id'])
                ),
                catchError((error) => {
                    return of(error);
                })
            )
            .pipe(take(1))
            .subscribe((user: UserApiResponse) => {
                this.userForm['name'].setValue(user.user.name);
                this.userForm['email'].setValue(user.user.email);
                this.userForm['phone'].setValue(user.user.phone);
                this.userForm['isAdmin'].setValue(user.user.isAdmin);
                this.userForm['street'].setValue(user.user.street);
                this.userForm['apartment'].setValue(user.user.apartment);
                this.userForm['zip'].setValue(user.user.zip);
                this.userForm['city'].setValue(user.user.city);
                this.userForm['country'].setValue(user.user.country);

                this.userForm['password'].setValidators([]);
                this.userForm['password'].updateValueAndValidity();
            });
    }

    get userForm() {
        return this.newUserForm.controls;
    }
}
