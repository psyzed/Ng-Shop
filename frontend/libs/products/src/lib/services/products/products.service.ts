import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { Product, ProductApiResponse, ProductFormData } from '../../models/product.model';

@Injectable({
    providedIn: 'root'
})
export class ProductsService {
    apiURLProducts = `${environment.apiURL}products`;
    constructor(private http: HttpClient) {}

    getProducts(categoriesIds?: string[], searchTerm?: string): Observable<Product[]> {
        let params = new HttpParams();
        if (categoriesIds) {
            params = params.append('categories', categoriesIds.join(','));
        }

        if (searchTerm) {
            params = params.append('search', searchTerm);
        }

        return this.http.get<Product[]>(this.apiURLProducts, { params: params });
    }

    getFeaturedProducts(count: number): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.apiURLProducts}/get/featured/${count}`);
    }

    getProductById(productId: string): Observable<Product> {
        return this.http.get<Product>(`${this.apiURLProducts}/${productId}`);
    }

    addProduct(product: FormData): Observable<Product> {
        return this.http.post<Product>(this.apiURLProducts, product);
    }

    editProduct(editedProduct: ProductFormData): Observable<Product> {
        return this.http.put<Product>(`${this.apiURLProducts}/${editedProduct.get('id')}`, editedProduct);
    }

    deleteProduct(productId: string): Observable<Product> {
        return this.http.delete<Product>(`${this.apiURLProducts}/${productId}`);
    }

    getTotalProducts(): Observable<ProductApiResponse> {
        return this.http.get<ProductApiResponse>(`${this.apiURLProducts}/get/totalproducts`);
    }
}
