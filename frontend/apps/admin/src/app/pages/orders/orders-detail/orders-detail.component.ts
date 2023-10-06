import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ORDER_STATUS, Order, OrdersService } from '@frontend/orders';
import { filter, switchMap, take, tap, timer } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'admin-orders-detail',
    templateUrl: './orders-detail.component.html',
    styles: []
})
export class OrdersDetailComponent implements OnInit {
    editedOrderId: string;
    order: Order;
    orderStatuses: { id: number; name: string }[] = [];
    currentOrderStatus: { id: number; name: string };

    constructor(
        private ordersService: OrdersService,
        private locationService: Location,
        private activeRoute: ActivatedRoute,
        private toastMessageService: MessageService
    ) {}

    ngOnInit(): void {
        this.orderStatuses = Object.keys(ORDER_STATUS).map((key: string) => {
            return {
                id: +key,
                name: ORDER_STATUS[+key].label
            };
        });
        this._getOrder();
    }

    onStatusChange(event: any) {
        const orderStatus: { id: number; name: string } = event.value;
        this.ordersService
            .updateOrder({ status: orderStatus.id }, this.order._id)
            .pipe(take(1))
            .subscribe(
                (res) => {
                    this.toastMessageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: `Order ${res.order._id} status updated`
                    });
                    timer(2000)
                        .toPromise()
                        .then((done) => {
                            this.locationService.back();
                        });
                },
                (error) => {
                    this.toastMessageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Order was not created, please try again later'
                    });
                }
            );
    }

    private _getOrder() {
        this.activeRoute.params
            .pipe(
                filter((params) => !!params['id']),
                tap((params) => {
                    this.editedOrderId = params['id'];
                }),
                switchMap((params) =>
                    this.ordersService.getOrderById(params['id'])
                )
            )
            .pipe(take(1))
            .subscribe((order: Order) => {
                this.order = order;
                this.currentOrderStatus = this.orderStatuses.find(
                    (orderStatus) => orderStatus.id === this.order.status
                )!;
            });
    }
}
