import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LocalstorageService } from '@frontend/users';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private _apiURLUsers = `${environment.apiURL}users`;
    private _localStorageService = inject(LocalstorageService);
    private _router = inject(Router);

    constructor(private http: HttpClient) {}

    login(email: string, password: string): Observable<User> {
        return this.http.post<User>(`${this._apiURLUsers}/login`, {
            email,
            password
        });
    }

    logout(): void {
        this._localStorageService.removeJwtToken();
        this._router.navigate(['/login']);
    }
}
