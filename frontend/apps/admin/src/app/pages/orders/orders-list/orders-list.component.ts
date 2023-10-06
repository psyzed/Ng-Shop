import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ORDER_STATUS, Order, OrdersService } from '@frontend/orders';
import { ConfirmationService, MessageService } from 'primeng/api';
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
        private toastMessageService: MessageService,
        private router: Router,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this._getOrders();
    }

    onShowOrder(id: string) {
        this.router.navigateByUrl(`orders/${id}`);
    }

    onDeleteOrder(orderId: string) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete this order?',
            header: 'Delete Order',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.ordersService
                    .deleteOrder(orderId)
                    .pipe(take(1))
                    .subscribe(
                        (res) => {
                            this.toastMessageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: `Order ${res.order._id} deleted`
                            });
                            this._getOrders();
                        },
                        (error) => {
                            this.toastMessageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Order was not deleted, please try again later'
                            });
                        }
                    );
            }
        });
    }

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
