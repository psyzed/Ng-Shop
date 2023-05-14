import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    apiURLUsers = `${environment.apiURL}users`;
    constructor(private http: HttpClient) {}

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.apiURLUsers);
    }

    deleteUser(userId: string): Observable<User> {
        return this.http.delete<User>(`${this.apiURLUsers}/${userId}`);
    }
}
