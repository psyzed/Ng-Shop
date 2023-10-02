import { Component, OnInit } from '@angular/core';
import { ORDER_STATUS, Order, OrdersService } from '@frontend/orders';
import { MessageService } from 'primeng/api';
import { take, tap } from 'rxjs';

@Component({
    selector: 'admin-orders-list',
    templateUrl: './orders-list.component.html',
    styles: []
})
export class OrdersListComponent implements OnInit {
    orders: Order[] = [];
    orderStatus = ORDER_STATUS;

    constructor(
        private ordersService: OrdersService,
        private toastMessageService: MessageService
    ) {}

    ngOnInit(): void {
        this._getOrders();
    }

    onDeleteOrder(id: string) {}

    onShowOrder(id: string) {}

    private _getOrders() {
        this.ordersService
            .getOrders()
            .pipe(
                take(1),
                tap(
                    (res) => {
                        this.orders = res;
                    },
                    (error) => {
                        this.toastMessageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Orders could not be fetched, please try again later'
                        });
                    }
                )
            )
            .subscribe(() => {});
    }
}
