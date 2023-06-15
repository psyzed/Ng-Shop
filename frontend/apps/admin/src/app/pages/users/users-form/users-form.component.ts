import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User, UserApiResponse, UsersService } from '@frontend/users';
import { MessageService } from 'primeng/api';
import {
    catchError,
    filter,
    finalize,
    of,
    switchMap,
    take,
    tap,
    timer
} from 'rxjs';

@Component({
    selector: 'admin-users-form',
    templateUrl: './users-form.component.html'
})
export class UsersFormComponent implements OnInit {
    newUserForm: FormGroup;
    editMode = false;
    isSubmited = false;
    editedUserId: string;
    countries: { id: string; name: string }[];
    isLoading = false;

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
        this._getCountries();
        this._checkEditMode();
    }

    onSubmit() {
        this.isLoading = true;
        this.isSubmited = true;
        if (this.newUserForm.invalid) {
            this.isLoading = false;
            return;
        }
        const user: User = {
            id: this.editedUserId,
            name: this.userForm['name'].value,
            email: this.userForm['email'].value,
            password: this.userForm['password'].value,
            phone: this.userForm['phone'].value,
            isAdmin: this.userForm['isAdmin'].value,
            street: this.userForm['street'].value,
            apartment: this.userForm['apartment'].value,
            zip: this.userForm['zip'].value,
            city: this.userForm['city'].value,
            country: this.userForm['country'].value
        };
        if (this.editMode) {
            this._editUser(user);
        } else {
            this._addUser(user);
        }
    }

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

    private _addUser(user: User) {
        this.usersService
            .createUser(user)
            .pipe(
                tap(() => {
                    this.toastMessageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: `User ${user.name} is created!`
                    });
                    timer(2000)
                        .toPromise()
                        .then(() => {
                            this.locationService.back();
                        });
                }),
                catchError((error) => {
                    this.toastMessageService.add({
                        severity: 'error',
                        summary: 'Erros',
                        detail: 'Error creating user!'
                    });
                    return of(error);
                }),
                finalize(() => {
                    this.isLoading = false;
                    this.isSubmited = false;
                }),
                take(1)
            )
            .subscribe();
    }

    private _editUser(user: User) {
        this.usersService
            .updateUser(user)
            .pipe(
                tap(() => {
                    this.toastMessageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: `User ${user.name} is edited!`
                    });
                    timer(2000)
                        .toPromise()
                        .then(() => {
                            this.isLoading = false;
                            this.locationService.back();
                        });
                }),
                catchError((error) => {
                    this.toastMessageService.add({
                        severity: 'error',
                        summary: 'Erros',
                        detail: 'Error editing user!'
                    });
                    this.isLoading = false;
                    return of(error);
                }),
                finalize(() => {
                    this.isSubmited = false;
                }),
                take(1)
            )
            .subscribe();
    }

    private _getCountries() {
        this.countries = this.usersService.getCountries();
    }

    get userForm() {
        return this.newUserForm.controls;
    }
}
