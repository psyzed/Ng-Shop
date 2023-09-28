import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { Product, ProductFormData } from '../../models/product.model';

@Injectable({
    providedIn: 'root'
})
export class ProductsService {
    apiURLProducts = `${environment.apiURL}products`;
    constructor(private http: HttpClient) {}

    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(this.apiURLProducts);
    }

    getProductById(productId: string): Observable<Product> {
        return this.http.get<Product>(`${this.apiURLProducts}/${productId}`);
    }

    addProduct(product: FormData): Observable<Product> {
        return this.http.post<Product>(this.apiURLProducts, product);
    }

    editProduct(editedProduct: ProductFormData): Observable<Product> {
        return this.http.put<Product>(
            `${this.apiURLProducts}/${editedProduct.get('id')}`,
            editedProduct
        );
    }

    deleteProduct(productId: string): Observable<Product> {
        return this.http.delete<Product>(`${this.apiURLProducts}/${productId}`);
    }
}