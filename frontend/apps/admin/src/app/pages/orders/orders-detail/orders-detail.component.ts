import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order, OrdersService } from '@frontend/orders';
import { filter, switchMap, take, tap } from 'rxjs';

@Component({
    selector: 'admin-orders-detail',
    templateUrl: './orders-detail.component.html',
    styles: []
})
export class OrdersDetailComponent implements OnInit {
    editedOrderId: string;
    order: Order;

    constructor(
        private ordersService: OrdersService,
        private activeRoute: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this._getOrder();
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
            });
    }
}
