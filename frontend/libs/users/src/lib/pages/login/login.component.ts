import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators
} from '@angular/forms';
import { take } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService, LocalstorageService } from '@frontend/users';

@Component({
    selector: 'users-login',
    templateUrl: './login.component.html',
    styles: []
})
export class LoginComponent implements OnInit {
    public loginForm: FormGroup;
    public isSubmited = false;
    public authError = false;
    public authErrorMessage = 'Invalid credentials';

    constructor(
        private authService: AuthService,
        private localStorageService: LocalstorageService,
        private formBuilder: FormBuilder,
        private router: Router
    ) {}

    ngOnInit(): void {
        this._initForm();
    }

    onSubmit() {
        this.isSubmited = true;
        this.authError = false;
        if (this.loginForm.valid) {
            const loginData = this.loginForm.value;
            this.authService
                .login(loginData.email, loginData.password)
                .pipe(take(1))
                .subscribe(
                    (user) => {
                        const userToken = user.token;
                        if (userToken) {
                            this.localStorageService.setJWTToken(userToken);
                            this.router.navigate(['/']);
                        }
                    },
                    (error: HttpErrorResponse) => {
                        this.authError = true;
                        if (error.status !== 400) {
                            this.authErrorMessage =
                                'Internal Server Error - Please try again later';
                        }
                    }
                );
        }
    }

    private _initForm(): void {
        this.loginForm = this.formBuilder.group({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', Validators.required)
        });
    }

    get loginFormControls() {
        return this.loginForm.controls;
    }
}
