import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.model';

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

    editProduct(
        editedProduct: FormData,
        editedProductId: string
    ): Observable<Product> {
        return this.http.put<Product>(
            `${this.apiURLProducts}/${editedProductId}`,
            editedProduct
        );
    }
}
