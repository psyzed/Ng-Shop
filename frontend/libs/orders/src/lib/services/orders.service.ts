import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrdersService {
    private _apiURLOrders = `${environment.apiURL}orders`;
    constructor(private http: HttpClient) {}

    getOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(this._apiURLOrders);
    }

    getOrderById(orderId: string) {
        return this.http.get<Order>(`${this._apiURLOrders}/${orderId}`);
    }

    createOrder(order: Order): Observable<Order> {
        return this.http.post<Order>(this._apiURLOrders, order);
    }

    editOrder(editedOrder: Order) {
        return this.http.put<Order>(
            `${this._apiURLOrders}/${editedOrder._id}`,
            editedOrder
        );
    }

    deleteOrder(orderId: string): Observable<Order> {
        return this.http.delete<Order>(`${this._apiURLOrders}/${orderId}`);
    }
}
