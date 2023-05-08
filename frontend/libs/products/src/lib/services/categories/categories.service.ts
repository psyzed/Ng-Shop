import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../../models/category.model';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
@Injectable({
    providedIn: 'root'
})
export class CategoriesService {
    apiURLCategories = `${environment.apiURL}categories`;
    constructor(private http: HttpClient) {}

    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(this.apiURLCategories);
    }

    getCategoryById(categoryId: string) {
        return this.http.get<Category>(
            `${this.apiURLCategories}/${categoryId}`
        );
    }

    createCategory(category: Category): Observable<Category> {
        return this.http.post<Category>(this.apiURLCategories, category);
    }

    editCategory(editedCategory: Category) {
        return this.http.put<Category>(
            `${this.apiURLCategories}/${editedCategory._id}`,
            editedCategory
        );
    }

    deleteCategory(categoryId: string): Observable<Category> {
        return this.http.delete<Category>(
            `${this.apiURLCategories}/${categoryId}`
        );
    }
}
