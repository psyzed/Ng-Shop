import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import {
    DashBoardTotals,
    Order,
    OrderApiResponse
} from '../models/order.model';
import { ApiResponse, Product } from '@frontend/products';
import { OrderItem } from '../models/order-item.model';
import { StripeService } from 'ngx-stripe';
import { StripeError } from '@stripe/stripe-js';

@Injectable({ providedIn: 'root' })
export class OrdersService {
    private _apiURLOrders = `${environment.apiURL}orders`;
    constructor(
        private http: HttpClient,
        private stripeService: StripeService
    ) {}

    getOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(this._apiURLOrders);
    }

    getOrderById(orderId: string) {
        return this.http.get<Order>(`${this._apiURLOrders}/${orderId}`);
    }

    createOrder(order: Order): Observable<Order> {
        return this.http.post<Order>(this._apiURLOrders, order);
    }

    updateOrder(
        orderStatus: { status: number },
        orderId: string
    ): Observable<OrderApiResponse> {
        return this.http.put<OrderApiResponse>(
            `${this._apiURLOrders}/${orderId}`,
            orderStatus
        );
    }

    deleteOrder(orderId: string): Observable<OrderApiResponse> {
        return this.http.delete<OrderApiResponse>(
            `${this._apiURLOrders}/${orderId}`
        );
    }

    getTotalOrders(): Observable<DashBoardTotals> {
        return this.http.get<DashBoardTotals>(
            `${this._apiURLOrders}/totalorders`
        );
    }

    getTotalSales(): Observable<DashBoardTotals> {
        return this.http.get<DashBoardTotals>(
            `${this._apiURLOrders}/totalsales`
        );
    }

    getProductsByIds(productIds: string[]): Observable<ApiResponse<Product[]>> {
        return this.http.post<ApiResponse<Product[]>>(
            `${environment.apiURL}products/getProductsByIds`,
            { ids: productIds }
        );
    }

    createCheckoutSession(orderItems: OrderItem[]): Observable<string> {
        return this.http.post<string>(
            `${this._apiURLOrders}/create-checkout-session`,
            orderItems
        );
    }

    redirectToCheckout(sessionId: string): Observable<{ error: StripeError }> {
        return this.stripeService.redirectToCheckout({ sessionId });
    }

    cacheOrderData(order: Order): void {
        localStorage.setItem('orderData', JSON.stringify(order));
    }

    getCachedOrderData(): Order | null {
        const orderData = localStorage.getItem('orderData');
        if (orderData) {
            return JSON.parse(orderData);
        } else {
            return null;
        }
    }

    removeCachedOrderData(): void {
        localStorage.removeItem('orderData');
    }
}
