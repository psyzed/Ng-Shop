import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { User, UserApiResponse } from '../../models/user.model';
import * as countriesLib from 'i18n-iso-countries';

declare const require: any;
@Injectable({
    providedIn: 'root'
})
export class UsersService {
    apiURLUsers = `${environment.apiURL}users`;
    constructor(private http: HttpClient) {
        countriesLib.registerLocale(
            require('i18n-iso-countries/langs/en.json')
        );
    }

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.apiURLUsers);
    }

    getUserById(userId: string): Observable<UserApiResponse> {
        return this.http.get<UserApiResponse>(`${this.apiURLUsers}/${userId}`);
    }

    createUser(user: User): Observable<User> {
        return this.http.post<User>(this.apiURLUsers, user);
    }

    updateUser(user: User): Observable<User> {
        return this.http.put<User>(`${this.apiURLUsers}/${user.id}`, user);
    }

    deleteUser(userId: string): Observable<User> {
        return this.http.delete<User>(`${this.apiURLUsers}/${userId}`);
    }

    getCountryName(countryKey: string) {
        return countriesLib.getName(countryKey, 'en');
    }

    getCountries(): { id: string; name: string }[] {
        return Object.entries(
            countriesLib.getNames('en', { select: 'official' })
        ).map((entry) => {
            return { id: entry[0], name: entry[1] };
        });
    }

    getTotalUsers(): Observable<UserApiResponse> {
        return this.http.get<UserApiResponse>(`${this.apiURLUsers}/totalusers`);
    }
}
